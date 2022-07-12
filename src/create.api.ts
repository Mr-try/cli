/*
 * @Author: Mr.try
 * @Date: 2022-07-11 17:59:39
 */
import { Command } from 'commander';
import Action from './action.api';
export default (program: Command) => {
  program
    .command('api')
    .description('拉取最新api代码')
    .action(() => {
      Action();
    });
};
