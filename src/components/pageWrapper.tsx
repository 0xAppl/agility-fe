import React from 'react';
import styles from './index.module.less';

const PageWrapper: React.FC<any> = ({ children }) => {
  return <div className={styles.farm_section}>{children}</div>;
};

export default PageWrapper;
