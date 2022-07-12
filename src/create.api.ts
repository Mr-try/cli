/*
 * @Author: Mr.try
 * @Date: 2022-07-11 17:59:39
 */
/*
 * @Author: Mr.try
 * @Date: 2022-07-07 10:42:26
 */
import { Command } from 'commander';
import CreateApi from './utils/api';

export default (program: Command) => {
  program
    .command('api')
    .description('拉取最新api代码')
    .action(() => {
      new CreateApi().init();
    });
};
