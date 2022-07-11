/*
 * @Author: Mr.try
 * @Date: 2022-07-06 16:46:01
 */
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

export default questions;
