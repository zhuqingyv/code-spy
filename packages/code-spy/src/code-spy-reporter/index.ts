import CodySpy from '../code-spy-core';
import { ReporterNodeType, ReporterStatus } from '../types';

class Reporter {
  status:ReporterStatus = ReporterStatus.ACTIVE;
  context!: CodySpy;

  nodeList!: ReporterNodeType[];

  constructor({ context }: { context: CodySpy }) {
    this.context = context;
  };

  push = (item: ReporterNodeType) => {
    const { name, type, status, by } = item;
    this.nodeList.push({ name, type, status, by });
  };

  output = (callback: (params:ReporterNodeType[]) => any) => {
    callback(this.nodeList);
  };
};

export default Reporter;