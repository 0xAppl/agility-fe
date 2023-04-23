import React, { type FC } from 'react';

import styles from './index.module.less';

const FarmSectionWrapper: FC<{
  extraClassName?: string;
  children: React.ReactNode;
}> = ({ children, extraClassName = '' }) => {
  return <div className={`${styles.farm_sec_container} ${extraClassName}`}>{children}</div>;
};

export default FarmSectionWrapper;
