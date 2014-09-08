var request = require('request')
  , _ = require('underscore')
  , cheerio = require('cheerio')
  , utils = require('../../utils')

request = request.defaults({jar: true})

var suffixAndPreProcessor = {
  styl: 'stylus'
, scss: 'scss'
}

exports.upload = function(uploadData) {
  var xpenJson = utils.readXpenJson()
    , postData = _.pick(
        xpenJson
      , 'title'
      , 'css_pre_processor'
      , 'js_pre_processor'
      , 'html_pre_processor'
      )

  ;['css', 'js', 'html'].forEach(function(distType) {
    var data = uploadData[distType]

    postData[distType] = data.content
  })

  console.log('Uploading...')

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
        , url = resp.redirect_url
      if (url && /pen/.test(url)) {
        utils.success('Uploaded Success, XPen\'s url is: ' + url)
      }
    })
  })
}
