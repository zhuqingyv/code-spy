import { test as spy } from './init';

spy
.test('demo')
.waitDispatchStrict(['App did mounted', 'Fetch Success!'], 3100)
.dispatch('click')

spy.start()

// test.dispatch(name) => spy.useDispatch(name)(() => {});
// test.dispatch(name, ['xx', 'xxx'], 1000) => spy.useWaitDispatch(name)(() => {});
// test.dispatch(name, ['xx', 'xxx'], 1000) => spy.useWaitDispatchStrict(name)(() => {});