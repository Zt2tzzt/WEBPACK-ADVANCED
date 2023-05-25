const { NodeSSH } = require('node-ssh')
const { PASSWORD } = require('./config')

class AutoUploadWebpackPlugin {
  constructor(options) {
    this.ssh = new NodeSSH()
    this.options = options
  }

  apply(compiler) {
    // console.log("AutoUploadWebpackPlugin被注册:")
    // 完成的事情: 注册hooks监听事件
    // 等到assets已经输出到output目录上时, 完成自动上传的功能
    compiler.hooks.afterEmit.tapAsync("AutoPlugin", async (compilation, callback) => {
      // 1.获取输出文件夹路径(其中资源)
      const outputPath = compilation.outputOptions.path

      // 2.连接远程服务器 SSH
      await this.connectServer()

      // 3.删除原有的文件夹中内容
      const remotePath = this.options.remotePath
      this.ssh.execCommand(`rm -rf ${remotePath}/*`)

      // 4.将文件夹中资源上传到服务器中
      await this.uploadFiles(outputPath, remotePath)

      // 5.关闭ssh连接
      this.ssh.dispose()

      // 完成所有的操作后, 调用callback()
      callback()
    })
  }

  async connectServer() {
    await this.ssh.connect({
      host: this.options.host,
      username: this.options.username,
      password: this.options.password
    })
    console.log('服务器连接成功')
  }

  async uploadFiles(localPath, remotePath) {
    const status = await this.ssh.putDirectory(localPath, remotePath, {
      recursive: true,
      concurrency: 10
    })
    if (status) {
      console.log("文件上传服务器成功~")
    }
  }
}

module.exports = AutoUploadWebpackPlugin
module.exports.AutoUploadWebpackPlugin = AutoUploadWebpackPlugin
