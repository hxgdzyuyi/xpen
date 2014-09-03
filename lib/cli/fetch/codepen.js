var request = require('request')
  , cheerio = require('cheerio')
  , _ = require('underscore')
  , createProject = require('../../create_project')

request = request.defaults({jar: true})

var request = require('request')
  , cheerio = require('cheerio')

function canFetchProject(pen) {
  var fetchable = true
  if (pen.css_prefix === 'autoprefixer') {
    console.log('Xpen is\'t support `css autoprefixer`')
    fetchable = false
  }

  if (pen.css_pre_processor_lib === 'compass'
    || pen.css_pre_processor_lib === 'bourbon') {
    console.log('Xpen is\'t support ' + pen.css_pre_processor_lib)
    fetchable = false
  }

  if (pen.html_pre_processor !== 'none') {
    console.log('Xpen is\'t support ' + pen.html_pre_processor)
    fetchable = false
  }

  if (['stylus', 'none', 'scss'].indexOf(pen.css_pre_processor) === -1) {
    console.log('Xpen is\'t support ' + pen.css_pre_processor)
    fetchable = false
  }
  return fetchable
}

function createCodepenProject(pen) {
  var projectName = pen.title
    ? pen.title.toLowerCase().replace(/\s/ig, '-')
    : pen.slug_hash

  if (!canFetchProject(pen)) {
    console.log('Project can\'t fetched')
    return
  }

  createProject(_.extend({
    title: pen.title || pen.slug_hash
  }, pen))
}

exports.fetch = function(url) {
  request(url, function(error, response, body) {
    var $ = cheerio.load(body)
      , data = JSON.parse($('#init-data').attr('value'))
      , pen = JSON.parse(data.__pen)
    createCodepenProject(pen)
  })
}
