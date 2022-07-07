/*
 * @Author: Mr.try
 * @Date: 2022-07-06 16:46:01
 */
const questions = [
  {
    type: 'list',
    name: 'template',
    message: '请选择模板',
    choices: ['PC', 'WEAPP', 'H5'],
  },
  {
    type: 'list',
    name: 'api',
    message: '是否使用API',
    choices: ['是', '否'],
  },
];

export default questions;
