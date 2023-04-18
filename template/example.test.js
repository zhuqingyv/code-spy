import spy from 'code-spy/test';

spy
// 创建一个测试实例
.test('Payment test demo')
// 激活mock脚本，函数入参为spy提供，返回值提供给mock入参
.mock('Payment', () => ({}))
.mock('Submit to Pay', () => ({}))
// 触发一个dispatch，这里用模拟点击为例
.dispatch('Click button')
// 等待某些dispatch触发
.waitForDispatch(['Payment popup fetch', 'Payment popup effect show'])
// 如果测试顺利执行到底则该测试完成，中间如果执行过fail或者报错，都会失败


// 无论上一个测试是否成功，都会执行以下测试
spy
.test('Next test demo')

// 这里开始执行测试(内部由flow-work实现，所以一定要手动开始)
spy.start();
