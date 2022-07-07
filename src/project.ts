/*
 * @Author: Mr.try
 * @Date: 2022-07-07 10:40:24
 */
import { Command } from 'commander';
export default (program: Command) => {
  program
    .command('init')
    .description('创建项目')
    .argument('<string>', '项目名称')
    .action((str, options) => {
      const limit = options.first ? 1 : undefined;
      console.log('项目名称', str.split(options.separator, limit));
    });
};
