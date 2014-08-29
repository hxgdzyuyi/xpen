var fs = require('fs')
  , cheerio = require('cheerio')

var uploaders = {
  codepen: 'codepen'
, c: 'codepen'
}

module.exports = function(type) {
  if (!(type in uploaders)) {
    console.log('Uploader isn\'t exist.')
    return
  }

  var files = fs.readdirSync('.')
    , uploadData = {}

  files.forEach(function(file) {
    var suffixPos = file.lastIndexOf('.')
      , type = file.substr(suffixPos + 1)
      , dist = file.substr(0, suffixPos)
      , content = fs.readFileSync(file, { encoding: 'utf8' })

    if (dist === 'html') {
      var $ = cheerio.load(content)
      content = $('body').html()
    }

    uploadData[dist] = {
      type: type
    , content: content
    }
  })

  var uploader = require('./' + uploaders[type])
  uploader.upload(uploadData)
}
