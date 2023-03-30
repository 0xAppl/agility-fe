import React, { useCallback } from 'react';
import cs from 'classnames';
import { ClaimBtn, WithdrawAGIBtn } from '../../../components/Btns';
import { API } from '../../../Api';
import style from './index.module.less';

interface IVest {
  typeText: string;
  countText: string;
}

export interface VestData {
  balance: IVest;
  vestingDays: IVest;
  AGIList: IVest[];
}

export const VestBox = ({ data }: { data: VestData }) => {
  const { balance, AGIList, vestingDays } = data;

  const onWithDrawClick = useCallback(() => {
    API.withdraw();
  }, []);
  const onClaimClick = useCallback(() => {
    API.claim();
  }, []);

  return (
    <>
      {/* balance  */}
      <div className={cs(style.vest_box, style.small)}>
        <div className={style.vest_inner_box}>
          <div>
            <div className={style.type}> {balance.typeText}</div>
            <div className={style.count}>{balance.countText}</div>
          </div>
          <div>
            <div className={style.type}> {vestingDays.typeText}</div>
            <div className={style.count}>{vestingDays.countText}</div>
          </div>
        </div>
        <ClaimBtn onClick={onClaimClick} />
      </div>

      {/* input output */}
      <div className={cs(style.vest_box, style.big)}>
        {AGIList.map(vest => (
          <div className={style.vest_inner_box} key={vest.typeText}>
            <div className={style.type}> {vest.typeText}</div>
            <div className={style.count}>{vest.countText}</div>
          </div>
        ))}
        <div>
          <WithdrawAGIBtn onClick={onWithDrawClick} />
        </div>
      </div>
    </>
  );
};
