#!/usr/bin/env node
const { program } = require('commander')
const helpOptions = require('./core/help-options')
const { createProjectAction, addComponentAction } = require('./core/actions')

// 1.配置所有的 options
helpOptions()

// 2.增加具体的一些功能操作。
program
  .command('create <project> [...others]')
  .description('create vue roject into a folder, 比如：zztcli create vue-aribnb')
  .action(createProjectAction)

program
  .command('addcpn <cpnname> [...others]')
  .description('add vue component into a folder, 比如：zztcli addcpn NavBar -d src/components')
  .action(addComponentAction)

// 解析 process.argv 参数
program.parse(process.argv)

// 获取额外传递的参数
// console.log(program.opts().dest)
