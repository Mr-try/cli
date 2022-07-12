/*
 * @Author: Mr.try
 * @Date: 2022-07-07 10:42:26
 */
import { Command } from 'commander';
import Action from './action.generate';
export default (program: Command) => {
  program
    .command('p')
    .description('创建页面')
    .argument('<文件名称>', '页面名称')
    .action((str, options) => {
      const limit = options.first ? 1 : undefined;
      const [name] = str.split(options.separator, limit);
      const params = name?.split('/');
      Action(params);
    });
};
