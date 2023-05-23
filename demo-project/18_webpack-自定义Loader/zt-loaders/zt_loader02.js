module.exports = function(content) {
  const callback = this.async()
  setTimeout(() => {
    console.log("hy_loader02:", content)
    callback(null, content + "bbbb")
  }, 3000);
}

/** 同步loader */
// module.exports = function(content) {
//   console.log("hy_loader02:", content)
//   return content + "bbbb"
// }


// module.exports.pitch = function() {
//   console.log("loader pitch 02")
// }
