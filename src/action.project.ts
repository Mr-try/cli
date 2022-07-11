/*
 * @Author: Mr.try
 * @Date: 2022-07-11 11:07:22
 */
import child from 'child_process';
import inquirer from 'inquirer';
import { clone } from './git.tool';

const questions = [
  {
    type: 'input',
    name: 'name',
    message: '请输入项目名称',
    default: 'easyya_pc',
  },
  {
    type: 'list',
    name: 'template',
    message: '请选择模板',
    choices: ['pc', 'weapp', 'h5'],
  },
  {
    type: 'list',
    name: 'api',
    message: '是否使用API',
    choices: ['是', '否'],
  },
];

export default () => {
  inquirer
    .prompt(questions)
    .then((answers) => {
      const { name, template, api } = answers;
      // 下载模板
      child.execSync(clone({ template, name }));
      if (api === '是') {
        child.execSync(`node ./src/utils/api.js`);
      }
    })
    .catch((error) => {
      console.log('error', error);
    });
};
