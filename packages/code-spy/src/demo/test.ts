import { test as spy } from './init';

spy.test('mock测试')
.mock('mock', (count) => {
  return count + 1;
})
.dispatch('点击dispatch', { data: { count: 100 } })


spy.start();
