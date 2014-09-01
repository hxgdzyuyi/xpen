[ 'init'
, 'serve'
, 'fetch'
, 'upload' ].forEach(function(moduleName) {
  exports[moduleName] = require('./' + moduleName)
})
