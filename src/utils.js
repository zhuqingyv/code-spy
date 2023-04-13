module.exports = (filePath) => {
  // 多行注释格式如下
  /**
   * @method  templateFun  方法名称
   * @author  webzhang 作者
   * @description markdown模板 描述
   * @param {array} arr 这个例子数组
   * @return {Element} 
   */

  let index = filePath.lastIndexOf('.')
  let producePath = filePath.slice(0, index) + '.md'

  const fs = require('fs')
  const path = require('path')

  /**
   * 检索字符串中指定的值。返回找到的值，并确定其位置。
   * @param {string} reg 正则表达式
   * @param {string} str 字符串
   */
  function regCommonExec(reg, str) {
    let res = reg.exec(str)
    reg.lastIndex = 0
    return res ? res[1] : ''
  }
  /**
   * 找到一个或多个正则表达式的匹配
   * @param {string} reg 正则表达式
   * @param {string} str 字符串
   */
  function strCommonMatch(reg, str) {
    let res = str.match(reg)
    return res ? res : []
  }

  /**
   * 解析注释的每一行
   * @param {string} str 字符串
   */
  function annotationObj(str) {
    // 获取注释类型
    let annotationReg = /\*\s+\@(.*?)\s/
    // 获取参数类型
    let paramTypeReg = /^.+?\{(.+?)\}.*$/
    // 获取参数名称
    let paramNameReg = /^.+?\[(.+?)\].*$/
    // 获取参数文案reg.exec(str)
    let paramTextReg = /\s(\w.*)/
    return {
      category: regCommonExec(annotationReg, str),
      name: regCommonExec(paramNameReg, str),
      type: regCommonExec(paramTypeReg, str),
      text: regCommonExec(paramTextReg, str)
    }
  }

  /**
   * @description markdown模板
   * @method  templateFun
   * @author  webzhang
   * @param {array} arr 
   * @return {Element} 输出的数据
   */
  function templateFun(arr) {
    let paramTable = '| 参数名称 | 说明 | 参数类型 |\n|:--:|:--:|:--:|\n'
    let returnTable = '| 说明 | 输出类型 |\n|:--:|:--:|:--:|\n'
    let defaultObj = {
      description: '',
      method: '',
      author: '',
      param: '',
      return: ''
    }
    /**
     * @description 注释每一行对应的模板解析
     * @param {object} ele 
     * @param {string} str 
     */
    function tempOptionFun(ele, str) {
      let tempObj = {
        'method': `${ele.text}\n`,
        'author': `作者：${ele.text}\n`,
        'description': `功能描述：${ele.text}\n`,
        'param': `| ${ele.name} | ${ele.text} | ${ele.type}  |\n`,
        'return': `| 输出的数据 | ${ele.type}  |\n`
      }
      return tempObj[str]
    }
    arr.forEach((ele) => {
      defaultObj[ele.category] += tempOptionFun(ele, ele.category)
    })
    return `### ${defaultObj.method}:\n${defaultObj.author}${defaultObj.description}${(defaultObj.param ? paramTable + defaultObj.param : '')}${(defaultObj.return ? returnTable + defaultObj.return : '')}`
  }
  /**
   * 数据处理
   * @param {string} str
   */
  function processingData(str) {
    // 多行注释的正则
    let getAnnReg = /\/\*\*[^.|.]*?\*\//g
    // 多行注释里的内容
    let splitAnnReg = /\*\s@.{1,}/g

    // 获取所有的注释数据
    let annotationArr = strCommonMatch(getAnnReg, str)
    let formatArr = []
    annotationArr.forEach(element => {
      // 获取参数数据的参数
      let paramArr = strCommonMatch(splitAnnReg, element)
      let paramObjArr = []
      paramArr.forEach(ele => {
        paramObjArr.push(annotationObj(ele))
      });
      // 把参数使用模板进行加工
      formatArr.push(templateFun(paramObjArr))
    });
    return formatArr.join('\n')
  }

  const setComment = () => {
    /**
     * 回写数据程序
     */
    const writeBack = (str) => {
      let importString = processingData(str)
      const filepath = path.resolve(__dirname, producePath)
      fs.writeFile(filepath, importString, 'utf8', () => {
        console.log("开始处理数据。。。。")
      })
    }
    let data = fs.readFileSync(filePath);
    writeBack(data.toString())
  };
};
