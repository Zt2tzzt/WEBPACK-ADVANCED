const { series, parallel } = require('gulp')

const foo1 = (cb) => {
  setTimeout(() => {
    console.log("foo1 task exec~")
    cb()
  }, 2000)
}

const foo2 = (cb) => {
  setTimeout(() => {
    console.log("foo2 task exec~")
    cb()
  }, 1000)
}

const foo3 = (cb) => {
  setTimeout(() => {
    console.log("foo3 task exec~")
    cb()
  }, 3000)
}

const seriesFoo = series(foo1, foo2, foo3)
const parallelFoo = parallel(foo1, foo2, foo3)

module.exports = {
  seriesFoo,
  parallelFoo
}


