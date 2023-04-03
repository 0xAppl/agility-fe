/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import useReadContractNumber from '@hooks/useReadContractNumber';
import { BigNumber, ethers } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useProvider,
  useWaitForTransaction,
} from 'wagmi';
import { API } from '../../../Api';
import { ClaimBtn, StakeBtn, WithdrawBtn } from '../../../components/Btns';
import OnChainNumberDisplay from '../../../components/OnChainNumberDisplay';
import Shimmer from '../../../components/Shimmer';
import { useGlobalStatsContext } from '../../../contexts/globalStatsContext';
import { bigNumberToDecimal, numberToPrecision } from '../../../utils/number';
import { capitalize } from '../../../utils/string';
import { getContracts, type IToken } from '../tokenConfigs';
// import { useContractContext } from '../../../contexts/contractContext';
import style from './index.module.less';
import StackingModal from './StakeModal';

export const TokenBox = ({ token }: { token: IToken }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalMode, setModalMode] = useState<'stake' | 'withdraw'>('stake');

  const { isConnected, address } = useAccount();

  const {
    data: stakedBalanceData,
    isError,
    isLoading: loadingStakedBalance,
  } = useContractRead({
    address: token.stakingContract.address,
    abi: token.stakingContract.abi,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
    enabled: isConnected,
  });

  const hasStacked = stakedBalanceData?.toString() !== '0';

  const { ethPrice, AGIPrice } = useGlobalStatsContext();

  const { config: prepareClaimConfig, error: prepareClaimError } = usePrepareContractWrite({
    address: token.stakingContract.address,
    abi: token.stakingContract.abi,
    functionName: 'getReward',
  });

  const { write: claimReward, data: claimData, error: claimError } = useContractWrite(prepareClaimConfig);

  const { isLoading: isLoadingClaim } = useWaitForTransaction({
    hash: claimData?.hash,
    onSuccess(data) {
      toast.success('Claim Success!');
      setIsModalOpen(false);
    },
  });

  const { config: prepareExitConfig, error: prepareExitError } = usePrepareContractWrite({
    address: token.stakingContract.address,
    abi: token.stakingContract.abi,
    functionName: 'exit',
    enabled: !loadingStakedBalance && hasStacked,
  });

  const { write: exit, data: exitData, error: exitError } = useContractWrite(prepareExitConfig);

  const { isLoading: isLoadingExit } = useWaitForTransaction({
    hash: exitData?.hash,
    onSuccess(data) {
      toast.success('Withdraw all Success!');
    },
  });

  const { data: rewardPerTokenStored } = useReadContractNumber(token.stakingContract, 'rewardRate', undefined, true);

  const { data: TVL } = useReadContractNumber(token.stakingContract, 'totalSupply', undefined, true);

  const { data: balanceOf } = useReadContractNumber(token.stakingContract, 'balanceOf', [address], true);

  const APR =
    ((rewardPerTokenStored * 86400 * (balanceOf / (TVL === 0 ? 1 : TVL)) * AGIPrice * 365) /
      (ethPrice * balanceOf || 1)) *
    100;

  const onExit = useCallback(() => {
    if (hasStacked) {
      exit?.();
    }
  }, [exit, hasStacked]);

  const onClaimClick = () => {
    claimReward?.();
  };

  const onWithdrawClick = () => {
    setModalMode('withdraw');
    setIsModalOpen(true);
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
          <div className={style.number}>{numberToPrecision(APR, 2)}%</div>
        </div>
        <div className={style.tvl}>
          <div className={style.text}>TVL</div>
          <div className={style.number}>
            ${numberToPrecision(TVL * ethPrice, 0)}
            {/* <OnChainNumberDisplay
              contract={token.stakingContract}
              valueName={'totalSupply'}
              watch
              transform={value => {
                return `$${numberToPrecision(value * ethPrice, 0)}`;
              }}
            /> */}
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
        <ClaimBtn onClick={onClaimClick} isLoading={isLoadingClaim} />
      </div>

      <div className={style.line}></div>

      {/* stake */}
      <div className={style.stake_sec}>
        <div className={style.left}>
          <div className={style.text}> ETH Staked</div>
          <div className={style.number}>{balanceOf}</div>
        </div>

        <StakeBtn
          onClick={() => {
            if (isConnected) {
              setModalMode('stake');
              setIsModalOpen(true);
            }
          }}
        />
      </div>

      <div className={style.withdraw_btns}>
        <WithdrawBtn onClick={onWithdrawClick}>Withdraw</WithdrawBtn>
        <WithdrawBtn onClick={onExit} isLoading={isLoadingExit}>
          {`${isLoadingExit ? 'Withdrawing' : 'Withdraw'}`} All
        </WithdrawBtn>
      </div>

      <StackingModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        contractAddress={getContracts().ETHPool.address}
        contractABI={getContracts().ETHPool.abi}
        title={capitalize(modalMode)}
        modalMode={modalMode}
      />
    </div>
  );
};
