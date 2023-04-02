import React from 'react';
import { useGlobalStatsContext } from '../../../contexts/globalStatsContext';
import style from './index.module.less';

export interface IStatus {
  typeText: string;
  countText: string;
  valueText: string;
}

export const StatusBox = ({ data }: { data: IStatus }) => {
  const { typeText } = data;

  const { TVL, ethPrice, AGIPrice, AGITotalSupply } = useGlobalStatsContext();

  return (
    <div className={style.status_box}>
      <div className={style.type}>{typeText === 'TVL' ? 'TVL' : 'AGI'}</div>
      <div className={style.count}>{typeText === 'TVL' ? `${TVL.toFixed(3)} ETH` : `PRICE $${AGIPrice}`}</div>
      <div className={style.value}>
        {typeText === 'TVL' ? `$${(TVL * ethPrice).toFixed(3)}` : `MC $${(AGIPrice * AGITotalSupply).toFixed(3)}`}
      </div>
    </div>
  );
};
