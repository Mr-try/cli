/*
 * @Author: Mr.try
 * @Date: 2022-02-11 13:49:53
 */
import fs from 'fs';
import axios from 'axios';
import config from './sw';
import utils from './api.utils';

export default class SW {
  config: any;
  doc: any;
  modules: any;
  constructor() {
    this.config = {
      swaggerUrl: '',
      mock: true,
      verifyReq_: true,
      language: 'ts',
      requestPath: './util',
      isDefaultExport: false,
    };
    this.doc = [];
    this.modules = [];
  }

  async init() {
    this.config = Object.assign(this.config, config);
    /** 取出所有微服务的resource对象 */
    await this.getAllModules();
  }

  async getAllModules() {
    const modules = await axios.get(this.config.swaggerUrl);
    this.modules = this.config?.includes
      ? modules.data?.filter((k: any) =>
          this.config?.includes?.includes(k.name)
        )
      : modules.data;
    utils.mkdir('src');
    /** 不需要生成resource文件 */
    // utils.mkdir('src/swagger/resources')

    utils.mkdir('src/types');
    utils.mkdir('src/apis');

    for (let index = 0; index < this.modules.length; index++) {
      const mod = this.modules[index];
      // console.log(
      //   '\x1B[36m%s\x1B[0m',
      //   `----------开始获取${mod.name}数据---------`
      // );
      try {
        const res = await axios.get(this.config.host + mod.location);
        if (typeof res.data == 'string') {
          // console.log(
          //   '\x1B[31m%s\x1B[0m',
          //   `----------获取${mod.name}数据失败:${res.data}---------`
          // );
        } else {
          // const fileContent = `
          //   const resources = ${JSON.stringify(res.data)}
          //   export default resources
          // `
          // fs.writeFileSync(`src/resources/${mod.name}.ts`, fileContent ,'utf8')

          this.generateMods(res.data.basePath, res.data.definitions);
          this.generateApis(
            res.data.basePath,
            res.data.paths,
            res.data.basePath
          );
          // console.log(
          //   '\x1B[36m%s\x1B[0m',
          //   `----------获取${mod.name}数据成功---------`
          // );
        }
      } catch (error) {
        // console.log(
        //   '\x1B[31m%s\x1B[0m',
        //   `----------获取${mod.name}数据失败---------`
        // );
        // console.log('url', this.config.host + mod.location);
        // console.log(
        //   '\x1B[31m%s\x1B[0m',
        //   `----------获取${mod.name}数据失败---------`
        // );
      }
    }
  }

  /**
   * 根据definitions生成对象类型
   */
  generateMods(name: any, definitions: any) {
    name = utils.toCamel(name).substring(1);
    if (name.substr(name.length - 1, 1) == '/') {
      name = name.substring(0, name.length - 1);
    }
    let fileContent = '';
    Object.keys(definitions).forEach((k) => {
      fileContent += utils.generateInterface(k, definitions[k]);
    });
    fs.writeFileSync(
      `src/types/${name}.d.ts`,
      `
      declare namespace ${name} {
        ${fileContent}  
      }
      `,
      'utf8'
    );
  }

  /**
   * 根据 paths生成 api方法
   * 第一步:先生成所有对象声明
   * 第二步:生成每条url的回调
   */
  generateApis(name: any, pathsObj: any, rootPath: any) {
    const paths = Object.keys(pathsObj);
    /*
     *合并简化单个method方法的初始对象
     */
    for (let index = 0; index < paths.length; index++) {
      const crtPath = paths[index];
      const methods = Object.keys(pathsObj[crtPath]);
      if (methods.length == 1) {
        pathsObj[utils.toCamelWithout(crtPath)] = {
          ...pathsObj[crtPath][methods[0]],
          api: crtPath,
          method: methods[0],
        };
      } else {
        methods.forEach((k) => {
          pathsObj[utils.toCamelWithout(`${crtPath}/${k}`)] = {
            ...pathsObj[crtPath][k],
            api: crtPath.replace(/\/{.*?\}/g, '')?.replace('**', ''),
            method: k,
          };
        });
      }
      delete pathsObj[crtPath];
    }

    // 模块名 根据basePath生成 也用作文件名
    name = utils.toCamelWithout(name).replace('/', '')?.replace('**', '');
    const finalPath = Object.keys(pathsObj);
    let ResInterface = '';
    let ReqInterface = '';
    let fnString = '';

    finalPath.forEach((apiFn) => {
      let apiFnName = utils.coverString(apiFn);
      const resObj = utils.toUpper(`Res_${apiFnName}`);
      let reqObj = utils.toUpper(`Req_${apiFnName}`);
      const crt = pathsObj[apiFn];

      /** 处理出参interface */
      if (crt.responses[200].schema && crt.responses[200].schema.$ref) {
        const schema = crt.responses[200].schema.$ref
          .replace('#/definitions/', '')
          .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
        ResInterface += `interface ${resObj} extends ${name}.${schema} {[k:string]:any} \n`;
      } else {
        ResInterface += `interface ${resObj} { [k:string]:any }`;
      }
      const urlPath =
        '`' +
        `${rootPath}${crt.api?.replace(
          /\{(.*?)\}/g,
          (_$0: any, $1: any) => '${' + `data.${$1}` + '}'
        )}` +
        '`';
      /** 处理入参interface */
      let schemaName: any = [];
      if (crt.parameters) {
        let paramStr = '';
        crt.parameters.forEach((p: any) => {
          let type = '';
          if (p.schema && p.schema.$ref) {
            const schema = p.schema.$ref
              .replace('#/definitions/', '')
              .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
            type = `${name}.${schema} ${p.type === 'array' ? '[]' : ''}`;
            paramStr += `
            /** ${p.description} **/
            ${p.name}? : ${type}; \n`;

            if (p.name.includes('DTO') || p.name?.includes('Req')) {
              schemaName.push(p.name);
            }
          } else {
            type = utils.coverType({ ...p, ...p?.schema });
            paramStr += `
            /** ${p.description} **/
            '${p.name}' ${p.required ? '' : '?'} : ${type};`;
          }
        });
        ReqInterface += `type ${reqObj} = {${paramStr}} \n`;
        let params = '';
        schemaName?.forEach((k: any) => {
          if (k) {
            params = '&' + params + reqObj + `['${k}']`;
          }
          // reqObj +=`&${reqObj}['${k}']`
        });
        /** 生成回调函数 */
        fnString += `
          /** 
            * url: ${crt.api}
            * tags: ${crt.tags.join('-')}
            * summary: ${crt.summary}
          */
          export const ${apiFnName} = (data:${reqObj}${params}) => request<${resObj},${resObj}['data']>(${urlPath},'${
          crt.method
        }', data)
          \n
          ${name}.${apiFnName} = ${apiFnName}
        `;
      } else {
        ReqInterface += `type ${reqObj} = { [k:string]:any } \n`;
        /** 生成回调函数 */
        fnString += `
          /** 
            * url: ${crt.api}
            * tags: ${crt.tags.join('-')}
            * summary: ${crt.summary}
          */
          export const ${apiFnName} = () => request<${resObj},${resObj}['data']>(${urlPath},'${
          crt.method
        }')
          \n
          ${name}.${apiFnName} = ${apiFnName}
        `;
      }
    });

    fs.writeFileSync(
      `src/apis/${name}.ts`,
      `
      import ${this.config.isDefaultExport ? 'request' : '{ request }'} from '${
        this.config.requestPath
      }'
      const ${name}: any = {};
      ${fnString}
      ${ReqInterface}
      ${ResInterface}
      export default ${name}`,
      'utf8'
    );
  }
}
