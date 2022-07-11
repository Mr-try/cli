/*
 * @Author: Mr.try
 * @Date: 2022-07-11 17:37:39
 */

interface CloneI {
  name: string;
  template?: string;
  url?: string;
}
export const clone = ({ name, template, url }: CloneI) => {
  if (url) return `git clone ${url}`;
  return `git clone git@git.easyya.com:npm/template_${template}.git ${name}`;
};
