const { CodeSpyTransform } = require('../../packages/code-spy-transform/index.js');
const path = require('path');

new CodeSpyTransform({
  // 项目地址
  testDir: path.resolve(__dirname, './demo'),
  // 包含的地址
  includes: ['.ts', 'tsx', 'js', '.jsx'],
  // 无需复制的文件
  copyIgnore: [path.resolve(__dirname, './demo/ignore.ts')],
  // 输出目录
  rootDir: path.resolve(__dirname, './.code-spy-transform')
});