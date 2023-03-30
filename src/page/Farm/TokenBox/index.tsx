import React, { useCallback } from 'react';
import { API } from '../../../Api';
import { ClaimBtn, StakeBtn, WithdrawBtn } from '../../../components/Btns';
import style from './index.module.less';

export interface IToken {
  icon: string;
  name: string;
  apr: string;
  esAGIEarned: string;
  ethStaked: string;
}

export const TokenBox = ({ token }: { token: IToken }) => {
  const onStakeClick = useCallback(() => {
    API.stake();
  }, []);
  const onClaimClick = useCallback(() => {
    API.claim();
  }, []);
  const onWithDrawClick = useCallback(() => {
    API.withdraw();
  }, []);

  return (
    <div className={style.token_box}>
      {/* token info */}
      <div className={style.token_info}>
        <span className={style.icon}>icon</span>
        <span className={style.name}>title</span>
      </div>

      {/* main */}
      <div className={style.main_sec}>
        <div className={style.apr}>
          <div className={style.text}>APR</div>
          <div className={style.number}>99%</div>
        </div>
        <div className={style.tvl}>
          <div className={style.text}>TVL</div>
          <div className={style.number}> 9134134</div>
        </div>
      </div>

      {/* claim */}
      <div className={style.claim_sec}>
        <div className={style.left}>
          <div className={style.text}> esAGI Earned</div>
          <div className={style.number}>0.000 $esAGI</div>
        </div>
        <ClaimBtn onClick={onClaimClick} />
      </div>

      <div className={style.line}></div>

      {/* stake */}
      <div className={style.stake_sec}>
        <div className={style.left}>
          <div className={style.text}> ETH Staked</div>
          <div className={style.number}>500</div>
        </div>

        <StakeBtn onClick={onStakeClick} />
      </div>

      <WithdrawBtn onClick={onWithDrawClick} />
    </div>
  );
};
