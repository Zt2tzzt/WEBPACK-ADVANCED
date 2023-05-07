const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express()

app.use(express.static('../client')) // 这里本质上采用了方案一，将静态资源和 api 服务部署在同一个源中。

app.use('/api', createProxyMiddleware({
  target: 'http://localhost:8000',
  pathRewrite: {
    '^/api': ''
  }
}))

app.listen(9000, () => {
  console.log('express proxy 服务器启动成功了')
})