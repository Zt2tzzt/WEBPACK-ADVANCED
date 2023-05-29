const path = require('path')
const ejs = require('ejs')

function compileEjs(tempName, data) {
  return new Promise((resolve, reject) => {
    // 1.获取当前模板的路径
    const tempPath = `../template/${tempName}`
    const absolutePath = path.resolve(__dirname, tempPath)

    // 2.使用 ejs 引擎编译模板
    ejs.renderFile(absolutePath, data, (err, res) => {
      if (err) {
        console.log('编译模板失败~，err:', err)
        return
      }

      resolve(res)
    })
  })
}

module.exports = compileEjs
