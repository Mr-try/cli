/*
 * @Author: Mr.try
 * @Date: 2022-07-11 11:07:22
 */
import child from 'child_process';
import inquirer from 'inquirer';
import confirm from './confirm';

export default () => {
  inquirer
    .prompt(confirm)
    .then((answers) => {
      const { name, template } = answers;
      // 下载模板
      child.exec(
        `git clone git@git.easyya.com:npm/template_${template}.git ${name}`,
        (error) => {
          if (error) {
            console.log('error', error);
          }
        }
      );
    })
    .catch((error) => {
      console.log('error', error);
    });
};
