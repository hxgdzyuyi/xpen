var fs = require('fs')
  , _ = require('underscore')
  , clc = require('cli-color')
  , inquirer = require("inquirer")
  , createProject = require('../create_project')

module.exports = function(args) {
  var createProjectFast = false
    , fastProjectName
    , arg

  while (args.length) {
    arg = args.shift()
    switch(arg) {
      case '-f':
      case '--fast':
        createProjectFast = true
        break;
      default:
        fastProjectName = arg
    }
  }

  if (createProjectFast) {
    return createProject({
      title: fastProjectName
    , js_library: 'jquery'
    , css_pre_processor: 'stylus'
    , html_pre_processor: 'jade'
    })
  }

  inquirer.prompt([{
    type: 'input'
  , name: 'title'
  , message: 'What\'s the project name?'
  }, {
    type: 'list'
  , name: 'html_pre_processor'
  , message: 'Which html pre processor do you want?'
  , choices: [ 'jade', 'html' ]
  }, {
    type: 'list'
  , name: 'css_pre_processor'
  , message: 'Which css pre processor do you want?'
  , choices: [ 'css', 'stylus', 'scss' ]
  }, {
    type: 'checkbox'
  , name: 'js_library'
  , message: 'Which library do you want?'
  , choices: [{ name: 'jquery' }]
  }], function( answers ) {
    createProject({
      title: answers.title
    , js_library: answers.js_library.join(';')
    , css_pre_processor: answers.css_pre_processor
    , html_pre_processor: answers.html_pre_processor
    })
  })
}
