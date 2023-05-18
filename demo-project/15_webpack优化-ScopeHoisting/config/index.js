const glob = require('glob')

console.log(glob.sync('../src/**/*', { nodir: true }))
