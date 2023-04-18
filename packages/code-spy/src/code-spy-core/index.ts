import Flow from 'flow-work';
import Intelligencer from '../code-intelligencer';
import Reporter from '../code-spy-reporter';
import { CodeSpyCoreOptionsType, IntelligencerCreatorType } from '../types';

export const defaultConfig = (options:CodeSpyCoreOptionsType = {}) => {
  const _default = {
    global: window || globalThis || global || self || this
  };
  return {
    ..._default,
    ...options
  }
};

class CodeSpyCore {
  flow!: Flow;
  reporter!: Reporter;
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

  create = ({ name, type }:IntelligencerCreatorType) => {
    const intelligencer = new Intelligencer({ name, type });
    const { waitForDispatch, watch } = intelligencer;

    if (this.intelligencerMap.get(name)) console.warn()
    this.intelligencerMap.set(name, intelligencer);

    return (callback: (param: any) => any) => callback(param);
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
  }
};

export default CodeSpyCore;