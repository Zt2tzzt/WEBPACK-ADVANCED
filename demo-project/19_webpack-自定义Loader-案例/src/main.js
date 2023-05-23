import code from "./md/learn.md"
import "highlight.js/styles/default.css"
import "./css/code.css"

const message = "Hello World"
console.log(message)

const foo = () => {
  console.log("foo function exec~")
}

foo()

// 1.对code进行打印
// console.log(code)

// 2.将它显示到页面中
document.body.innerHTML = code

