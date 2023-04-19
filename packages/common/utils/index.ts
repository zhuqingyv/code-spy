import { AnyHandle } from 'types';
type CallbackType = (data: any, index: number) => boolean | any;

export const findIndex = (array: unknown[], callback: CallbackType) => {
  // test data
  if (!array?.length || !array?.find || !(array instanceof Array)) return -1;
  // test handle
  if (!callback || !(callback instanceof Function)) return -1;

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (callback(item, i)) return i;
  }

  return -1;
};

export const timeoutHandle = (handle: AnyHandle, timeout: number, outHandle: AnyHandle = () => null, successHandle:AnyHandle = () => null) => {
  const outTimer = setTimeout(() => {
    outHandle();
  }, timeout);
  return (...arg:any[]) => {
    clearTimeout(outTimer);
    successHandle(...arg);
    return handle(...arg);
  };
};

export const arrayToObjectMap = (array:string[]) => {
  return array.reduce((obj, key) => {
    obj.set(key, true);
    return obj;
  }, new Map());
};