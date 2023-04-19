import CodeSpy from '../index';

export type CodeSpyType = CodeSpy;
// 任意函数
export type AnyHandle = ((params?:any[]) => any) | ((params?:any) => any);
// 
export interface CodeSpyTestOptionsType {
  name?: string;
  // 用于全局引入
  global?:any;
  spy: CodeSpy;
};

// 上报状态枚举
export enum IntelligencerType {
  TEST = 'test',
  DISPATCH = 'dispatch',
  WAIT_FOR_DISPATCH = 'waitForDispatch',
  WAIT_FOR_DISPATCH_STRICT = 'waitForDispatchStrict',
  USE_DISPATCH = 'useDispatch',
};

// 驱动者的名称
export enum DispatchByCommonType {
  SPY = 'spy'
};

export type DispatchByType = DispatchByCommonType | string;

export interface IntelligencerCreatorType {
  name: string;
  type: IntelligencerType;
};

export enum TestStatusEnum {
  PASS = 'pass',
  ERROR = 'error',
  WAITING = 'waiting',
  TIME_OUT = 'timeout',
  NOT_FOUND = 'notFound',
  BREAK = 'break'
}

// 报告记录节点
export interface ReporterNodeType {
  // 节点名字
  name: string;
  // 触发类型
  type: string;
  // 被谁触发(null 为主动触发)
  by?: string | null;
  // 状态
  status: TestStatusEnum;
}

export enum ReporterStatus {
  LOCKED = 'locked',
  ACTIVE = 'active'
};