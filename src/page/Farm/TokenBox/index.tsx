/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { ethers } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useProvider } from 'wagmi';
import { API } from '../../../Api';
import { ClaimBtn, StakeBtn, WithdrawBtn } from '../../../components/Btns';
import OnChainNumberDisplay from '../../../components/OnChainNumberDisplay';
import Shimmer from '../../../components/Shimmer';
import { getContracts, type IToken } from '../tokenConfigs';
// import { useContractContext } from '../../../contexts/contractContext';
import style from './index.module.less';
import StackingModal from './StackingModal';

export const TokenBox = ({ token }: { token: IToken }) => {
  const { config: prepareClaimConfig, error: prepareClaimError } = usePrepareContractWrite({
    address: token.stakingContract.address,
    abi: token.stakingContract.abi,
    functionName: 'getReward',
  });

  const { write: claimReward, data: claimData, error: claimError } = useContractWrite(prepareClaimConfig);

  const { config: prepareExitConfig, error: prepareExitError } = usePrepareContractWrite({
    address: token.stakingContract.address,
    abi: token.stakingContract.abi,
    functionName: 'exit',
  });

  const { write: exit, data: exitData, error: exitError } = useContractWrite(prepareExitConfig);

  const onWithDrawClick = useCallback(() => {
    console.log('sss');
    exit?.();
  }, [exit]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isConnected, address } = useAccount();

  const onClaimClick = () => {
    claimReward?.();
  };

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
          <div className={style.number}>
            <OnChainNumberDisplay contract={token.stakingContract} valueName={'totalSupply'} watch />
          </div>
        </div>
      </div>

      {/* claim */}
      <div className={style.claim_sec}>
        <div className={style.left}>
          <div className={style.text}> esAGI Earned</div>
          <div className={style.number}>
            <OnChainNumberDisplay contract={token.stakingContract} valueName={'earned'} args={[address]} watch /> $esAGI
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
            <OnChainNumberDisplay contract={token.stakingContract} valueName={'balanceOf'} args={[address]} watch />
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
