#!/usr/bin/env node

var cli = require('../lib/cli')

var args = process.argv.slice(2)
  , clc = require('cli-color')

while (args.length) {
  arg = args.shift()
  switch(arg) {
    case 'i':
    case 'init':
      cli.init(args.shift())
      break;

    default:
      console.log(arg)
  }
}
