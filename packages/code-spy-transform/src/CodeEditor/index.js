// 在指定位置插入
const inject = ({ code, position, injectCode }) => {
  const beforeCode = code.slice(0, position );
  const afterCode = code.slice(position);
  return `${beforeCode}${injectCode}${afterCode}`;
};

// 覆盖掉指定的
const replace = ({ code }) => {

};

const splitByComments = ({ comments, code }) => {
  const result = [];
  let progress = 0;

  comments.forEach((comment, i) => {
    const isLatest = i === (comments.length - 1);
    const { start, end, loc } = comment;

    const beforeCode = code.slice(progress, start);
    result.push(beforeCode);
    result.push(comment);
    progress = end;
    
    // 末尾检查是否有遗漏
    if (isLatest) {
      const restCode = code.slice(progress);
      if (restCode) result.push(restCode);
    };
  });

  return result;
};

module.exports = {
  inject,
  replace,
  splitByComments
};