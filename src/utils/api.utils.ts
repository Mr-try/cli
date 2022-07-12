/*
 * @Author: Mr.try
 * @Date: 2022-07-07 08:37:39
 */
import fs from 'fs';
export default {
  toCamelWithout: function (str: string) {
    str = this.toCamel(str).substring(1);
    return this.toUpper4(this.toUpper2(str)).replace(/\/{.*?\}/g, '');
  },
  toUpper: function (str: string) {
    return str.replace(/_(\w)/g, (_$0, $1) => $1?.toUpperCase());
  },
  toUpper2: function (str: string) {
    return str.replace(/\/(\w)/g, (_$0, $1) => $1?.toUpperCase());
  },
  toUpper3: function (str: string) {
    return str.replace(/-(\w)/g, (_$0, $1) => $1?.toUpperCase());
  },
  toUpper4: function (str: string) {
    return str.replace(
      /\/{(.*?)\}/g,
      (_$0, $1) => $1[0].toUpperCase() + $1.substring(1)
    );
  },
  coverString: function (str: string) {
    return this.toUpper2(str?.replace(/\/{.*?\}/g, '')?.replace('**', ''));
  },
  objToString: function (obj: any): any {
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
  to$: function (str: string) {
    return str.replace(/\./g, '$');
  },
  cover$: function (str: string) {
    return str.replace(/\$/g, '.');
  },
  toCamel: function (str: string) {
    const temp = str.replace(/([^-])(?:-+([^-]))/g, (_$0, $1, $2) => {
      return $1 + $2.toUpperCase();
    });
    return this.to$(temp);
  },
  toLowerLine: function (str: string) {
    var temp = str.replace(/[A-Z]/g, function (match) {
      return '-' + match.toLowerCase();
    });
    if (temp.slice(0, 1) === '-') {
      temp = temp.slice(1);
    }
    return this.cover$(temp);
  },
  checkFs: function (fileName: string): any {
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

  mkdir: function (fileName: string) {
    if (!this.checkFs(fileName).isDirectory) {
      fs.mkdirSync(fileName);
    }
  },

  generateInterface: function (k: any, def: any) {
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

  coverType: function (v: any): any {
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
