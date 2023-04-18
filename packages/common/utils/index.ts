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