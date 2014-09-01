var request = require('request')
  , cheerio = require('cheerio')
  , path = require('path')

request = request.defaults({jar: true})

var request = require('request')
  , cheerio = require('cheerio')
  , fs = require('fs')

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

function createProject(pen) {
  var projectName = pen.title + '_' + pen.slug_hash
  fs.mkdirSync(projectName)

  if (pen.html_pre_processor === 'none') {
    var htmlTmplPath = path.resolve(__dirname, '../../file_template/html.html' )
      , htmlTmpl = fs.readFileSync(htmlTmplPath, { encoding: 'utf8' })
      , htmlSource = getExternals('css', pen.css_external)
          + pen.html
          + getJsLibrary(pen.js_library)
          + getExternals('js', pen.js_external)
      , htmlPath = path.resolve(projectName, 'html.html')
    fs.writeFileSync(htmlPath, htmlTmpl.replace('{{content}}', htmlSource))
  }

  if (pen.js_pre_processor === 'none') {
    var jsPath = path.resolve(projectName, 'js.js')
    fs.writeFileSync(jsPath, pen.js)
  }

  if (pen.css_pre_processor === 'none') {
    var cssPath = path.resolve(projectName, 'css.css')
    fs.writeFileSync(cssPath, pen.css)
  } else if (pen.css_pre_processor === 'stylus') {
    var stylPath = path.resolve(projectName, 'css.styl')
    fs.writeFileSync(stylPath, pen.css)
  }
}

exports.fetch = function(url) {
  request(url, function(error, response, body) {
    var $ = cheerio.load(body)
      , data = JSON.parse($('#init-data').attr('value'))
      , pen = JSON.parse(data.__pen)
    console.log(pen)
    createProject(pen)
  })
}
