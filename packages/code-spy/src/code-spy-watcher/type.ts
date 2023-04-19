import { IntelligencerType, TestStatusEnum, DispatchByCommonType } from 'types';

export interface DispatchParams {
  // 触发对象名称
  name: string;
  // 触发对象类型
  type: IntelligencerType;
  // 触发对象可以携带结果信息
  value?: any;
  status?: TestStatusEnum;
  by?:DispatchByCommonType;
};

export type InterceptorType = (params: DispatchParams) => any;

export type AwaitFilterType = (params: DispatchParams) => boolean;

export type DispatchType = IntelligencerType