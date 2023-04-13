const FileSystem = require('./FileSystem/index.js');

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
    // const commentReg = /(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g;
    // const comments = commentReg.exec(fileCode) || [];
    // const { length } = comments;

    // for (let i = 0;i<length;i++) {
    //   const comment = comments[i];
    // };
    // debugger;
    let commentReg = /\/\*\*[^.|.]*?\*\//g;
    const comments = fileCode.match(commentReg) || [];
    debugger;
  }

};

module.exports = {
  CodeSpy,
  defaultConfig
};