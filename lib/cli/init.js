var fs = require('fs')
  , _ = require('underscore')
  , clc = require('cli-color')
  , inquirer = require("inquirer")
  , createProject = require('../create_project')

module.exports = function(projectName) {
  inquirer.prompt([{
    type: 'input'
  , name: 'title'
  , message: 'What\'s the project name?'
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
    })
  })
}
