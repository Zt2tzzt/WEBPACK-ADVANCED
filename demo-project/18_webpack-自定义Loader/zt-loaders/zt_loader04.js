const { validate } = require('schema-utils')
const loader04Schema = require('./schema/loader04_schema.json')

module.exports = function(content) {

  // 1.获取使用loader时, 传递进来的参数
  // 方式一: 早期时, 需要单独使用loader-utils(webpack开发)的库来获取参数
  // 方式二: 目前, 已经可以直接通过this.getOptions()直接获取到参数
  const options = this.getOptions()
  console.log(options)

  // 2.校验参数是否符合规则
  validate(loader04Schema, options)

  console.log('hy-loader04:', content)

  return content
}