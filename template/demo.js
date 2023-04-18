import React, { useEffect, useState } from 'react';

const App = () => {
  const [state, setState] = useState(count);
  /**
   * @spy
   * @name mockState
   * @spy.mock(state, (mock) => setState(mock))
  */
  
  useEffect(() => {
    console.log('App did mounted!');
  }, []);

  const onClick = () => {
    setState({ count: count + 1 });
  };

  /**
   * @spy
   * @name mock场景
   * @spy.mock({}, (mock) => mock);
  */
  /**
   * @spy
   * @name 被动dispatch
   * @spy.useDispatch(onClick);
  */
  /**
   * @spy
   * @name 主动dispatch
   * @spy.dispatch(onClick);
  */
  /**
   * @spy
   * @name 通过test验证
   * @spy.test(() => {});
  */
  /**
   * @spy
   * @name 通过监听器验证
   * @spy.watch(() => {});
  */
  /**
   * @spy
   * @name 通过监听静态顺序队列验证
   * @spy.waitForDispatch(['dispatchName1', 'dispatchName2']);
  */
  /**
   * @spy
   * @name 通过监听静态严格顺序与数量队列验证
   * @spy.waitForDispatchStrict(['dispatchName1', 'dispatchName2']);
  */
  /**
   * @spy
   * @name 通过监听动态顺序队列验证
   * @spy.waitForDispatch((list) => list);
  */
  /**
   * @spy
   * @name 通过监听动态严格顺序与数量队列验证
   * @spy.waitForDispatchStrict((list) => list);
  */


  return (
    <div onClick={onClick}>Hello World!</div>
  );
};

export default App;