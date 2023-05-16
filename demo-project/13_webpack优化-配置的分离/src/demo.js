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
function sum(num1, num2) {
  return num1 + num2
}
// console.log(sum(20, 30))


// class Person {}
// const p = new Person()
