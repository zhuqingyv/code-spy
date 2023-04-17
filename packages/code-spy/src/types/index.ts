export interface CodeSpyCoreOptionsType {
  // 用于全局引入
  global?:any;
};

export interface CodeSpyOptionsType extends CodeSpyCoreOptionsType {
  
};

export enum IntelligencerType {
  TEST = 'test',
  DISPATCH = 'dispatch',
};

export interface IntelligencerCreatorType {
  name: string;
  type: IntelligencerType;
};