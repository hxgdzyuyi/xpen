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

    case 'f':
    case 'fetch':
      cli.fetch(args.shift())
      break;

    case 's':
    case 'serve':
      cli.serve()
      break;

    case 'u':
    case 'uplaod':
      cli.upload(args.shift())
      break;

    default:
      console.log(arg)
  }
}
