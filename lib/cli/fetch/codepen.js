var request = require('request')
  , cheerio = require('cheerio')
  , _ = require('underscore')
  , createProject = require('../../create_project')
  , utils = require('../../utils')

request = request.defaults({jar: true})

var request = require('request')
  , cheerio = require('cheerio')

function canFetchProject(pen) {
  var fetchable = true
  if (pen.css_prefix === 'autoprefixer') {
    utils.error('Xpen is\'t support `css autoprefixer`')
    fetchable = false
  }

  if (pen.css_pre_processor_lib === 'compass'
    || pen.css_pre_processor_lib === 'bourbon') {
    utils.error('Xpen is\'t support ' + pen.css_pre_processor_lib)
    fetchable = false
  }

  if (!_.contains(['none', 'jade', 'html'], pen.html_pre_processor)) {
    utils.error('Xpen is\'t support ' + pen.html_pre_processor)
    fetchable = false
  }

  if (['stylus', 'none', 'scss'].indexOf(pen.css_pre_processor) === -1) {
    utils.error('Xpen is\'t support ' + pen.css_pre_processor)
    fetchable = false
  }
  return fetchable
}

function createCodepenProject(pen) {
  var projectName = pen.title
    ? pen.title.toLowerCase().replace(/\s/ig, '-')
    : pen.slug_hash

  if (!canFetchProject(pen)) {
    utils.error('Project can\'t fetched')
    return
  }

  createProject(_.extend({
    title: pen.title || pen.slug_hash
  }, pen))
}

exports.fetch = function(url) {
  var rUrl = /http:\/\/codepen.io\/\S+\/pen\/\S+/
  if (!rUrl.test(url)) {
    return utils.error('Url is error, correct url regex is `'
      + rUrl.source + '`')
  }
  request(url, function(error, response, body) {
    var $ = cheerio.load(body)
      , data = JSON.parse($('#init-data').attr('value'))
      , pen = JSON.parse(data.__pen)
    createCodepenProject(pen)
  })
}
