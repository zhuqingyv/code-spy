import Flow from 'flow-work';
import CodeSpyTest from './code-spy-test';
import DispatchManager from './cody-spy-use-dispatch';
import { WatcherManager } from './code-spy-watcher';
import { CodeSpyTestOptionsType, IntelligencerType, AnyHandle } from 'types';

export const defaultConfig = (options:CodeSpyTestOptionsType = {}) => {
  const _default = {
    global: window || globalThis || global || self
  };
  return {
    ..._default,
    ...options
  }
};

/**
 * @description 注入到全局对象里面的测试spy
 * 
 * @dispatch 主动触发器(代码执行到此即触发) ok
 * @useDispatch 惰性触发器(需要测试任务主动触发，否则处于等待状态) ok
 * @mock 用来做mock ok
 * @test 执行局部验证
 * @watch 执行监听
 * @waitForDispatch 等待dispatch队列按顺序触发
 * @waitForDispatchStrict 等待dispatch队列按顺序触发，并且校验数量
 * 
*/
class CodeSpy {
  flow!: Flow;
  /** 配置项 */
  options: CodeSpyTestOptionsType;
  /** 监听器收集 */
  watcherManager: WatcherManager;
  /** 收集 dispatch */
  dispatchManager: DispatchManager;
  /** 每一个测试的实例 */
  codeSpyTest: CodeSpyTest;

  constructor(options: CodeSpyTestOptionsType) {
    this.options = defaultConfig(options);
    // 创建工作流
    this.flow = new Flow(this.options.name || 'code-spy');
    /** 每一个测试的实例 */
    this.codeSpyTest = new CodeSpyTest({ spy: this });
    /** 监听器收集 */
    this.watcherManager = new WatcherManager();
    /** 收集 dispatch */
    this.dispatchManager = new DispatchManager();
    // 注入到global
    this.injectGlobal();
  };

  // 注入global
  injectGlobal = () => {
    const { global } = this;
    global.spy = this;
  };

  /**
   * @spy
   * @name mockName
   * @spy.mock({}, (mock) => mock)
  */
  mock = (name: string) => {
    const { currentTest } = this.codeSpyTest;
    if (!currentTest) return () => null;
    const { shouldMockerRun } = currentTest;
    const mock = shouldMockerRun(name);
    if (mock) {
      return (_data:any, mockerHandle:(any?:[]) => any) => {
        const data = mock.run(_data);
        mockerHandle(data);
      };
    };
    return () => null;
  };

  /**
   * @spy
   * @name useDispatchName
   * @spy.useDispatch(() => {})
  */
  useDispatch = (name: string) => {
    return (dispatchHandle: (params?:any[]) => any) => {
      this.dispatchManager.create({ name, dispatchHandle });
    };
  };

  /**
   * @spy
   * @name dispatchName
   * @spy.dispatch(() => {})
  */
  dispatch = (name:string, dispatchHandle?: AnyHandle) => {
    if (dispatchHandle && dispatchHandle instanceof Function) dispatchHandle();
    this.watcherManager.dispatch({ name, type: IntelligencerType.DISPATCH });
  };

  /**
   * @spy
   * @name waitForDispatchName
   * @spy.waitForDispatchName(() => {})
  */
  waitForDispatch = (name:string) => {
    return (waitList:string[], waitSuccessHandle) => {}
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

export default CodeSpy;

// spy.mock('mock场景')({}, (mock) => mock);

// spy.useDispatch('被动dispatch')(onClick);

// spy.dispatch('主动dispatch')(onClick);

// spy.test('通过test验证')(() => {});

// spy.watch('通过监听器验证')(() => {});

// spy.waitForDispatch('通过监听静态顺序队列验证')(['dispatchName1', 'dispatchName2']);

// spy.waitForDispatchStrict('通过监听静态严格顺序与数量队列验证')(['dispatchName1', 'dispatchName2']);

// spy.waitForDispatch('通过监听动态顺序队列验证')((list) => list);

// spy.waitForDispatchStrict('通过监听动态严格顺序与数量队列验证')((list) => list);