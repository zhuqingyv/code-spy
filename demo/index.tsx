import React, { useEffect } from 'react';

const App = () => {

  useEffect(() => {
    console.log('App did mounted!');
    /**
     * @spy
     * @name testEffect
     * @spy.test(({ pass, error }) => {
     *  pass();
     * });
    */
  }, []);

  return (
    <div>Hello World!</div>
  );
};

export default App;