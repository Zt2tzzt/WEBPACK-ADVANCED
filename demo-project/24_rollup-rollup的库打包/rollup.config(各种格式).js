module.exports = {
  // 入口
  input: "./lib/index.js",
  // 出口
  output: [
    {
      format: "umd",
      name: "zztUtils",
      file: "./build/bundle.umd.js"
    },
    {
      format: "amd",
      file: "./build/bundle.amd.js"
    },
    {
      format: "cjs",
      file: "./build/bundle.cjs.js"
    },
    {
      format: "iife",
      name: "zztUtils",
      file: "./build/bundle.browser.js"
    }
  ]
}