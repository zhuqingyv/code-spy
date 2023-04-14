# <h1 style="color: rgba(0,0,0,0.5)">Code Spy</h1>

![logo](./logo.png)

Insert a single test case in the form of annotations, and ultimately generate a test report!

## What is code-spy

Firstly, ***code-spy*** provides the ability to write one-sided use cases through annotations, so your single test can penetrate into any part of your code like annotations.

Here is a minimal example with React:

``` tsx
import React, { useEffect } from 'react';

const App = () => {

  useEffect(() => {
    console.log('App did mounted!');
    /**
     * @spy
     * @name testEffect
     * @spy.test(({ pass, error }) => {
     * pass();
     * });
    */
  }, []);

  return (
    <div>Hello World!</div>
  );
};

export default App;
```

***code-spy*** will convert your code like this:

``` tsx
import React, { useEffect } from 'react';

const App = () => {

  useEffect(() => {
    console.log('App did mounted!');
    spy.test('testEffect')(({ pass, error }) => {
  pass();
 });
  }, []);

  return (
    <div>Hello World!</div>
  );
};

export default App;
```
