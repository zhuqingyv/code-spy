/**
 * @description 用于统一管理订阅以及订阅触发
*/
import Watcher from './Watcher';
import Reporter from '../code-spy-reporter';
import { findIndex } from 'utils';
import { AwaitFilterType, InterceptorType, DispatchType } from './type';
import { AnyHandle, ReporterNodeType } from 'types';

interface AddParamsType {
  name: string;
  awaitList?: string[];
  awaitFilter?: AwaitFilterType,
  interceptor: InterceptorType
};

interface DispatchParamsType {
  name: string;
  type: DispatchType;
  value?: any;
  status?: string;
};

class WatcherManager {
  // 上报
  reporter: Reporter;
  // 监听器列表
  watcherList: Watcher[] = [];

  constructor() {
    this.reporter = new Reporter();
  }

  dispatch = (params: DispatchParamsType) => {
    const { watcherList } = this;
    this.report(params);
    if (watcherList?.length) watcherList.forEach((watcher) => watcher.dispatch(params));
  };

  add = (params:AddParamsType) => {
    this.remove(params.name);
    const watcher = new Watcher(params);
    this.watcherList.push(watcher);
    return watcher;
  };

  remove = (watcher: Watcher | string | Function):Watcher[] => {
    // remove with watch name
    if (typeof watcher === 'string') {
      const index = findIndex(this.watcherList, (item) => item.name === watcher);
      if (index !== -1) return this.watcherList.splice(index, 1);
    };

    // remove with watcher instance
    if (watcher instanceof Watcher) {
      const index = findIndex(this.watcherList, (item) => item === watcher);
      if (index !== -1) return this.watcherList.splice(index, 1);
    };

    // remove with watcher interceptor handle
    if (watcher instanceof Function) {
      const index = findIndex(this.watcherList, (item) => item.interceptor === watcher);
      if (index !== -1) return this.watcherList.splice(index, 1);
    };

    return [];
  };

  report = (params: DispatchParamsType | ReporterNodeType) => {
    this.reporter.push(params);
  };
};

export default WatcherManager;