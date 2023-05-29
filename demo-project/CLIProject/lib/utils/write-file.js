const fs = require('fs')

function writeFile(path, content) {
  return fs.promises.writeFile(path, content)
}

module.exports = writeFile