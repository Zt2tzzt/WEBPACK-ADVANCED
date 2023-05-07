const Koa = require('koa')
const KoaRouter = require('@koa/router')
// const static = require('koa-static')

// 创建 Koa 服务器
const app = new Koa()

// app.use(static('./client'))

// CORS
/* app.use(async (ctx, next) => {
  // 1.为简单请求，开启 CORS
  ctx.set('Access-Control-Allow-Origin', '*') // * 表示所有源

  // 2.非简单请求，开启 CORS，还需要下面的设置
  ctx.set("Access-Control-Allow-Headers", "Accept, AcceptEncoding, Connection, Host, Origin")
  ctx.set("Access-Control-Allow-Credentials", true) // cookie
  ctx.set("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS")
  // 发起的是一个options请求
  if (ctx.method === 'OPTIONS') {
    ctx.status = 204
  } else {
    await next()
  }
}) */

// 创建路由对象
const userRouter = new KoaRouter({ prefix: '/users' })

// 在路由中，注册中间件
userRouter.get('/list', (ctx, next) => {
  ctx.body = [
    { id: 111, name: 'zzt', age: 18 },
    { id: 112, name: 'kobe', age: 28 },
    { id: 113, name: 'james', age: 38 },
  ]
})

// 注册路由
app.use(userRouter.routes())
app.use(userRouter.allowedMethods())

// 开启 Koa 服务器
app.listen(8000, () => {
  console.log('koa 服务器启动成功~')
  console.log('haha')
})
