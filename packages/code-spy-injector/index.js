/**
 * @description 在任意文件里面任意位置插入一段代码
*/
const path = require('path');
const fs = require('fs');

const defaultConfig = (options = {}) => {
  const _default = {
    position: {
      line: 0,
      column: 0
    }
  };
  return {
    ..._default,
    ...options
  };
};

class CodeInjector {
  dirty = false;
  constructor(options) {
    this.options = defaultConfig(options);
    if (!this.options.target) console.warn(`You should input the option 'target'!`);
    this.target = fs.readFileSync(this.options.target, { encoding: 'utf-8' });
  };

  // 指定位置插入代码
  inject = ({ script = this.options.script, target = this.options.target, position = this.options.position } = {}) => {
    if (this.dirty) this.resume();
    const { line, column } = position;

    if (line === 0 && column === 0) {
      return this.injectTop({ script, target });
    };

    const lines = fs.readFileSync(target, { encoding: 'utf-8' }).split('\n');
    const currentLine = lines[line];
    const beforCode = currentLine.slice(0, column);
    const afterCode = currentLine.slice(column);
    const newCode = `${beforCode}${script}${afterCode}`;
    fs.writeFileSync(target, newCode);
    this.dirty = true;
  };

  // 顶部追加
  injectTop = ({ script = this.options.script, target = this.options.target } = {}) => {
    if (this.dirty) this.resume();
    const beforeValue = fs.readFileSync(target, { encoding: 'utf-8' });
    const newCode = `${script}\n${beforeValue}`;
    fs.writeFileSync(target, newCode);
    this.dirty = true;
  };

  // 底部追加
  injectBottom = ({ script = this.options.script, target = this.options.target } = {}) => {
    if (this.dirty) this.resume();
    const beforeValue = fs.readFileSync(target, { encoding: 'utf-8' });
    const newCode = `${beforeValue}\n${script}`;
    fs.writeFileSync(target, newCode);
    this.dirty = true;
  };

  // 恢复代码
  resume = () => {
    fs.writeFileSync(this.options.target, this.target);
    this.dirty = false;
  };
};

module.exports = CodeInjector;