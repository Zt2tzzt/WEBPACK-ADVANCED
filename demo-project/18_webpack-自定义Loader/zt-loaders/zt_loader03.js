module.exports = function(content) {
  // this绑定对象
  // 获取到同步的callback
  // const callback = this.callback
  const callback = this.async()

  // 进行异步操作
  setTimeout(() => {
    console.log("hy_loader03:", content)
    callback(null, content + "aaaa")
  }, 2000);

  // callback进行调用:
  // 参数一: 错误信息
  // 参数二: 传递给下一个loader的内容
  // callback(null, "哈哈哈哈")
}


/** 同步的loader */
// module.exports = function(content) {
//   console.log("hy_loader03:", content)
//   return content + "aaaa"
// }


// module.exports.pitch = function() {
//   console.log("loader pitch 03")
// }
