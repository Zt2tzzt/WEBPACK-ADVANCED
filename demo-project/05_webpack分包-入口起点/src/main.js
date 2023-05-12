import axios from 'axios'

// index.js作为入口
const message = "Hello Main"
console.log(message)

function bar() {
  console.log('bar function exec~')
}
bar()

// 使用axios
axios.get('http://123.207.32.32:8000/home/multidata').then(res => {
  console.log(res)
})
