import React from 'react';
import style from './index.module.less';

export interface IStatus {
  typeText: string;
  countText: string;
  valueText: string;
}

export const StatusBox = ({ data }: { data: IStatus }) => {
  const { typeText, countText, valueText } = data;
  return (
    <div className={style.status_box}>
      <div className={style.type}> {typeText}</div>
      <div className={style.count}>{countText}</div>
      <div className={style.value}>{valueText}</div>
    </div>
  );
};
