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

  return (
    <div>Hello World!</div>
  );
};

export default App;