/*
 * @Author: Mr.try
 * @Description: 初始化项目
 * @Date: 2022-07-07 10:40:24
 */

import { Command } from 'commander';
import Action from './action.project';

export default (program: Command) => {
  program
    .command('init')
    .description('创建项目')
    .action(() => {
      Action();
    });
};
