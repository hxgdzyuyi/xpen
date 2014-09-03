#!/usr/bin/env node

var cli = require('../lib/cli')

var args = process.argv.slice(2)
  , clc = require('cli-color')

var usage = [
  ''
, 'Commands:'
, '  init: Create a xpen project'
, '  fetch <fetcher>: Fetch xpen project from codepen'
, '  upload <uploader>: Upload xpen project'
, '  serve [-p|--port <args>]: Create a server'
, ''
].join('\n')

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

  case 'h':
  case 'help':
    console.error(usage)
    process.exit(1)
    break;

  case 's':
  case 'serve':
    cli.serve(args)
    break;

  case 'u':
  case 'upload':
    cli.upload(args.shift())
    break;

  default:
    process.exit(1)
}
