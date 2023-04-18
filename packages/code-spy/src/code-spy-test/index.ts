import Flow from 'flow-work';
import TestInstance from './TestInstance';
import LazyDispatchManager from './LazyDispatch';
import { WatcherManager } from '../code-spy-watcher';
import { CodeSpyTestOptionsType } from '../types';
import { DispatchParams } from '../code-spy-watcher/type';

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
 * @description 主要处理最基本的对象创建、以及对象获取，主要是工厂的角色
*/
class CodeSpyTest {
  flow;
  /** 当前的测试实例 */
  currentTest!: TestInstance;
  /** 配置项 */
  options: CodeSpyTestOptionsType;
  // 惰性dispatch管理
  lazyDispatchManager: LazyDispatchManager;
  // 收集监听器
  watchManager: WatcherManager;
  /** 每一个线报的实例 */
  testMap = new Map();

  constructor(options: CodeSpyTestOptionsType = {}) {
    this.options = defaultConfig(options);
    // 创建工作流
    this.flow = new Flow(this.options.name || 'render name');
    // 收集惰性dispatch
    this.lazyDispatchManager = new LazyDispatchManager();
    // 收集监听器
    this.watchManager = new WatcherManager();
  };

  // 新增实例
  test = (name: string) => {
    const { currentTest, flow } = this;
    // 创建一个测试用例
    const testInstance = new TestInstance({ name, spy: this, flow });
    this.testMap.set(name, testInstance);
    if (currentTest) currentTest.next(testInstance);
    return this.currentTest = testInstance;
  };

  dispatch = (name, next) => {
    const { lazyDispatchManager } = this;
    const lazyDispatchInstance = lazyDispatchManager.getDispatch(name);
    if (lazyDispatchInstance) next(lazyDispatchInstance);
  };

  watch = (interceptor: () => any) => {
    // 先移除一下
    this.watchManager.remove(interceptor);
    // 再监听
    this.watchManager.add({ interceptor });
  };

  unWatch = () => {};

  waitForDispatch = () => {};

  waitForDispatchByStrict = () => {};

  commit = () => {};

  start = (params: any) => {
    if(this.flow) this.flow.call(params, () => {});
  };
};

export default CodeSpyTest;
// codeSpy.test
