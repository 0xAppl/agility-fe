/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import classNames from 'classnames';
import React from 'react';

import style from './index.module.less';

const Hamburger = ({ activated, setActivated }: any) => {
  return (
    <div
      className={classNames({
        [style.hamburger]: true,
        [style.activated]: activated,
      })}
      onClick={() => setActivated(!activated)}
    >
      <div className={style.line}></div>
      <div className={style.line}></div>
      <div className={style.line}></div>
    </div>
  );
};

export default Hamburger;
