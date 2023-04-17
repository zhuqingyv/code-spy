import Intelligencer from '../code-intelligencer';
import { CodeSpyCoreOptionsType, IntelligencerCreatorType } from '../types';

export const defaultConfig = (options:CodeSpyCoreOptionsType = {}) => {
  const _default = {
    global: window || globalThis || global || self || this
  };
  return {
    ..._default,
    ...options
  }
};

class CodeSpyCore {
  options: CodeSpyCoreOptionsType;
  intelligencerMap = new Map();

  constructor(options: CodeSpyCoreOptionsType = {}) {
    this.options = defaultConfig(options);
  };

  create = ({ name, type }:IntelligencerCreatorType) => {
    const intelligencer = new Intelligencer({ name, type });
    const { waitForDispatch, watch } = intelligencer;

    if (this.intelligencerMap.get(name)) console.warn()
    this.intelligencerMap.set(name, intelligencer);

    return (callback: (param) => any) => callback(param);
  };

  get global() {
    return this.options?.global;
  };

  set global(value) {
    if (this.options) {
      this.options.global = value;
    } else {
      console.log(`Cody Spy options is ${String( this.options)}!`)
    };
  }
};

export default CodeSpyCore;