const { program } = require('commander');

function helpOptions() {
  const version = require('../../package.json').version
  // 1.处理 --version 操作
  program.version(version, '-v --version')

  // 2.增强其他的 options 的操作
  program.option('-z --zzt', 'a zzt cli program~')
  program.option('-d --dest <dest>', 'a destination folder；例如：-d src/components')

  // 扩展 --help
  program.on('--help', () => {
    console.log('')
    console.log('others:')
    console.log('  xxx')
    console.log('  yyy')
  })
}

module.exports = helpOptions
