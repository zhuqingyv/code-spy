import Flow from 'flow-work';
import CodeSpyTest from './code-spy-test';
import { CodeSpyTestOptionsType } from './types';

export const defaultConfig = (options:CodeSpyTestOptionsType = {}) => {
  const _default = {
    global: window || globalThis || global || self || this
  };
  return {
    ..._default,
    ...options
  }
};

/**
 * @description 注入到全局对象里面的测试spy
 * @dispatch 主动触发器(代码执行到spy为止即触发)
 * @lazyDispatch 惰性触发器(需要测试任务主动触发，否则处于等待状态)
*/
class CodeSpy {
  flow!: Flow;
  /** 配置项 */
  options: CodeSpyTestOptionsType;
  /** 每一个测试的实例 */
  codeSpyTest = new CodeSpyTest();

  constructor(options: CodeSpyTestOptionsType = {}) {
    this.options = defaultConfig(options);
    // 创建工作流
    this.flow = new Flow(this.options.name || 'code-spy');
    // 注入到global
    this.injectGlobal();
  };

  // 注入global
  injectGlobal = () => {
    const { global } = this;
    global.spy = this;
  };

  dispatch = () => {};

  get global() {
    return this.options?.global || window || globalThis || global || self;
  };

  set global(value) {
    if (this.options) {
      this.options.global = value;
    } else {
      console.log(`Cody Spy options is ${String( this.options)}!`)
    };
  };

};

export default CodeSpy;