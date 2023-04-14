import React, { useEffect } from 'react';
import { View } from 'react-native';

/**
 * @examples 测试
 * @param 明白
*/
// 单行注释
const OrderDetail = () => {
  useEffect(() => {
    /**
     * @spy
     * @name 间谍1
     * @spy.test(() => {});
    */
    /**
     * @spy
     * @name 测试
     * @spy.dispatch();
    */
  }, []);

  return (
    <View></View>
  );
};

export default OrderDetail;