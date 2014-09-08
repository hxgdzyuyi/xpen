var _ = require('underscore')
  , path = require('path')
  , fs = require('fs')
  , utils = require('../utils.js')

function getJsLibrary(libraryName) {
  var libraries = {
    jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js'
  , angular: '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular.min.js'
  , yui: '//cdnjs.cloudflare.com/ajax/libs/yui/3.17.2/yui/yui-min.js'
  }
  var library = libraries[libraryName]
  if (!library) { return '' }
  return '\n<script src="' + library + '"></script>'
}

function getExternals(type, externals) {
  if (!externals) { return '' }
  var externals = externals.split(';')
  return externals.map(function(external) {
    if (type === 'js') {
      return '\n<script src="' + external + '"></script>'
    } else {
      return '\n<link rel="stylesheet" href="' + external + '">'
    }
  }).join('')
}

function getProjectName(title) {
  var projectName = title.toLowerCase().replace(/\s/ig, '-')

  var projectNumber = 1
    , projectNameWithNumber = projectName

  while(fs.existsSync(projectNameWithNumber)) {
    projectNameWithNumber =  projectName + '-' + (++projectNumber)
  }

  return projectNameWithNumber
}

function createProject(config) {
  var title = config.title || 'XPen'
    , projectName = getProjectName(title)

  fs.mkdirSync(projectName)

  if (config.html_pre_processor === 'none') {
    var htmlTmplPath = path.resolve(__dirname, './tmpl/html.html' )
      , htmlTmpl = fs.readFileSync(htmlTmplPath, { encoding: 'utf8' })
      , htmlSource = getExternals('css', config.css_external)
          + config.html
          + getJsLibrary(config.js_library)
          + getExternals('js', config.js_external)
      , htmlPath = path.resolve(projectName, 'html.html')

    fs.writeFileSync(htmlPath, htmlTmpl
      .replace('{{title}}', title)
      .replace('{{content}}', htmlSource))
  }

  if (config.js_pre_processor === 'none') {
    var jsPath = path.resolve(projectName, 'js.js')
    fs.writeFileSync(jsPath, config.js)
  }

  if (config.css_pre_processor === 'none'
     || config.css_pre_processor === 'css') {
    var cssPath = path.resolve(projectName, 'css.css')
    fs.writeFileSync(cssPath, config.css)
  } else if (config.css_pre_processor === 'stylus') {
    var stylPath = path.resolve(projectName, 'css.styl')
    fs.writeFileSync(stylPath, config.css)
  } else if (config.css_pre_processor === 'scss') {
    var scssPath = path.resolve(projectName, 'css.scss')
    fs.writeFileSync(scssPath, config.css)
  }

  utils.createXpenJson(projectName,
    _.pick(config,
      'title'
    , 'css_pre_processor'
    , 'js_pre_processor'
    , 'html_pre_processor'
    )
  )
}

var defaults = {
  css: ''
, js: ''
, html: ''
, html_pre_processor: 'none'
, css_pre_processor: 'none'
, js_pre_processor: 'none'
, js_external: ''
, js_library: ''
, css_external: ''
, title: 'xpen example'
}

module.exports = function(config) {
  createProject(_.extend({}, defaults, config))
}
