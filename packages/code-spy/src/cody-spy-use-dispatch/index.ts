type DispatchHandleType = (params?:any[]) => any;

interface DispatchType {
  name: string;
  dispatchHandle: DispatchHandleType
};

class DispatchInstance {
  name:string;
  dispatchHandle: DispatchHandleType
  constructor({name, dispatchHandle}: DispatchType) {
    this.name = name;
    this.dispatchHandle = dispatchHandle;
  };

  run = (data:any) => {
    const { dispatchHandle } = this;
    dispatchHandle(data)
  };
};

class DispatchManager {
  dispatchMap = new Map();

  create = ({name, dispatchHandle}: DispatchType) => {
    const dispatch = new DispatchInstance({ name, dispatchHandle });
    this.dispatchMap.set(name, dispatch);
    return dispatch;
  };

  remove = (dispatch: string | DispatchHandleType | DispatchInstance):any => {
    // 指定名称移除
    if (typeof dispatch === 'string') {
      return this.dispatchMap.delete(dispatch);
    };

    // 指定handle
    if (dispatch instanceof Function) {
      // @ts-ignore
      return Array.from(this.dispatchMap).find((item) => {
        const _dispatch = item[1];
        const { name, dispatchHandle } = _dispatch;
        if (dispatchHandle === dispatch) {
          this.dispatchMap.delete(name);
          return true;
        };
      });
    };

    // 指定实例
    if (dispatch instanceof DispatchInstance) {
      return Array.from(this.dispatchMap).find((item) => {
        const instance = item[1];
        if (instance === dispatch) {
          this.dispatchMap.delete(instance.name);
          return true;
        };
      });
    };
  };

  getDispatch = (name:string) => {
    return this.dispatchMap.get(name);
  };
};

export default DispatchManager;