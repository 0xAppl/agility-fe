import React from 'react';
import style from './index.module.less';
const Shimmer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={style.shimmer_container}>
      <div className={style.shimmer}></div>
      {children}
    </div>
  );
};

export default Shimmer;
