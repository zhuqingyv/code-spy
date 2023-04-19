import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './test';
import { spy } from './init';

const mockFetch = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title: 'Fetch Success!'
      })
    }, 3000);
  })
};

const App = () => {
  const [state, setState] = useState({
    title: 'Never Fetch!'
  });

  const onClick = () => {
    setState({ title: 'clicked' });
  };
  // 3
  spy.useDispatch('click')(onClick);

  useEffect(() => {
    // 1.
    spy.dispatch('App did mounted');

    mockFetch().then((res) => {
      // @ts-ignore
      setState(res);
      // 2
      spy.dispatch('Fetch Success!');
    })
  }, []);

  return (
    <div>
      <div>{ state.title }</div>
      <button onClick={onClick}>click!</button>
    </div>
  )
};

const root = createRoot(document.getElementById('root') || document.body);
root.render(<App />);


// syp.test('xxx')(() => {})