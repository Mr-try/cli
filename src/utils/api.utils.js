/*
 * @Author: Mr.try
 * @Date: 2022-07-07 08:37:39
 */
const fs = require('fs');
module.exports = {
  toCamelWithout: function (str) {
    str = this.toCamel(str).substring(1);
    return this.toUpper4(this.toUpper2(str)).replace(/\/{.*?\}/g, '');
  },
  toUpper: function (str) {
    return str.replace(/_(\w)/g, ($0, $1) => $1?.toUpperCase());
  },
  toUpper2: function (str) {
    return str.replace(/\/(\w)/g, ($0, $1) => $1?.toUpperCase());
  },
  toUpper3: function (str) {
    return str.replace(/-(\w)/g, ($0, $1) => $1?.toUpperCase());
  },
  toUpper4: function (str) {
    return str.replace(
      /\/{(.*?)\}/g,
      ($0, $1) => $1[0].toUpperCase() + $1.substring(1)
    );
  },
  coverString: function (str) {
    return this.toUpper2(str?.replace(/\/{.*?\}/g, '')?.replace('**', ''));
  },
  objToString: function (obj) {
    let str = '';
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (typeof obj[p] === 'object') {
          return this.objToString(obj[p]);
        } else {
          str += p + ':' + obj[p] + '\n';
        }
      }
    }
    return str;
  },
  to$: function (str) {
    return str.replace(/\./g, '$');
  },
  cover$: function (str) {
    return str.replace(/\$/g, '.');
  },
  toCamel: function (str) {
    const temp = str.replace(/([^-])(?:-+([^-]))/g, ($0, $1, $2) => {
      return $1 + $2.toUpperCase();
    });
    return this.to$(temp);
  },
  toLowerLine: function (str) {
    var temp = str.replace(/[A-Z]/g, function (match) {
      return '-' + match.toLowerCase();
    });
    if (temp.slice(0, 1) === '-') {
      temp = temp.slice(1);
    }
    return this.cover$(temp);
  },
  checkFs: function (fileName) {
    let result = {};
    let stats;
    try {
      stats = fs.statSync(fileName);
    } catch (error) {
      return result;
    }
    result = {
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
    };
    return result;
  },

  mkdir: function (fileName) {
    if (!this.checkFs(fileName).isDirectory) {
      fs.mkdirSync(fileName, function (err) {
        if (err) {
          console.log(err);
          return false;
        }
        console.log('model创建成功');
      });
    }
  },

  generateInterface: function (k, def) {
    let obj = '';
    if (!def.properties) {
      obj += `[k:string]: any ,\n`;
    } else {
      const requiredArray = def.required || [];
      const keys = Object.keys(def.properties);
      if (def.description == '返回信息' || def.properties.body) {
        if (keys?.includes('body')) {
          def.properties.data = {
            description: '兼容返回体为body的不规范行为',
            type: def.properties.body.type,
          };
        } else if (!keys?.includes('data')) {
          def.properties.data = {
            allowEmptyValue: false,
            description: '承载数据',
          };
        }
      }
      Object.keys(def.properties).forEach((d) => {
        let v = def.properties[d];
        if (!requiredArray.includes(d)) d = d + '?';
        if (v.description) obj += `\n /** ${v.description} **/ \n`;
        if (v.additionalProperties) {
          v = {
            ...v,
            items: v.additionalProperties.items,
            // type:v.additionalProperties.type
          };
        }
        if (v.items) {
          let tmp = '';
          if (v.items.$ref) {
            tmp = v.items.$ref
              .replace('#/definitions/', '')
              .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
            if (v.type === 'array') tmp += '[]';
          } else {
            tmp = this.coverType(v);
          }
          obj += `${d} : ${tmp},\n`;
        } else if (v.$ref) {
          let tmp2 = '';
          tmp2 = v.$ref
            .replace('#/definitions/', '')
            .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
          if (v.type === 'array') tmp2 += '[]';
          obj += `${d} : ${tmp2},\n`;
        } else {
          obj += `${d} : ${this.coverType(v)} ,\n`;
        }
      });
    }
    return ` 
      /** ${k} **/
      interface ${k.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')} {
        ${obj}
      }
    `;
  },

  coverType: function (v) {
    switch (v.type) {
      case 'string':
        return 'string';
      case 'boolean':
        return 'boolean';
      case 'number':
      case 'integer(int32)':
      case 'integer(int64)':
      case 'integer':
        return 'number';
      case 'array':
        return `${this.coverType(v.items)}[]`;
      default:
        return 'any';
    }
  },
};
