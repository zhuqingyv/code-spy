import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  return (
    <div>hello world!</div>
  )
};

const root = createRoot(document.getElementById('root') || document.body);
root.render(<App />);


// syp.test('xxx')(() => {})