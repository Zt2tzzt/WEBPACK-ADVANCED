const { src, dest } = require('gulp')

const copyFile = () => {
  // 1.读取文件 2.写入文件
  return src("./src/**/*.js").pipe(dest("./dist"))
}

module.exports = {
  copyFile
}
