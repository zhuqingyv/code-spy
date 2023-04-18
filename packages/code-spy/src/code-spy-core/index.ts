import Flow from 'flow-work';
import TestInstance from './TestInstance';
import Reporter from '../code-spy-reporter';
import { CodeSpyCoreOptionsType } from '../types';

export const defaultConfig = (options:CodeSpyCoreOptionsType = {}) => {
  const _default = {
    global: window || globalThis || global || self || this
  };
  return {
    ..._default,
    ...options
  }
};

/**
 * @description 主要处理最基本的对象创建、以及对象获取，主要是工厂的角色
*/
class CodeSpyCore {
  flow!: Flow;
  reporter!: Reporter;
  currentTest!: TestInstance;
  /** 配置项 */
  options: CodeSpyCoreOptionsType;
  /** 每一个线报的实例 */
  intelligencerMap = new Map();

  constructor(options: CodeSpyCoreOptionsType = {}) {
    this.options = defaultConfig(options);
    // 创建工作流
    this.flow = new Flow(this.options.name || 'code-spy');
    // 报告生成器
    this.reporter = new Reporter({ context: this });
    this.init();
  };

  init = () => {
    const { flow } = this;
    flow
      .tap('init')
      .run('injectGlobal', (_data: any, next: any) => {
        this.injectGlobal(next);
      })
  };

  // 注入global
  injectGlobal = (next: () => void) => {
    const { global } = this;
    global.spy = this;
    next();
  };

  // 新增实例
  test = (name: string) => {
    const { currentTest, flow } = this;
    // 创建一个测试用例
    const testInstance = new TestInstance({ name, spy: this, flow });
    if (currentTest) currentTest.next(testInstance);
    return this.currentTest = testInstance;
  };

  dispatch = () => {};

  watch = () => {};

  waitForDispatch = () => {};

  waitForDispatchByStrict = () => {};

  start = (params: any) => {
    this.flow.call(params, () => {});
  };

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

export default CodeSpyCore;
// codeSpy.test
