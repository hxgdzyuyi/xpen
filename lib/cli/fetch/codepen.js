var request = require('request')
  , cheerio = require('cheerio')
  , _ = require('underscore')
  , createProject = require('../../create_project')

request = request.defaults({jar: true})

var request = require('request')
  , cheerio = require('cheerio')

function createCodepenProject(pen) {
  var projectName = pen.title
    ? pen.title.toLowerCase().replace(/\s/ig, '-')
    : pen.slug_hash

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
