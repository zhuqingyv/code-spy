const a = () => {
  /**
   * @spy
   * @name 测试
   * @spy.test(() => {});
  */
};

const b = () => {
  /**
   * @spy
   * @name 测试dispatch
   * @spy.dispatch('我已经发送!');
  */
};

const c = () => {
  /**
   * @spy
   * @name 独立的
   * @spy.waitingFor(() => {
   * 
   * });
  */
};