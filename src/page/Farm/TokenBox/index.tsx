/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { ethers } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react';
import { useAccount, useContractRead, useProvider } from 'wagmi';
import { API } from '../../../Api';
import { ClaimBtn, StakeBtn, WithdrawBtn } from '../../../components/Btns';
import OnChainNumberDisplay from '../../../components/OnChainNumberDisplay';
import Shimmer from '../../../components/Shimmer';
import { getContracts } from '../tokenConfigs';
// import { useContractContext } from '../../../contexts/contractContext';
import style from './index.module.less';
import StackingModal from './StackingModal';

export interface IToken {
  icon: string;
  name: string;
  apr: string;
  esAGIEarned: string;
  ethStaked: string;
}

export const TokenBox = ({ token }: { token: IToken }) => {
  // const onStakeClick = useCallback(() => {
  //   API.stake();
  // }, []);
  const onClaimClick = useCallback(() => {
    API.claim();
  }, []);
  const onWithDrawClick = useCallback(() => {
    API.withdraw();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // const { contracts } = useContractContext();

  const { isConnected } = useAccount();

  return (
    <div className={style.token_box}>
      {/* token info */}
      <div className={style.token_info}>
        <span className={style.icon}>
          <img src={token.icon} alt="" />
        </span>
        <span className={style.name}>{token.name}</span>
      </div>

      {/* main */}
      <div className={style.main_sec}>
        <div className={style.apr}>
          <div className={style.text}>APR</div>
          <div className={style.number}>???%</div>
        </div>
        <div className={style.tvl}>
          <div className={style.text}>TVL</div>
          <div className={style.number}> ???</div>
        </div>
      </div>

      {/* claim */}
      <div className={style.claim_sec}>
        <div className={style.left}>
          <div className={style.text}> esAGI Earned</div>
          <div className={style.number}>
            <OnChainNumberDisplay contractAddress={getContracts().ETHPool.address} functionName={'earned'} /> $esAGI
          </div>
        </div>
        <ClaimBtn onClick={onClaimClick} />
      </div>

      <div className={style.line}></div>

      {/* stake */}
      <div className={style.stake_sec}>
        <div className={style.left}>
          <div className={style.text}> ETH Staked</div>
          <div className={style.number}>
            <OnChainNumberDisplay contractAddress={getContracts().ETHPool.address} functionName={'balanceOf'} />
          </div>
        </div>

        <StakeBtn
          onClick={() => {
            if (isConnected) {
              setIsModalOpen(true);
            }
          }}
        />
      </div>

      <WithdrawBtn onClick={onWithDrawClick} />
      <StackingModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onOK={(stakeAmount: number) => {
          // const numberToGwei = ethers.utils.parseUnits((0.1).toString(), 'gwei');
          // contracts.ETHContract.stake(numberToGwei);
        }}
        contractAddress={getContracts().ETHPool.address}
        contractABI={getContracts().ETHPool.abi}
      />
    </div>
  );
};
