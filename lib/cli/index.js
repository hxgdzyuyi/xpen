[ 'init' , 'serve' , 'upload' ].forEach(function(moduleName) {
  exports[moduleName] = require('./' + moduleName)
})
