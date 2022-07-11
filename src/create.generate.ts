/*
 * @Author: Mr.try
 * @Date: 2022-07-07 10:42:26
 */
import { Command } from 'commander';

export default (program: Command) => {
  program
    .command('p')
    .description('创建页面')
    .argument('<文件名称>', '页面名称')
    .action((str, options) => {
      const limit = options.first ? 1 : undefined;
      console.log(3333, str.split(options.separator, limit));
    });
};
