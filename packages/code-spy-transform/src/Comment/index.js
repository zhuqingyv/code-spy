class Comment {
  /**
   * @constructor
   * @param { string } codeValue 代码序列化字符
   * @param { string } path 代码文件地址
  */
  constructor({ codeValue, path, scriptFilter }) {
    this.codeValue = codeValue;
    this.path = path;
    this.scriptFilter = scriptFilter;
  };

  /**
   * @description 操作注释
  */
  setCode = ({ codeValue, scriptFilter = this.scriptFilter } = {}) => {
    return this.getCommentData({
      codeValue: codeValue || this.codeValue,
      scriptFilter
    });
  };

  /**
   * @description 注释拆分
   * @param { string } codeValue 序列化代码
   * @return {
   *   options, // 单行配置
   *   scripts  // 脚本配置
   * }
  */
  splitCommentData = ({ codeValue } = {}) => {
    const comment = codeValue || this.codeValue;
    const _comment = comment.split('\n');
    // 掐头去尾
    _comment.pop();
    _comment.shift();

    // 根据@符号拆分
    const result = [];
    const scripts = [];

    let currentCache = {
      type: null,
      value: []
    };

    _comment.forEach((commentLine, i) => {
      const keyReg = /@(\S*)/;
      const scriptReg = /@spy\.(\S*)/;
      const _match = commentLine.match(keyReg);
      const _matchScript = commentLine.match(scriptReg);
      const isLatest = (i === _comment.length - 1);


      if (_match) {
        if (currentCache.value.length) {
          if (currentCache.type === 'script') {
            scripts.push(currentCache.value.join('\n'));
          } else {
            result.push(currentCache.value.join('\n'));
          };
          currentCache.value = [];
        };
        currentCache.value.push(`${commentLine}`);
        currentCache.type = _matchScript ? 'script' : 'option';
        return;
      } else {
        currentCache.value.push(`${commentLine}`);
      };
      if (isLatest && currentCache.value.length) {
        if (currentCache.type === 'script') {
          scripts.push(currentCache.value.join('\n'));
        } else {
          result.push(currentCache.value.join('\n'));
        };
        currentCache.value = [];
      };
    });

    if (currentCache.value.length) {
      (currentCache.type === 'script' ? scripts : result).push(...currentCache.value);
      currentCache.value = [];
    };

    return {
      options: result,
      scripts
    };
  };

  /**
   * @description 注释中脚本提取
   * @param { string[] } scriptValue 脚本序列化字符
   * @return { string } 返回纯净脚本
  */
  getCommentScript = ({ scriptValue, scriptFilter = this.scriptFilter, options } = {}) => {
    const list = scriptValue instanceof Array ? scriptValue : [scriptValue];
    return list
    .map((code, i) => {

      // 首行直接返回@后面的
      if (i === 0) {
        const _code = code.slice(code.indexOf('@spy') + 1);
        if (scriptFilter && scriptFilter instanceof Function) return scriptFilter(_code, options)
        return _code;
      };

      const index = code.indexOf('*');
      if (index === -1) {
        if (scriptFilter && scriptFilter instanceof Function) return scriptFilter(code, options)
        return code;
      };

      if (scriptFilter && scriptFilter instanceof Function) {
        return scriptFilter(code.slice(index + 1), options);
      }
      return code.slice(index + 1);
    }).join('');
  };

  /**
   * @description 注释 => json
   * @param { string } codeValue 序列化代码
   * @return {
   *   options, // 单行配置json结构
   *   scripts  // 脚本配置json结构
   * }
  */
  getCommentData = ({ codeValue, scriptFilter = this.scriptFilter } = {}) => {
    const comment = codeValue || this.codeValue;
    // 判断是spy注释块
    const isSpy = (line) => {
      return !!line.match(/(\@spy)/);
    };

    // 从注释中获取配置
    const checkOption = (optionValue) => {
      const keyReg = /@(\S*)/;
      const _match = optionValue.match(keyReg);
      if (!_match) return null;
      const [,key] = _match;
      const { index } = _match;
      const value = optionValue.slice(index + (`@${key}`).length + 1);
      return { key, value }
    };

    const { options, scripts } = this.splitCommentData({ comment });
    const [_spy, ...optionsLines] = options;

    if (isSpy(_spy)) {
      const commentData = {
        options: {},
        getScripts: () => {
          const scripsString = scripts.map((scriptValue) => this.getCommentScript({ scriptValue, scriptFilter, options: commentData.options }));
          return commentData.scripts = scripsString;
        }
      };

      optionsLines.forEach((optionValue) => {
        const option = checkOption(optionValue);
        if (option) {
          const { key, value } = option;
          commentData.options[key] = value;
        };
      });
      return commentData;
    };

    return null;
  };
};

module.exports = Comment;