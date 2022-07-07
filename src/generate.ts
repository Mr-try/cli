/*
 * @Author: Mr.try
 * @Date: 2022-07-07 10:42:26
 */
import { Command } from 'commander';
export default (program: Command) => {
  program
    .command('g')
    .description('创建文件')
    .argument('<string>', '文件名称')
    .action((str, options) => {
      const limit = options.first ? 1 : undefined;
      console.log(3333, str.split(options.separator, limit));
    });
};
