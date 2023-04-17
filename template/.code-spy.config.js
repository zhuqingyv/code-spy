const { defaultConfig } = require('code-spy-test');
const { resolve } = require('dns');
const path = require('path');

module.exports = () => (defaultConfig({
  git: {
    // 项目名称(最好别重复，重复的话会自动新增一个后缀)
    name: '',
    // git clone 地址
    clone: '',
    // 分支名称
    branch: '',
  },
  test: {
    // 执行顺序
    list: [
      path.resolve(__dirname, './example.test.js')
    ],
    // 通用的测试行为
    common: {
      // 脚本注入
      injector: {
        before: []
      }
    }
  }
}));