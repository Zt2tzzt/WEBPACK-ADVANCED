import { sum } from './demo/math'
// 1.正常使用的过程
// import { parseLyric } from './demo/parse-lyric'
// parseLyric()

// 2.只导入模块, 但是引入任何的内容
import "./demo/parse-lyric"

// 3.import css文件
import "./css/style.css"

console.log(sum(20, 30))

const message = "Hello World"
console.log(message)

function foo(num1, num2) {
  console.log("foo function exec~")
  console.log(arguments[0], arguments[1])
}
foo()

const obj = {
  name: "why",
  bar() {
    return "bar"
  }
}

// 不可达的代码
if (false) {
  console.log("哈哈哈哈哈")
  console.log("呵呵呵呵呵")
}

// tree shaking
// function sum(num1, num2) {
//   return num1 + num2
// }
// console.log(sum(20, 30))

// class Person {}
// const p = new Person()

// console.log(window.lyric)


// 添加div, 并且添加className
const h2El = document.createElement('h2')
h2El.textContent = "哈哈哈"
h2El.className = "title"
document.body.append(h2El)
