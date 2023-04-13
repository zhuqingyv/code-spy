const { CodeSpy } = require('../src/index.js');
const path = require('path');

new CodeSpy({
  // 项目地址
  testDir: path.resolve(__dirname, '../demo'),
  // 包含的地址
  includes: ['.ts', 'tsx', 'js', '.jsx'],
  // 无需复制的文件
  copyIgnore: [path.resolve(__dirname, '../demo/ignore.ts')],
  // 测试列表
  caseList: [
    // 
    path.resolve(__dirname, '../base.test.js')
  ]
});