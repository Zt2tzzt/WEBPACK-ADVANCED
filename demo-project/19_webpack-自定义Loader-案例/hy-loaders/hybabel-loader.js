const babel = require('@babel/core')

module.exports = function(content) {
  // 1.使用异步loader
  const callback = this.async()

  // 2.获取options
  let options = this.getOptions()
  if (!Object.keys(options).length) {
    options = require('../babel.config')
  }

  // 使用Babel转换代码
  babel.transform(content, options, (err, result) => {
    if (err) {
      callback(err)
    } else {
      callback(null, result.code)
    }
  })

  // return content
}