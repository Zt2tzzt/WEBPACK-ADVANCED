module.exports = {
  // plugins: [
  //   "@babel/plugin-transform-arrow-functions",
  //   "@babel/plugin-transform-block-scoping"
  // ]
  presets: [
    ["@babel/preset-env", {
      // 在开发中针对babel的浏览器兼容查询使用browserslist工具, 而不是设置target
      // 因为browserslist工具, 可以在多个前端工具之间进行共享浏览器兼容性(postcss/babel)
      // targets: ">5%"
      // corejs: 3,
      // // false: 不使用polyfill进行填充
      // useBuiltIns: "entry"
    }],
    ["@babel/preset-react"],
    ["@babel/preset-typescript", {
      corejs: 3,
      useBuiltIns: "usage"
    }]
  ]
}
