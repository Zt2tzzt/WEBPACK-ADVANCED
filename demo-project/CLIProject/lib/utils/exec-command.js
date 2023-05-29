const { spawn } = require('child_process') // 借助于 child_process 模块中的 spawn，帮助执行命令，开启一个进程。

function execCommand(...args) {
  return new Promise((resolve, reject) => {
    // npm install / npm run dev
    // 1.开启子进程，执行命令
    const childProcess = spawn(...args)

    // 2.获取子进程的输出和错误信息。
    childProcess.stdout.pipe(process.stdout)
    childProcess.stderr.pipe(process.stderr)

    // 3.监听子进程执行结束，并关闭。
    childProcess.on('close', () => {
      resolve()
    })
  })
}

module.exports = execCommand
