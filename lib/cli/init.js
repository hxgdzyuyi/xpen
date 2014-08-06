var fs = require('fs')
  , clc = require('cli-color')

module.exports = function(projectName) {
  try {
    fs.mkdirSync(projectName)
  } catch(e) {
    console.log(clc.red('Error: ' + e.code))
  }

  var setupTmpl = require('../templates/default/setup')
  setupTmpl(projectName)
}
