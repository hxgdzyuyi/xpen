var fs = require('fs')
  , cheerio = require('cheerio')

var fetchers = {
  codepen: 'codepen'
}

var rCodepen = /codepen\.io/
function detectFetcher(url) {
  if (rCodepen.test(url)) {
    return 'codepen'
  } else {
    return null
  }
}

module.exports = function(url) {
  var fetcherType = detectFetcher(url)
  if (!fetcherType) {
    console.log('Fetcher isn\'t exist.')
    return
  }

  var fetcher = require('./' + fetchers[fetcherType])
  fetcher.fetch(url)
}
