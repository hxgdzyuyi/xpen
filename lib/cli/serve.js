var fs = require('fs')
  , os = require('os')
  , clc = require('cli-color')
  , stylus = require('stylus')
  , connect = require('connect')
  , serveStatic = require('serve-static')
  , path = require('path')

module.exports = function() {
  var server = connect()
    , source = path.resolve(process.cwd(), '.')

  var tmpdir = os.tmpdir()

  server.use(stylus.middleware({
    src: source
  , dest: tmpdir
  }))

  server.use(serveStatic(tmpdir, {
    dotfiles: 'ignore'
  }))

  server.use(serveStatic(source, {
    dotfiles: 'ignore'
  , index: ['index.html', 'index.htm', 'html.html']
  }))

  var port = '8888'
  server.listen(port, function() {
    console.log('\033[90mserving \033[36m%s\033[90m on port \033[96m%d\033[0m', source, port)
  })
}
