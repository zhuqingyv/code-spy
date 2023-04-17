class CodeSpy {};

// module.exports = CodeSpy;


// spy.test('name')(() => {})


const spy = {
  test: (name) => {
    return (callback) => {
      callback({ waitFor: (...arg) => console.log(...arg), pass: (...arg) => console.log(...arg), error: (...arg) => console.log(...arg)  })
    };
  }
};

// 等待触发的case 一单程序运行，就开始执行
spy.test('hello world')(({ waitFor, pass, error }) => {
  waitFor('waitFor success');
  pass('pass success');
  error('error success');
});

spy.flow()
// 开始测试部分

new CodeSpy({
  befor
});

/**
 * @run code-spy init
 * @description 初始化一个测试环境，包括基础的配置
*/