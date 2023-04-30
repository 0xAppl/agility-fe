import React from 'react';
import styles from './index.module.less';
const Shimmer = ({
  children,
  isLoading,
  style,
}: {
  children: React.ReactNode;
  isLoading: boolean;
  style?: React.CSSProperties;
}) => {
  if (!isLoading) return <>{children}</>;
  return (
    <span className={styles.shimmer_container} style={style}>
      <span className={styles.shimmer}></span>
      <span
        style={{
          opacity: 0,
        }}
      >
        {children}
      </span>
    </span>
  );
};

export default Shimmer;
