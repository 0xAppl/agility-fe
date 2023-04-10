import React from 'react';
import style from './index.module.less';

const DoubleTokenLogo: React.FC<{
  a0: string;
  a1: string;
  size?: number;
  a0Style?: React.CSSProperties;
  a1Style?: React.CSSProperties;
}> = ({ a0, a1, size, a0Style, a1Style }) => {
  return (
    <div className={style.triple_token_logo}>
      <img src={a0} alt="" style={a0Style} />
      <img src={a1} alt="" style={a1Style} />
    </div>
  );
};

export default DoubleTokenLogo;
