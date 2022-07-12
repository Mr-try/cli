export default () => {
  return `import styles from './index.less'
export default () => {
  return <div className={styles.wrap}></div>
}`;
};

export const Less = () => `.wrap {}`;
