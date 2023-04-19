import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './test';
import { spy } from './init';

const App = () => {
  const [count, setCount] = useState(0);
  const onClick = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    // 注入mock方法
    spy.mock('mock')(count, (_count:any) => {
      setCount(_count)
    });

    spy.dispatch('组件加载完毕');
  }, []);

  // 注入被动dispatch
  spy.useDispatch('点击dispatch')(onClick);

  spy.waitForDispatch('等待组件加载完成')(['组件加载完毕'], () => {
    console.log('等待组件加载完成');
  });

  return (
    <div onClick={onClick}>count is: { count }</div>
  )
};

const root = createRoot(document.getElementById('root') || document.body);
root.render(<App />);


// syp.test('xxx')(() => {})