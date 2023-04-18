/**
 * 一个监听器
*/
import { DispatchParams, InterceptorType, AwaitFilterType } from './type';

class Watcher {
  name?:string;
  interceptor: InterceptorType;
  awaitList?: string[];
  awaitFilter?:AwaitFilterType;

  constructor({ name, interceptor, awaitList, awaitFilter }: { name?: string, interceptor: InterceptorType, awaitList?: string[], awaitFilter?: AwaitFilterType}) {
    this.name = name || 'watcher';
    // dispatch 以后直接触发的出口
    this.interceptor = interceptor;
    // 需要等待的列表
    this.awaitList = awaitList;
    // 通过函数干预等待结果
    this.awaitFilter = awaitFilter;
  };

  // 被动触发入口
  dispatch = (params: DispatchParams) => {
    if (this.filter(params)) this.interceptor(params);
  };

  // 触发出口过滤器
  filter = (params: DispatchParams):boolean => {
    const { awaitList = [] } = this;
    // 没有过滤直接返回
    if (!awaitList?.length) return true;

    const { name } = params;
    const inList = awaitList.find((item) => item === name);
    if (inList) {
      const { awaitFilter } = this;
      if (awaitFilter && awaitFilter instanceof Function) return awaitFilter(params);
      return true;
    };
    return false;
  };

  get type() {
    const { awaitList } = this;
    if (awaitList?.length) return 'wait';
    return 'normal';
  }
};

export default Watcher;

// const watcher = new Watcher({
//   name: 'xxx',
//   awaitList: [],
//   awaitFilter: () => false,
//   interceptor: () => {}
// });

// // 被被动触发唯一入口
// watcher.dispatch();

// // 等待 名为xxx 的dispatch
// watcher.waitingForInterceptor('xxx');

// // 等待 名为xxx + yyy 顺序提交
// watcher.waitingForInterceptor(['xxx', 'yyy']);

// // 等待 名为xxx + yyy 顺序提交，并且指定一个函数干预结果
// watcher.waitingForInterceptor(['xxx', 'yyy'], () => {});