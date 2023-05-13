module.exports = {
  presets: [
    ["@babel/preset-env", {
    }],
    ["@babel/preset-react"],
    ["@babel/preset-typescript", {
      corejs: 3,
      useBuiltIns: "usage"
    }]
  ]
}
