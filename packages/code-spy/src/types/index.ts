export interface CodeSpyCoreOptionsType {
  name?: string,
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

export enum TestStatusEnum {
  PASS = 'pass',
  ERROR = 'error',
  WAITING = 'waiting'
}

// 报告记录节点
export interface ReporterNodeType {
  // 节点名字
  name: string;
  // 触发类型
  type: string;
  // 被谁触发(null 为主动触发)
  by: string | null;
  // 状态
  status: TestStatusEnum;
}

export enum ReporterStatus {
  LOCKED = 'locked',
  ACTIVE = 'active'
};