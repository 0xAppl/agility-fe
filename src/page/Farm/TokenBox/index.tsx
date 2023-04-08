/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import useReadContractNumber from '@hooks/useReadContractNumber';
import { ONE_DAY_IN_SECS } from '@utils/time';
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
import { ClaimBtn, CommonButton, StakeBtn, WithdrawBtn } from '../../../components/Btns';
import OnChainNumberDisplay from '../../../components/OnChainNumberDisplay';
import Shimmer from '../../../components/Shimmer';
import { useGlobalStatsContext } from '../../../contexts/globalStatsContext';
import { BigZero, bigNumberToDecimal, numberToPrecision } from '@utils/number';
import { capitalize } from '@utils/string';
import { getContracts, type IToken } from '../tokenConfigs';
// import { useContractContext } from '../../../contexts/contractContext';
import style from './index.module.less';
import StackingModal from './StakeModal';
import { useLocation } from 'react-router-dom';
import useWriteContract from '@hooks/useWriteContract';
import CustomSpin from '@components/spin';
import { formatEther } from 'ethers/lib/utils.js';
import useReportTVL from '@hooks/useReportTVL';

export const TokenBox = ({ token }: { token: IToken }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [overrideApprovalStatus, setOverrideApprovalStatus] = useState(false);

  const [modalMode, setModalMode] = useState<'stake' | 'withdraw'>('stake');

  const { isConnected, address } = useAccount();

  const { ethPrice, AGIPrice } = useGlobalStatsContext();

  const { data: stakedBalanceData, isLoading: loadingStakedBalance } = useContractRead({
    address: token.stakingContract.address,
    abi: token.stakingContract.abi,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
    enabled: isConnected,
  });

  const hasStacked = stakedBalanceData?.toString() !== '0';

  const { config: prepareExitConfig, error: prepareExitError } = usePrepareContractWrite({
    address: token.stakingContract.address,
    abi: token.stakingContract.abi,
    functionName: 'exit',
    enabled: !loadingStakedBalance && hasStacked,
  });

  const { write: exit, data: exitData, error: exitError } = useContractWrite(prepareExitConfig);

  const { isLoading: isLoadingExit, error } = useWaitForTransaction({
    hash: exitData?.hash,
    onSuccess(data) {
      toast.success('Withdraw all Success!');
    },
    onError(error) {
      console.log(error);
      toast.error('Withdraw all Failed!');
    },
  });

  const isHomepage = useLocation().pathname === '/';

  const commonProps = {
    ...token.stakingContract,
    enabled: !isHomepage,
  };

  const { data: totalSupply } = useReadContractNumber({
    ...commonProps,
    functionName: 'totalSupply',
    watch: true,
  });

  const { data } = useReadContractNumber({
    ...(token.tokenContract ?? {}),
    functionName: 'getReserves',
    watch: true,
    outputBigNumber: true,
    enabled: !!token.tokenContract,
  });

  let AGIReserve = 0;
  let ETHReserve = 0;

  if (Array.isArray(data)) {
    AGIReserve = bigNumberToDecimal(data[0]) as number;
    ETHReserve = bigNumberToDecimal(data[1]) as number;
  }

  const { data: balanceOf } = useReadContractNumber({
    ...commonProps,
    functionName: 'balanceOf',
    args: [address],
  });

  const { data: esAGIEarned } = useReadContractNumber({
    ...commonProps,
    functionName: 'earned',
    args: [address],
    watch: true,
  });

  const TVL = token.tokenContract ? AGIReserve * AGIPrice + ETHReserve * ethPrice : totalSupply * ethPrice;

  const APYAvailable = token.tokenContract
    ? AGIReserve && ETHReserve && ethPrice && AGIPrice
    : AGIPrice && totalSupply && ethPrice;

  const APY = APYAvailable ? ((1 + (token.poolDailyEmission * AGIPrice) / TVL) * 365 - 1) * 100 : '???';

  useReportTVL(TVL, token.name);

  const onExit = useCallback(() => {
    if (hasStacked) {
      exit?.();
    }
  }, [exit, hasStacked]);

  const onClaimClick = () => {
    if (esAGIEarned) claimReward?.();
  };

  const onWithdrawClick = () => {
    setModalMode('withdraw');
    setIsModalOpen(true);
  };

  const { write: claimReward, isLoading: isLoadingClaim } = useWriteContract({
    address: token.stakingContract.address,
    abi: token.stakingContract.abi,
    functionName: 'getReward',
    enabled: esAGIEarned !== 0,
    successMessage: 'Claim Success!',
  });

  const { write: allowSpending, isLoading: isLoadingApproving } = useWriteContract({
    ...(token.tokenContract ?? {}),
    functionName: 'approve',
    successMessage: 'Approve Success!',
    args: [token.stakingContract.address, ethers.constants.MaxUint256],
    enabled: !!token.tokenContract,
    successCallback: () => {
      setOverrideApprovalStatus(true);
    },
  });

  const { data: stakingContractAllowance } = useReadContractNumber({
    ...(token.tokenContract ?? {}),
    functionName: 'allowance',
    args: [address, token.stakingContract.address],
    enabled: !!token.tokenContract,
    watch: true,
  });

  const withdrawBtns = (
    <>
      <WithdrawBtn onClick={onWithdrawClick} disabled={!hasStacked}>
        Withdraw
      </WithdrawBtn>
      <WithdrawBtn onClick={onExit} isLoading={isLoadingExit} disabled={!hasStacked}>
        {`${isLoadingExit ? 'Withdrawing' : 'Withdraw'}`} All
      </WithdrawBtn>
    </>
  );

  const stakeBtns = (
    <StakeBtn
      onClick={() => {
        if (isConnected) {
          setModalMode('stake');
          setIsModalOpen(true);
        }
      }}
    />
  );

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
          <div className={style.text}>APY</div>
          <div className={style.number}>
            {typeof APY === 'string' ? APY : APY > 99999 ? '99999+' : numberToPrecision(APY, 2)}%
          </div>
        </div>
        <div className={style.tvl}>
          <div className={style.text}>TVL</div>
          <div className={style.number}>${numberToPrecision(TVL, 0)}</div>
        </div>
      </div>

      {/* claim */}
      <div className={style.claim_sec}>
        <div className={style.left}>
          <div className={style.text}> esAGI Earned</div>
          <div className={style.number}>{numberToPrecision(esAGIEarned, 6)} $esAGI</div>
        </div>
        <ClaimBtn onClick={onClaimClick} isLoading={isLoadingClaim} disabled={!esAGIEarned} />
      </div>

      <div className={style.line}></div>

      {/* stake */}
      <div className={style.stake_sec}>
        <div className={style.left}>
          <div className={style.text}> {token.name} Staked</div>
          <div className={style.number}>{numberToPrecision(balanceOf, 6)}</div>
        </div>
        {token.tokenContract ? (
          overrideApprovalStatus || stakingContractAllowance ? (
            stakeBtns
          ) : (
            <CommonButton onClick={allowSpending}>
              {isLoadingApproving ? (
                <CustomSpin
                  style={{
                    marginInlineEnd: '4px',
                  }}
                ></CustomSpin>
              ) : null}
              {isLoadingApproving ? 'Approving' : 'Approve'}
            </CommonButton>
          )
        ) : (
          stakeBtns
        )}
      </div>

      <div className={style.withdraw_btns}>{withdrawBtns}</div>

      <StackingModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        poolContract={token.stakingContract}
        stakingTokenContract={token.tokenContract}
        title={capitalize(modalMode)}
        modalMode={modalMode}
      />
    </div>
  );
};
