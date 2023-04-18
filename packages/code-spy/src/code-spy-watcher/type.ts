import { IntelligencerType } from '../types';

export interface DispatchParams {
  // 触发对象名称
  name: string;
  // 触发对象类型
  type: IntelligencerType;
  // 触发对象可以携带结果信息
  value?: any;
};

export type InterceptorType = (params: DispatchParams) => any;

export type AwaitFilterType = (params: DispatchParams) => boolean;

export type DispatchType = IntelligencerType