export default () => {
  return `import styles from './index.module.less'
export default () => {
  return <div className={styles.wrap}></div>
}`;
};

export const Less = () => `.wrap {}`;
