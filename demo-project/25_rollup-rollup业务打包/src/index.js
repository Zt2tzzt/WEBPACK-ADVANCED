import { sum, mul } from './utils/math'
import { formatPrice } from './utils/format'
import "./css/style.css"
import App from './vue/App.vue'
import { createApp } from 'vue'

function foo() {
  console.log("foo exection~")
  console.log(sum(20, 30))
  console.log(formatPrice())

  const message = "Hello World"
  console.log(message)
}

foo()

// DOM操作
const titleEl = document.createElement("h2")
titleEl.textContent = "我是标题, 哈哈哈"
titleEl.className = "title"
document.body.append(titleEl)


// 编写Vue代码
const app = createApp(App)
app.mount(document.querySelector("#app"))
