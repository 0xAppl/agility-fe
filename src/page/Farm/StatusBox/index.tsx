import { numberToPrecision } from '@utils/number';
import React from 'react';
import { useGlobalStatsContext } from '../../../contexts/globalStatsContext';
import style from './index.module.less';

export interface IStatus {
  typeText: string;
  countText: string;
  valueText: string;
}

export const StatusBox = (data: any) => {
  const { typeText } = data;

  const { TVL, ethPrice, AGIPrice, AGITotalSupply } = useGlobalStatsContext();

  return (
    <div className={style.status_box}>
      <div className={style.type}>{typeText === 'TVL' ? 'TVL' : 'AGI'}</div>
      <div className={style.count}>
        {typeText === 'TVL' ? `$${numberToPrecision(TVL, 3)}` : `PRICE $${numberToPrecision(AGIPrice)}`}
      </div>
      <div
        className={style.value}
        style={{
          display: typeText === 'TVL' ? 'none' : undefined,
        }}
      >
        {typeText === 'TVL'
          ? `$${numberToPrecision(TVL, 0)}`
          : `MarketCap $${numberToPrecision(AGIPrice * AGITotalSupply, 0)}`}
      </div>
    </div>
  );
};
