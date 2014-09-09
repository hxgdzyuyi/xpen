var fs = require('fs')
  , cheerio = require('cheerio')
  , utils = require('../../utils')

var uploaders = {
  codepen: 'codepen'
, c: 'codepen'
}

module.exports = function(type) {
  if (!(type in uploaders)) {
    utils.error('Uploader isn\'t exist.')
    return
  }

  var files = fs.readdirSync('.')
    , uploadData = {}

  files.forEach(function(file) {
    var suffixPos = file.lastIndexOf('.')
      , type = file.substr(suffixPos + 1)
      , dist = file.substr(0, suffixPos)

    if (['css', 'js', 'html'].indexOf(dist) === -1) { return }

    var content = fs.readFileSync(file, { encoding: 'utf8' })

    if (dist === 'html') {
      if (type === 'html') {
        var $ = cheerio.load(content)
        content = $('body').html()
      } else if (type === 'jade') {
        //TODO(yangqing): dirty but work
        content = content.substr(content.match(/body/).index)
        content = content.substr(content.match(/\n/).index)
        content = content.replace(/\n    /g, '\n')
      }
    }

    uploadData[dist] = {
      type: type
    , content: content
    }
  })

  var uploader = require('./' + uploaders[type])
  uploader.upload(uploadData)
}
