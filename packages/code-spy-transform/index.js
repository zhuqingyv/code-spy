/**
 * @description 复制文件 & 转换注释=>spy代码
*/

const FileSystem = require('./src/FileSystem/index.js');
const Comment = require('./src/Comment/index.js');
const { splitByComments } = require('./src/CodeEditor/index');
const babelParser = require('@babel/parser');

const defaultConfig = (options = {}) => {
  const _default = {
    testDir: process.cwd(),
    includes: [],
    caseList: [],
    copyIgnore: [],
    reporter: `${process.cwd()}/.code-spy-reporter`,
    rootDir: `${process.cwd()}/.code-spy`
  };

  return {
    ..._default,
    ...options
  };
};

class CodeSpyTransform {
  fileSystem = null;

  /**
   * @param options.testDir 复制的项目目录
  */
  constructor(options = {}) {
    const { copyIgnore, includes } = this.options = defaultConfig(options);
    this.fileSystem = new FileSystem({ excludes: copyIgnore, includes });
    this.copyProject();
    this.checkFiles();
  };

  copyProject = () => {
    const { testDir, rootDir } = this.options;
    this.fileSystem.copyDir(testDir, rootDir);
  };

  checkFiles = () => {
    const { rootDir } = this.options;
    this.fileSystem.eachSync(rootDir, this.setComments);
  };

  // 处理脚本
  setComments = (fileCode, path) => {
    const { comments } = babelParser.parse(fileCode, {
      sourceType: 'module',
      plugins: ['jsx']
    });

    // 没有注释直接返回
    if (!comments?.length) return null;

    // 代码分割[code,comment,code,...]
    const list = splitByComments({ comments, code: fileCode });

    // 处理错误或者意外结果 直接返回不进行文件写入
    if (!list?.length) return null;

    // 返回map对象处理
    const newCodeList = list.map((comment) => {
      // 普通代码直接返回数组
      if (typeof comment === 'string') return comment;

      // 单行注释直出
      if (comment?.type !== 'CommentBlock') return this.outputCommentCode({ fileCode, comment });

      // 块级注释处理
      if (comment?.type === 'CommentBlock') return this.setSpy({ fileCode, path, comment });
    });

    return newCodeList.join('');
  };

  setSpy = ({ fileCode, path, comment }) => {
    const commentSetter = new Comment({
      codeValue: comment.value,
      path,
      scriptFilter: this.scriptFilter
    });
    const data = commentSetter.setCode();

    // 普通块级注释
    if (!data) return outputCommentCode({ fileCode, comment });
    const scripts = data.getScripts();

    // 没写脚本，也当做普通块级注释直出
    if (!scripts?.length) return outputCommentCode({ fileCode, comment });

    // @spy 脚本直出
    if (scripts?.length) return scripts.join('\n');
    
  };

  // 直出注释内容
  outputCommentCode = ({ fileCode, comment }) => fileCode.slice(comment.start, comment.end);

  // 脚本过滤器
  scriptFilter = (code, options) => {
    const codeLines = code.split('\n');
    const outputSingle = (value) => {
      const isSpyMethod = value.match(/spy(\.)(\w)+/);
      const joinOptions = (_list = []) => {
        const list = _list.filter((item) => item !== undefined);
        return list.map((item) => {
          const isNumber = !isNaN(Number(item));
          return isNumber ? item : `'${item}'`;
        }).join(',')
      };
      if (isSpyMethod) {
        const [method] = isSpyMethod;
        const { name, timeout } = options;
        const restString = value.slice(method.length);
        // return `${method}('${name}')${restString}`;
        return `${method}(${joinOptions([name, timeout])})${restString}`;
      };
      const index = value.indexOf('*');
      return value.slice(index + 1);
    };

    const string = codeLines.map((value)=> {
      return  outputSingle(value);
    }).join('\n');
    return string; 
  }
};

module.exports = {
  CodeSpyTransform,
  defaultConfig
};