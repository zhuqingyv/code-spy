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
    this.fileSystem.eachSync(rootDir, this.setSpy);
  };

  setSpy = (fileCode, path) => {
    const { comments } = babelParser.parse(fileCode, {
      sourceType: 'module',
      plugins: ['jsx']
    });
    if (comments?.length) {
      // 代码分割[code,comment,code,...]
      const list = splitByComments({ comments, code: fileCode });
      // 返回map对象处理
      const newCode = list.map((comment) => {
        // 普通代码直接返回数组
        if (typeof comment === 'string') return comment;
        // 块级注释处理
        if (comment?.type === 'CommentBlock') {
          const commentSetter = new Comment({
            codeValue: comment.value,
            path,
            scriptFilter: (code, options) => {
              const codeLines = code.split('\n');
              const outputSingle = (value) => {
                const isSpyMethod = value.match(/spy(\.)(\w)+/);
                if (isSpyMethod) {
                  const [method] = isSpyMethod;
                  const { name } = options;
                  const restString = value.slice(method.length);
                  return `${method}('${name}')${restString}`;
                };
                const index = value.indexOf('*');
                return value.slice(index + 1);
              };

              const string = codeLines.map((value)=> {
                return  outputSingle(value);
              }).join('\n');
              return string; 
            }
          });
          const data = commentSetter.setCode();
          if (!data) return fileCode.slice(comment.start, comment.end);
          // Will run scriptFilter!
          const scripts = data.getScripts();
          if (scripts?.length) return scripts.join('\n');
          return fileCode.slice(comment.start, comment.end);
        };
        return fileCode.slice(comment.start, comment.end);
      }).join('');
      return newCode;
    };

    return fileCode;
  };

};

module.exports = {
  CodeSpyTransform,
  defaultConfig
};