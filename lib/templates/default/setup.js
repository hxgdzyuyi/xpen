var _ = require('underscore')
  , ncp = require('ncp').ncp
  , clc = require('cli-color')
  , path = require('path')
  , files = ['html.html', 'css.styl', 'js.js']

module.exports = function(projectName) {
  _.each(files, function(fileName) {
    var source = path.resolve(__dirname, './' + fileName)
      , dest = projectName + '/' + fileName

    ncp(source, dest, function(err) {
      if (!err) { return }
      console.log(clc.red(err))
    })
  })
}
