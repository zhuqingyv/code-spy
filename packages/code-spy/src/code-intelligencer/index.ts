import { IntelligencerCreatorType, IntelligencerType } from '../types';

class Intelligencer {
  name;
  type:IntelligencerType;

  constructor({name, type}:IntelligencerCreatorType) {
    this.name = name;
    this.type = type;
  };

  // 等待某一个提交
  waitForDispatch = ():void => {};

  // 监听所有的行为
  watch = () => {};

  // 通过
  pass = () => {};

  // 未通过
  fail = () => {};
};

export default Intelligencer;

// 开启一个自定义测试模块
// spy.test('xxx')(({ watch, waitingForDispatch, pass, fail }) => {
//   // 监听spy.dispatch + spy.test 行为
//   watch(() => {});
//   // 
//   waitingForDispatch(() => {});
//   pass(() => {});
//   fail(() => {});
// });

// // 开启一个流程启动器，用于触发一连串流程，通常与 spy.dispatchFlow|spy.dispatch 一起使用
// spy.testFlow('xxx')(['a_task', 'b_task'], ({ flow }) => {
//   // something...
//   // 这里可以获取到当前触发了哪些流，如果不指定该函数，则所有事件触发以后自动通过测试
// });

// // 被动触发测试(等待testFlow触发)
// spy.dispatchFlow('xxx', ({
//   // 哪个testFlow触发了该函数
//   testFlow
// }) => {
//   // something...
//   // 这里需要 return 一个数据源，供订阅者检查
// });

// // 主动触发，一般用于一些内部状态的共享
// spy.dispatch('xxx', () => {
//   // something...
//   // 这里需要 return 一个数据源，供订阅者检查
// });