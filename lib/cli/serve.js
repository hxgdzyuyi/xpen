var fs = require('fs')
  , os = require('os')
  , clc = require('cli-color')
  , stylus = require('stylus')
  , sass = require('node-sass')
  , connect = require('connect')
  , serveStatic = require('serve-static')
  , path = require('path')
  , utils = require('../utils')

function serveHtml() {

  var rbody = /<\/body>(?![\s\S]*<\/body>)/i
    , rhead = /<\/head>(?![\s\S]*<\/head>)/i

  function accept(req) {
    var ha = req.headers["accept"]
    if (!ha) return false
    return (~ha.indexOf("html"))
  }

  function check(str, arr) {
   if (!str) return true;
    return arr.some(function(item) {
      if ((item.test && item.test(str)) || ~str.indexOf(item)) {
        return true
      }
      return false
    });
  }

  function exists(body) {
    if (!body) return false;
    return rbody.test(body);
  }

  function snap(body) {
    var _body = body;
    _body = body.replace(rbody, function(w) {
      return w + '<script type="text/javascript" src="js.js"></script>'
    }).replace(rhead, function(w) {
      return w + '<link rel="stylesheet" href="css.css">'
    })
    return _body
  }

  function html(str) {
    if (!str) return false;
    return /<[:_-\w\s\!\/\=\"\']+>/i.test(str)
  }

  return function(req, res, next) {
    var writeHead = res.writeHead
    var write = res.write
    var end = res.end

    if (!accept(req) || check(req.url, ['.js', '.css'])) {
      return next()
    }

    function restore() {
      res.writeHead = writeHead;
      res.write = write;
      res.end = end;
    }

    res.push = function(chunk) {
      res.data = (res.data || '') + chunk
    }

    res.inject = res.write = function(string, encoding) {
      if (string !== undefined) {
        var body = string instanceof Buffer ? string.toString(encoding) : string
        if (exists(body)) {
          res.push(snap(body))
          return true
        } else if (html(body) || html(res.data)) {
          res.push(body)
          return true
        } else {
          restore()
          return write.call(res, string, encoding)
        }
      }
      return true
    }

    res.writeHead = function() {
      var headers = arguments[arguments.length - 1]
      if (headers && typeof headers === 'object') {
        for (var name in headers) {
          if (/content-length/i.test(name)) {
            delete headers[name]
          }
        }
      }

      var header = res.getHeader( 'content-length' )
      if ( header ) res.removeHeader( 'content-length' )

      writeHead.apply(res, arguments)
    }


    res.end = function(string, encoding) {
      restore()
      var result = res.inject(string, encoding)
      if (!result) return end.call(res, string, encoding)

      if (res.data !== undefined && !res._header) {
        res.setHeader('content-length'
          , Buffer.byteLength(res.data, encoding))
      }
      res.end(res.data, encoding)
    }

    next()
  }
}

module.exports = function(args) {
  var serverPort = '8888'
    , xpenJson = utils.readXpenJson()

  if (!xpenJson) {
    utils.error('`xpen.json` is\'t found')
    return
  }

  while (args.length) {
    arg = args.shift()
    switch(arg) {
      case '-p':
      case '--port':
        serverPort = args.shift()
        break;
      default:
    }
  }

  var server = connect()
    , source = path.resolve(process.cwd(), '.')

  var tmpdir = os.tmpdir()

  if (xpenJson.css_pre_processor === 'stylus') {
    server.use(stylus.middleware({
      src: source
    , dest: tmpdir
    , force: true
    }))
  } else if (xpenJson.css_pre_processor === 'scss') {
    server.use(sass.middleware({
      src: source
    , dest: tmpdir
    }))
  }

  server.use(serveHtml())

  server.use(serveStatic(source, {
    dotfiles: 'ignore'
  , index: ['index.html', 'index.htm', 'html.html']
  , setHeaders: function(res) {
      res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.setHeader('Expires', '-1');
      res.setHeader('Pragma', 'no-cache')
    }
  }))

  server.use(serveStatic(tmpdir, {
    dotfiles: 'ignore'
  }))

  server.listen(serverPort, function() {
    console.log('\033[90mserving \033[36m%s\033[90m on port \033[96m%d\033[0m', source, serverPort)
  })
}
