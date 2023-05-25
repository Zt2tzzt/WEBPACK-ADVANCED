const { src, dest, watch } = require('gulp')

const babel = require('gulp-babel')
const terser = require('gulp-terser')

const jsTask = () => {
  return src("./src/**/*.js")
    .pipe(babel())
    .pipe(terser({ mangle: { toplevel: true } }))
    .pipe(dest("./dist"))
}

// watch函数监听内容的改变
watch("./src/**/*.js", jsTask)

module.exports = {
  jsTask
}
