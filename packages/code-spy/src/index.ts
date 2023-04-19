import Flow from 'flow-work';
import CodeSpyTest from './code-spy-test';
import DispatchManager from './cody-spy-use-dispatch';
import { WatcherManager } from './code-spy-watcher';
import { CodeSpyTestOptionsType, IntelligencerType, AnyHandle, TestStatusEnum } from 'types';
import { InterceptorType } from './code-spy-watcher/type';
import { timeoutHandle, arrayToObjectMap } from 'utils';

export const defaultConfig = (options:CodeSpyTestOptionsType) => {
  const _default = {
    global: window || globalThis || global || self
  };
  return {
    ..._default,
    ...options
  }
};

/**
 * @description 注入到全局对象里面的测试spy，提供给间谍
 * 
 * @dispatch 主动触发器(代码执行到此即触发) ok
 * @useDispatch 惰性触发器(需要测试任务主动触发，否则处于等待状态) ok
 * @mock 用来做mock ok
 * @test 执行局部验证 
 * @watch 执行监听
 * @waitDispatch 等待dispatch队列按顺序触发 ok
 * @useWaitDispatch 惰性队列效验器
 * @waitDispatchStrict 等待dispatch队列按顺序触发，并且校验数量ok
 * @useWaitDispatchStrict 惰性队列效验器，并且校验数量ok
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
   * @name dispatchName
   * @spy.dispatch(() => {})
  */
  dispatch = (name:string, dispatchHandle: AnyHandle = () => null) => {
    if (dispatchHandle && dispatchHandle instanceof Function) dispatchHandle();
    this.watcherManager.dispatch({ name, type: IntelligencerType.DISPATCH });
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
   * @name watch
   * @timeout 1000
   * @spy.watch(() => {})
  */
  watch = (name:string, timeout: number = 1000) => {
    return (awaitList:string[], interceptor: InterceptorType) => {
      this.watcherManager.add({ name, awaitList, interceptor })
    }
  };

  /**
   * @spy
   * @name waitForDispatchName
   * @spy.waitForDispatch(() => {})
  */
  waitDispatch = (name:string, timeout: number = 1000, success: AnyHandle, fail: AnyHandle) => {
    return (awaitList:string[], interceptor: InterceptorType = () => null) => {
      const awaitMap = arrayToObjectMap(awaitList);

      const onTimeout = () => {
        this.watcherManager.remove(name);
        const params = {
          name,
          type: IntelligencerType.WAIT_FOR_DISPATCH,
          status: TestStatusEnum.TIME_OUT
        }
        this.watcherManager.dispatch(params);
        // @ts-ignore
        fail(params);
      };

      const onSuccess = () => {
        this.watcherManager.remove(name);
        const params = {
          name,
          type: IntelligencerType.WAIT_FOR_DISPATCH,
          status: TestStatusEnum.PASS
        }
        this.watcherManager.dispatch(params);
        // @ts-ignore
        success(params);
      };

      const timeoutInterceptor = timeoutHandle(interceptor, timeout, onTimeout, onSuccess);

      // 校验完成条件
      const interceptorProxy:InterceptorType = (params) => {
        const { name } = params;
        console.log(name);
        awaitMap.delete(name);
        if (awaitMap.size === 0) timeoutInterceptor(params);
      };
      // 注册监听
      this.watcherManager.add({ name, awaitList, interceptor: interceptorProxy });
    }
  };

  /**
   * @spy
   * @name useWaitDispatchName
   * @spy.useWaitDispatch(() => {})
  */
  useWaitDispatch = (name: string) => {
    return (dispatchHandle: (params?:any[]) => any) => {
      this.dispatchManager.create({ name, dispatchHandle });
    };
  };

  /**
   * @spy
   * @name waitForDispatchStrictName
   * @spy.waitForDispatchStrict(() => {})
  */
  waitDispatchStrict = (name:string, timeout: number = 1000, success: AnyHandle = () => null, fail: AnyHandle = () => null) => {
    return (awaitList:string[], interceptor?: InterceptorType) => {
      const awaitMap = arrayToObjectMap(awaitList);

      const onTimeout = () => {
        this.watcherManager.remove(name);
        const params = {
          name,
          type: IntelligencerType.WAIT_FOR_DISPATCH_STRICT,
          status: TestStatusEnum.TIME_OUT
        }
        this.watcherManager.dispatch(params);
        fail(params);
      };

      const onSuccess = () => {
        this.watcherManager.remove(name);
        const params = {
          name,
          type: IntelligencerType.WAIT_FOR_DISPATCH_STRICT,
          status: TestStatusEnum.PASS
        }
        this.watcherManager.dispatch(params);
        success(params);
      };

      const onBreak = () => {
        this.watcherManager.remove(name);
        const params = {
          name,
          type: IntelligencerType.WAIT_FOR_DISPATCH_STRICT,
          status: TestStatusEnum.BREAK
        }
        this.watcherManager.dispatch(params);
        fail(params);
      };

      const timeoutInterceptor = timeoutHandle(interceptor || (() => null), timeout, onTimeout, onSuccess);

      const interceptorProxy:InterceptorType = (params) => {
        const { name } = params;
        const hit = awaitMap.delete(name);
        if (hit && awaitMap.size === 0) {
          timeoutInterceptor();
        } else {
          onBreak();
        };
      };
      this.watcherManager.add({ name, awaitList, interceptor: interceptorProxy });
    }
  };

  /**
   * @spy
   * @name useWaitDispatchStrictName
   * @spy.useWaitDispatchStrict(name)(() => {})
  */
  useWaitDispatchStrict = (name: string) => {
    return (callback:AnyHandle) => {
      const onSuccess = () => {
        callback();
      };

      const onFail = () => {};
      // 2.等待激活开始监听
      const onStart = (awaitList:string[], timeout: number) => {
        this.waitDispatchStrict(name, timeout, onSuccess, onFail)(awaitList);
      };
      // 1.注册一个 dispatch
      this.dispatchManager.create({ name, dispatchHandle: onStart });
    };
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