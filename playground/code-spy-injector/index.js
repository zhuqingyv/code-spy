const CodeInjector = require('../../packages/code-spy-injector');
const path = require('path');

const codeInjector = new CodeInjector({
  target: path.resolve(__dirname, './demo/index.js'),
  script: `console.log('Hello World!')`,
});

Promise.resolve()
.then(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      codeInjector.injectTop();
      resolve();
    }, 2000);
  })
})
.then(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      codeInjector.inject({ script: `console.log('Hello World!2')` });
      resolve();
    }, 2000);
  })
})
.then(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      codeInjector.resume();
      resolve(); 
    }, 2000);
  })
})
