import Flow from 'flow-work';
import { timeoutHandle } from 'utils';
import Mocker from './Mocker';
import CodeSpyCore from './index';
interface FlowType {
  run: () => any;
  tap: Flow["tap"];
};

class TestInstance {
  name!: string;
  mockMap = new Map();
  spy: CodeSpyCore;
  flow;

  constructor({name, spy, flow}: {name: string, spy: CodeSpyCore, flow: Flow}) {
    this.name = name;
    this.flow = flow.tap(name);
    this.spy = spy;
  };

  // 配置mock
  mock = (name:string, getMock: (params:any) => any) => {
    const mocker = new Mocker({
      name,
      getMock
    });
    this.mockMap.set(name, mocker);
    return this;
  };

  // 检测一个mock是否应该执行，如果匹配到则返回 Mocker Instance
  shouldMockerRun = (name:string) => {
    return this.mockMap.get(name);
  };

  // 触发dispatch
  dispatch = (name: string, { timeout = 5000 }: { timeout: number }) => {
    this.flow.run(`dispatch:${name}`, (_data: any, next: (arg?:[]) => void, finishProxy: (arg?:[]) => void) => {
      try {
        const finishHandle = () => {
          finishProxy();
        };
        const handle = timeoutHandle(next, timeout, finishHandle);
        this.spy.dispatch(name, handle);
      } catch (error:any) {
        finishProxy(error);
      };
    });
    return this;
  };

  // 注册一个监听器
  watch = (intercept: (any?:[]) => any, { timeout = 5000 }: { timeout: number }) => {
    this.flow.run('watch', (_data: any, next: (arg?:[]) => void, finishProxy: (arg?:[]) => void) => {
      // 注册定时任务
      const handleNext = timeoutHandle(next, timeout, finishProxy);
      // 开始监听
      this.spy.watch(async(...arg) => {
        // 获取watch结果
        const value = intercept(...arg);
        if (value instanceof Promise) {
          const boolean = await value;
          if (boolean) return handleNext();
          return finishProxy();
        };

        if (value) return handleNext();
        return finishProxy();
      });
    });
    return this;
  };

  waitForDispatch = (waitingList: any) => {
    this.spy.waitForDispatch(waitingList, this);
    return this;
  };

  waitForDispatchByStrict = (waitingList: any) => {
    this.spy.waitForDispatchByStrict(waitingList, this);
  };

  next = (testInstance: TestInstance) => {};

};

export default TestInstance;

// 激活mock脚本，函数入参为spy提供，返回值提供给mock入参
// .mock('Payment', () => ({}))
// .mock('Submit to Pay', () => ({}))
// // 等待某些dispatch按顺序触发，只要保持顺序即可中间允许插入其他dispatch
// .waitForDispatch(['Payment popup fetch', 'Payment popup effect show'])
// // 等待某些dispatch按顺序触发，同时中间不能插入其他dispatch
// .waitForDispatchByStrict(['Payment popup fetch', 'Payment popup effect show']),
// // 触发一个dispatch，这里用模拟点击为例
// .dispatch('Click button')
// // 自定义监听所有的测试资源
// .watch(() => {})

// mock('xxx', () => {})
