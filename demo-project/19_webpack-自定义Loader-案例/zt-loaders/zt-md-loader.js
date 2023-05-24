const { marked } = require('marked')
const hljs = require('highlight.js')

module.exports = function(content) {
  // 让marked库解析语法的时候将代码高亮内容标识出来
  marked.setOptions({
    highlight: function(code, lang) {
      return hljs.highlight(lang, code).value
    }
  })

  // 将md语法转化成html元素结构
  const htmlContent = marked(content)
  // console.log(htmlContent)

  // 返回的结果必须是模块化的内容
  const innerContent = "`" + htmlContent + "`"
  const moduleContent = `var code = ${innerContent}; export default code;`

  return moduleContent
}