/**
 * @description 用于统一管理订阅以及订阅触发
*/
import Watcher from './Watcher';
import { findIndex } from 'utils';
import { AwaitFilterType, InterceptorType, DispatchType } from './type';

interface AddParamsType {
  name: string;
  awaitList: string[];
  awaitFilter: AwaitFilterType,
  interceptor: InterceptorType
};

interface DispatchParamsType {
  name: string;
  type: DispatchType;
  value?: any;
};

class WatcherManager {
  // 监听器列表
  watcherList: Watcher[] = [];

  dispatch = (params: DispatchParamsType) => {
    const { watcherList } = this;
    if (watcherList?.length)  watcherList.forEach((watcher) => watcher.dispatch(params));
  };

  add = (params:AddParamsType) => {
    const watcher = new Watcher(params);
    this.watcherList.push(watcher);
  };

  remove = (watcher: Watcher | string):Watcher[] => {
    // remove with watch name
    if (typeof watcher === 'string') {
      const index = findIndex(this.watcherList, (item) => item.name === watcher);
      return this.watcherList.splice(index, 1);
    };

    // remove with watcher instance
    if (watcher instanceof Watcher) {
      const index = findIndex(this.watcherList, (item) => item === watcher);
      return this.watcherList.splice(index, 1);
    };
    return [];
  };
};

export default WatcherManager;

const manager = new WatcherManager();
// manager.add({
//   name: 'xxx',
//   awaitList: [],
//   awaitFilter: () => false
// });