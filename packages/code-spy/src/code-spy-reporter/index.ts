import { DispatchParams } from './../code-spy-watcher/type';
import { TestStatusEnum, DispatchByCommonType } from 'types';
import { ReporterNodeType, ReporterStatus } from '../types';

class Reporter {
  status:ReporterStatus = ReporterStatus.ACTIVE;

  nodeList: ReporterNodeType[] = [];

  push = (item: DispatchParams | ReporterNodeType) => {
    const { name, type, status = TestStatusEnum.PASS, by = DispatchByCommonType.SPY } = item;
    this.nodeList.push({ name, type, status, by });
    console.log({ name, type, status, by });
  };

  output = (callback: (params:ReporterNodeType[]) => any) => {
    callback(this.nodeList);
  };
};

export default Reporter;