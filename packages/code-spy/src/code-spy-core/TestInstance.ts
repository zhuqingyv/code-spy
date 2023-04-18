import Flow, { workFlow } from 'flow-work';
import Mocker from './Mocker';
import CodeSpyCore from './index';

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
  dispatch = (name: string) => {
    this.flow.run(`dispatch:${name}`, (_data, next, finishProxy) => {
      try {
        this.spy.dispatch(name, next);
      } catch (error) {
        finishProxy(error);
      };
    });
    return this;
  };

  // 自定义监听所有的测试资源
  watch = (intercept) => {
    this.spy.watch(intercept, this);
    return this;
  };

  waitForDispatch = (waitingList) => {
    this.spy.waitForDispatch(waitingList, this);
    return this;
  };

  waitForDispatchByStrict = (waitingList) => {
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