var request = require('request')
  , cheerio = require('cheerio')

request = request.defaults({jar: true})

var suffixAndPreProcessor = {
  styl: 'stylus'
}

exports.upload = function(uploadData) {
  var postData = {}

  ;['css', 'js', 'html'].forEach(function(distType) {
    var data = uploadData[distType]

    postData[distType + '_pre_processor'] = data.type !== distType
      ? suffixAndPreProcessor[data.type] : 'none'
    postData[distType] = data.content
  })

  request('http://codepen.io', function(error, response, body) {
    var $ = cheerio.load(body)
    var csrfKey = $('meta[name="csrf-token"]').attr('content')

    request({
      uri: 'http://codepen.io/pen/save'
    , method: "POST"
    , headers: {
        'X-CSRF-Token': csrfKey
      }
    , form: {
        pen: JSON.stringify(postData)
      }
    }
    , function(error, response, body) {
      var resp = JSON.parse(body)
      console.log(resp.redirect_url)
    })
  })
}
