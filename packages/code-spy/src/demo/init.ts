import CodeSpy from '../index';

export const spy = new CodeSpy();
export const test = spy.codeSpyTest;

window.spy = spy;
