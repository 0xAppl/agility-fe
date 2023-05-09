/* eslint-disable no-unreachable */
import React from 'react';
import FarmSectionWrapper from '@components/farmSectionWrapper';
import style from './index.module.less';
import { ClaimBtn } from '@components/Btns';
import classNames from 'classnames';
import { Tooltip } from 'antd';
import useCountDown from '@hooks/useCountdown';
import { secondsToDHMS } from '@utils/time';
import { useAccount, useConnect, useContractRead } from 'wagmi';
import useWriteContract from '@hooks/useWriteContract';
import { MerkleDistributorAbi, MerkleDistributorAddress } from './merkleDistributorAbi';
import eligables from './eligiables.json';
import { formatEther } from 'ethers/lib/utils.js';
import { BigZero } from '@utils/number';
import { BigNumber } from 'ethers';

const CountDown = () => {
  // const countdown = useCountDown(new Date().getTime());

  const { days, hours, minutes, seconds } = secondsToDHMS(0);

  return (
    <h4>
      <span>
        Rewards Period Ends {days}d: {hours}h: {minutes}m: {seconds}s
      </span>
      &nbsp;
      <span>esAGI Potential Hold APR: 60%</span>
    </h4>
  );
};

const Airdrop = () => {
  const { address, isConnected } = useAccount();

  const claimConfig = Object.entries(eligables.claims).find(([key, value]) => {
    return key === address;
  })?.[1];

  const { data: isClaimed } = useContractRead<typeof MerkleDistributorAbi, 'isClaimed'>({
    address: MerkleDistributorAddress,
    abi: MerkleDistributorAbi,
    functionName: 'isClaimed',
    args: [claimConfig != null ? BigNumber.from(claimConfig.index) : BigZero],
    enabled: claimConfig != null && isConnected,
  });

  const canClaim = typeof isClaimed === 'boolean' && !isClaimed && claimConfig != null && isConnected;

  const { write, isLoading } = useWriteContract({
    address: MerkleDistributorAddress,
    abi: MerkleDistributorAbi as any,
    functionName: 'claim',
    args:
      claimConfig != null ? [claimConfig.index, address, BigInt(claimConfig.amount).toString(), claimConfig.proof] : [],
    enabled: canClaim,
  });

  console.log('claimConfig', claimConfig);

  return (
    <FarmSectionWrapper extraClassName={style.bg_white}>
      <div className="title">Triceratops Rewards</div>
      <FarmSectionWrapper extraClassName={classNames(style.bg_purple, style.convert_inner)}>
        <CountDown />
      </FarmSectionWrapper>
      <FarmSectionWrapper extraClassName={classNames(style.rewards_item_wrapper, style.bg_yellow)}>
        <FarmSectionWrapper extraClassName={style.rewards_item}>
          <span>#</span>
          <span>Rewards</span>
          <span>Rewards Amount</span>
          <span>Eligible Asset</span>
          <span>My Rewards</span>
          <span></span>
        </FarmSectionWrapper>
        <Tooltip title={'Rewards for esAGI Holders'} placement="bottom">
          <div>
            <FarmSectionWrapper extraClassName={classNames(style.rewards_item, style.bg_white)}>
              <span>1</span>
              <span>esAGI</span>
              <span>150,000</span>
              <span>esAGI</span>
              <span>???</span>
              <span>
                <ClaimBtn disabled>Claim</ClaimBtn>
              </span>
            </FarmSectionWrapper>
          </div>
        </Tooltip>

        <Tooltip title={'Rewards for Staking rETH(StaFi) on Farming'} placement="bottom">
          <div>
            <FarmSectionWrapper extraClassName={classNames(style.rewards_item, style.bg_white)}>
              <span>2</span>
              <span>FIS</span>
              <span>5,500</span>
              <span>rETH-StaFi</span>
              <span>{claimConfig != null ? Number(formatEther(claimConfig.amount)).toFixed(4) : '???'}</span>
              <span>
                <ClaimBtn
                  disabled={!canClaim || isLoading}
                  onClick={() => {
                    if (canClaim) {
                      write?.();
                    }
                  }}
                >
                  {typeof isClaimed === 'boolean' && isClaimed ? 'Claimed' : isLoading ? 'Claiming...' : 'Claim'}
                </ClaimBtn>
              </span>
            </FarmSectionWrapper>
          </div>
        </Tooltip>
      </FarmSectionWrapper>
    </FarmSectionWrapper>
  );
};

export default Airdrop;
