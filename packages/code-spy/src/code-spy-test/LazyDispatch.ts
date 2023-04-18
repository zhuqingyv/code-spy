interface DispatchType {
  name: string;
  dispatchHandle: (params:any) => any;
};

class Dispatch {
  name:string;
  dispatchHandle: (params:any) => any;
  constructor({name, dispatchHandle}: DispatchType) {
    this.name = name;
    this.dispatchHandle = dispatchHandle;
  };

  run = () => {
    const { name, dispatchHandle } = this;
    dispatchHandle()
  };
};

class LazyDispatchManager {
  dispatchMap = new Map();

  create = ({name, dispatchHandle}: DispatchType) => {
    const dispatch = new Dispatch({ name, dispatchHandle });
    this.dispatchMap.set(name, dispatch);
  };

  remove = () => {};

  getDispatch = (name:string) => {
    return this.dispatchMap.get(name);
  };
};

export default LazyDispatchManager;

// spy.lazyDispatch('惰性')(() => {})