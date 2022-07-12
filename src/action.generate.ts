/*
 * @Author: Mr.try
 * @Date: 2022-07-12 14:42:24
 */
import fs from 'fs';
import utils from './utils/api.utils';
import HookTmp, { Less } from './template/hooks';

export default (params: any) => {
  const fileName = params.pop();

  const finalPath = ['pages', ...params];
  let crt = 'src';
  utils.mkdir('src/');
  finalPath.forEach((path: string) => {
    crt += `/${path}`;
    utils.mkdir(crt);
  });

  fs.writeFileSync(`${crt}/${fileName}.tsx`, HookTmp(), 'utf8');
  fs.writeFileSync(`${crt}/${fileName}.less`, Less(), 'utf8');
};
