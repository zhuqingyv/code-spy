const copyDir = require('copy-dir');
const fs = require('fs');
const { eachSync } = require('rd');

class FileSystem {
  constructor({ excludes = [], includes = [] }) {
    this.excludes = excludes;
    this.includes = includes;
  };

  copyDir = (from, to) => {
    copyDir.sync(from, to, {
      filter: (...arg) => this.filter(...arg)
    });
  };

  filter = (...arg) => {
    const [,path,] = arg;
    const { excludes } = this;

    // Only has excludes option!
    if (excludes?.length) {
      const hasExcludes = excludes.find((exName) => {
        return exName === path;
      });

      if (hasExcludes) return false;
    };

    return true;
  };

  eachSync = (dirPath, callback) => {
    const { includes } = this;
    const hit = (f) => {
      if (!includes?.length) return true;
      const fileMini = f.slice(-3, f.length);
      return !!includes.find((mini) => {
        return mini === fileMini;
      })
    };
    eachSync(dirPath, (f, s) => {
      if (!s.isDirectory() && hit(f)) {
        const value = callback(fs.readFileSync(f, { encoding: 'utf-8' }), f);
        // null 说明文件不需要重新修改
        if (value !== null) fs.writeFileSync(f, value);
      };
    });
  };
};

module.exports = FileSystem;