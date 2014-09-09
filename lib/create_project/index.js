var _ = require('underscore')
  , path = require('path')
  , fs = require('fs')
  , utils = require('../utils')

function HtmlManager(options) {
  this.config = options.config
  this.type = options.type || 'html'
  this.tmpl = fs.readFileSync(
      path.resolve(__dirname, './tmpl/html.' + this.type)
    , { encoding: 'utf8' })
}

_.extend(HtmlManager.prototype, {
  typeConfig: {
    html: {
      scriptTmpl: '\n    <script src="<%= url %>"></script>'
    , stylesheetTmpl: '\n    <link rel="stylesheet" href="<%= url %>">'
    }
  , jade: {
      scriptTmpl: '\n    script(src="<%= url %>")'
    , stylesheetTmpl: '\n    link(rel="stylesheet", href="<%= url %>")'
    }
  }
, externals: {
    jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js'
  , angular: '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular.min.js'
  , yui: '//cdnjs.cloudflare.com/ajax/libs/yui/3.17.2/yui/yui-min.js'
  }
, getSource: function() {
    var config = this.config

    var innerHtml = this.getExternalsSource('stylesheet', config.css_library)
      + this.config.html
      + this.getExternalsSource('script', config.js_library, config.js_external)

    return _.template(this.tmpl
      , { title: this.config.title, content: innerHtml })
  }
, makeExternal: function(urlOrName, urlType) {
    var externalUrl = this.externals[urlOrName]
    if (!externalUrl) { externalUrl = urlOrName }
    var externalTmpl = this.typeConfig[this.type][urlType + 'Tmpl']
    return _.template(externalTmpl, { url: externalUrl })
  }
, getExternalsSource: function() {
    var args = _.toArray(arguments)
      , externalType = args.shift()
      , externalsArray = _(args).filter(function(externals) {
          return !!externals
        })

    if (!externalsArray.length) { return '' }

    return _.chain(externalsArray)
      .map(function(externals) { return externals.split(';') })
      .reduce(function(memo, externals) { return memo.concat(externals) })
      .map(function(external) {
        return this.makeExternal(external, externalType)
      }, this)
      .value().join('')
  }
})

function normalizeProjectName(title) {
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
    , projectName = normalizeProjectName(title)

  fs.mkdirSync(projectName)

  var htmlPreProcessor = config.html_pre_processor === 'jade' ? 'jade' : 'html'
    , htmlManager = new HtmlManager({
        config: config
      , type: htmlPreProcessor
      })
    , htmlPath = path.resolve(projectName, 'html.' + htmlPreProcessor)

  fs.writeFileSync(htmlPath, htmlManager.getSource())

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

  utils.success('Create XPen successfully at `' + projectName +'` folder')
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
