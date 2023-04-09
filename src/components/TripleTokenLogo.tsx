import React from 'react';
import style from './index.module.less';

const DoubleTokenLogo: React.FC<{
  a0: string;
  a1: string;
  size?: number;
}> = ({ a0, a1, size }) => {
  return (
    <div className={style.triple_token_logo}>
      <img src={a0} alt="" />
      <img src={a1} alt="" />
    </div>
  );
};

export default DoubleTokenLogo;
