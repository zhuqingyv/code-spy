import React, { useEffect, useState } from 'react';

const App = () => {
  const [count, setState] = useState(1);
  /**
   * @spy
   * @name mockState
   * @spy.mock(count, (mock) => setState(mock))
  */
  useEffect(() => {
    console.log('App did mounted!');
  }, []);

  return (
    <div>Count is: {count}</div>
  );
};

export default App;