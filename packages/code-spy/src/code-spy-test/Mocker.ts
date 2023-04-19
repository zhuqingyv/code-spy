class Mocker {
  name:string;
  getMock: (params:any) => any;
  constructor({ name, getMock} : {name:string,getMock: (params:any) => any}) {
    this.name = name;
    this.getMock = getMock;
  };

  // 执行mock脚本
  run = (data:any, callback: (params:any) => any) => {
    const value = this.getMock(data);
    if (callback && callback instanceof Function) return callback(value);
    return value;
  };
};

export default Mocker;