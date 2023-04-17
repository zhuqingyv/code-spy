import CodeSpyCore from './code-spy-core';
import { CodeSpyOptionsType } from './types';

export const defaultConfig = (options:CodeSpyOptionsType = {}) => {
  const _default = {
    global: window || globalThis || global || self || this
  };
  return {
    ..._default,
    ...options
  }
};

export class CodeSpy extends CodeSpyCore {
  options:CodeSpyOptionsType;
  constructor(options = {}) {
    super(options);
    this.options = defaultConfig(options);
  };

  test = () => {};
};

export default new CodeSpy();

const spy = new CodeSpy({
  global: window
});

spy