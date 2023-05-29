const { promisify } = require('util')
const { VUE_REPO } = require('../config/repo-constant')
// const download = require('download-git-repo')
const download = promisify(require('download-git-repo'))
const execCommand = require('../utils/exec-command')
const compileEjs = require('../utils/compile-ejs')
const writeFile = require('../utils/write-file')

async function createProjectAction(project) {
  // 1.从远程 git 仓库中，clone 下来模板。
  // 默认不支持 promise
  /* download(VUE_REPO, project, { clone: true }, (err) => {
    if (err) console.log('发生错误：', err)
  }) */

  try {
    // 1.从远程 git 仓库中，clone 下来模板。
    await download(VUE_REPO, project, { clone: true })

    // 2.很多脚手架，都是在这里给予提示
    /* console.log(`cd ${project}`)
    console.log(`npm run install`)
    console.log(`npm run dev`) */

    console.log('process.platform:', process.platform) // Win32
    // windows 平台的特殊适配
    const commandName = process.platform === 'win32' ? 'npm.cmd' : 'npm'
    // 3.帮助执行 npm install 命令
    await execCommand(commandName, ['install'], { cwd: `./${project}` }) // 去对应目录下，执行命令

    // 4.帮助执行 npm run dev 命令
    await execCommand(commandName, ['run', 'dev'], { cwd: `./${project}` })
  } catch (err) {
    console.log('github 连接失败，请稍后重试~')
  }
}

async function addComponentAction(cpnname) {
  // 1.创建一个组件：编写组件的模板，更具内容黑痣模板中填充的数据
  console.log('添加一个组件，到某个文件夹中~', cpnname)
  const res = await compileEjs('component.vue.ejs', { name: cpnname, lowername: cpnname.toLowerCase() })

  // 2.将 res 写入到对应的文件中。
  await writeFile(`src/components/${cpnname}.vue`, res)
  console.log('创建组件成功：', cpnname + '.vue')
}

module.exports = { createProjectAction, addComponentAction }
