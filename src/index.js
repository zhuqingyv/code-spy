const FileSystem = require('./FileSystem/index.js');
const Comment = require('./Comment/index.js');
const { splitByComments } = require('./CodeEditor/index');
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

class CodeSpy {
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
    const { comments } = babelParser.parse(fileCode);
    if (comments?.length) {
      debugger;
      // 代码分割
      const list = splitByComments({ comments, code: fileCode });
      // 注释重新
      const result = list.map((comment) => {
        // 普通代码
        if (typeof comment === 'string') return comment;
        // 这里只处理块级注释
        if (comment?.type === 'CommentBlock') {
          const commentSetter = new Comment({
            codeValue: comment.value,
            path
          });

          const scriptFilter = (code, options) => {
            // TODO: 分行处理
            const isSpyMethod = code.match(/spy(\.)(\w)+/);
            if (isSpyMethod) {
              const [method] = isSpyMethod;
              const { name } = options;
              const restString = code.slice(method.length);
              return `${method}('${name}')${restString}`;
            };
            return code;
          };

          const data = commentSetter.setCode({ scriptFilter });
          // Will run scriptFilter!
          const code = data.getScripts();
          
          if (code?.length) return code.join('\n');
          return '';
        };
        return fileCode.slice(comment.start, comment.end);
      });
      return result.join('');
    };
  };

};

module.exports = {
  CodeSpy,
  defaultConfig
};