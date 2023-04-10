/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from 'react';
import useReadContractNumber from '@hooks/useReadContractNumber';
import { type BigNumber, ethers } from 'ethers';
import { toast } from 'react-toastify';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { ClaimBtn, CommonButton, StakeBtn, WithdrawBtn } from '../../../components/Btns';
import { useGlobalStatsContext } from '../../../contexts/globalStatsContext';
import { bigNumberToDecimal, numberToPrecision } from '@utils/number';
import { capitalize } from '@utils/string';
import { type IToken } from '../tokenConfigs';
// import { useContractContext } from '../../../contexts/contractContext';
import style from './index.module.less';
import StackingModal from './StakeModal';
import { useLocation } from 'react-router-dom';
import useWriteContract from '@hooks/useWriteContract';
import CustomSpin from '@components/spin';
import useReportTVL from '@hooks/useReportTVL';
import { Tooltip } from 'antd';
import DoubleTokenLogo from '@components/TripleTokenLogo';

export const TokenBox = ({ token }: { token: IToken }) => {
  const { disabled } = token;
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

  const commonStakingContractProps = {
    ...token.stakingContract,
    enabled: !isHomepage && !disabled,
  };

  const { data: totalStakedETH } = useReadContractNumber({
    ...commonStakingContractProps,
    functionName: 'totalSupply',
    watch: true,
    enabled: isConnected && commonStakingContractProps.enabled,
  });

  const { data: LPReserves } = useReadContractNumber<[BigNumber, BigNumber]>({
    ...(token.tokenContract ?? {}),
    functionName: 'getReserves',
    watch: true,
    outputBigNumber: true,
    enabled: !!token.tokenContract && isConnected,
  });

  const { data: LPTotalSupply } = useReadContractNumber({
    ...(token.tokenContract ?? {}),
    functionName: 'totalSupply',
    watch: true,
    enabled: !!token.tokenContract && isConnected,
  });

  const { data: LPStakedBalance } = useReadContractNumber({
    ...commonStakingContractProps,
    functionName: 'totalSupply',
    watch: true,
  });

  let AGIReserve = 0;
  let ETHReserve = 0;

  if (Array.isArray(LPReserves)) {
    AGIReserve = bigNumberToDecimal(LPReserves[0]) as number;
    ETHReserve = bigNumberToDecimal(LPReserves[1]) as number;
  }

  const { data: balanceOf } = useReadContractNumber({
    ...commonStakingContractProps,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
  });

  const { data: esAGIEarned } = useReadContractNumber({
    ...commonStakingContractProps,
    functionName: 'earned',
    args: [address],
    watch: true,
  });

  const TVL = token.tokenContract
    ? (AGIReserve * AGIPrice + ETHReserve * ethPrice) * (LPStakedBalance / LPTotalSupply)
    : totalStakedETH * ethPrice;

  const APYAvailable = token.tokenContract
    ? AGIReserve && ETHReserve && ethPrice && AGIPrice && LPStakedBalance && LPTotalSupply
    : AGIPrice && totalStakedETH && ethPrice;

  const APR = APYAvailable ? ((1 + (token.poolDailyEmission * AGIPrice) / TVL) * 365 - 1) * 100 : '???';

  useReportTVL(disabled ? 0 : TVL, token.name);

  const onExit = () => {
    if (disabled) return;
    if (hasStacked) {
      exit?.();
    }
  };

  const onClaimClick = () => {
    if (disabled) return;
    if (esAGIEarned) claimReward?.();
  };

  const onWithdrawClick = () => {
    if (disabled) return;
    setModalMode('withdraw');
    setIsModalOpen(true);
  };

  const { write: claimReward, isLoading: isLoadingClaim } = useWriteContract({
    address: token.stakingContract.address,
    abi: token.stakingContract.abi,
    functionName: 'getReward',
    enabled: esAGIEarned !== 0 && !disabled,
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
      <WithdrawBtn onClick={onWithdrawClick} disabled={!hasStacked || disabled}>
        Withdraw
      </WithdrawBtn>
      <Tooltip title={`Withdraw all your staked ${token.name} + esAGI rewards`} placement="bottom">
        <div
          style={{
            width: '100%',
          }}
        >
          <WithdrawBtn onClick={onExit} isLoading={isLoadingExit} disabled={!hasStacked || disabled}>
            {`${isLoadingExit ? 'Withdrawing' : 'Withdraw'}`} All
          </WithdrawBtn>
        </div>
      </Tooltip>
    </>
  );

  const stakeBtns = (
    <StakeBtn
      disabled={disabled}
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
        <span
          className={style.icon}
          style={{
            marginRight: Array.isArray(token.icon) ? 10 : undefined,
          }}
        >
          {token.icon ? (
            Array.isArray(token.icon) ? (
              <DoubleTokenLogo
                a0={token.icon[0]}
                a1={token.icon[1]}
                a0Style={{
                  marginRight: -18,
                  width: 28,
                  height: 28,
                  marginTop: 2,
                }}
              ></DoubleTokenLogo>
            ) : (
              <img src={token.icon} alt="" />
            )
          ) : (
            <span>?</span>
          )}
        </span>
        <span className={style.name}>{token.name}</span>
      </div>

      {/* main */}
      <div className={style.main_sec}>
        <div className={style.apr}>
          <div className={style.text}>APR</div>
          <div className={style.number}>
            {disabled ? '???' : typeof APR === 'string' ? APR : APR > 99999 ? '99999+' : numberToPrecision(APR, 2)}%
          </div>
        </div>
        <div className={style.tvl}>
          <div className={style.text}>TVL</div>
          <div className={style.number}>${disabled ?? isNaN(TVL) ? '???' : numberToPrecision(TVL, 0)}</div>
        </div>
      </div>

      {/* claim */}
      <div className={style.claim_sec}>
        <div className={style.left}>
          <div className={style.text}> esAGI Earned</div>
          <div className={style.number}>{disabled ? 0 : numberToPrecision(esAGIEarned, 6)} $esAGI</div>
        </div>
        {esAGIEarned && !disabled ? (
          <ClaimBtn onClick={onClaimClick} isLoading={isLoadingClaim} disabled={!esAGIEarned || disabled} />
        ) : null}
      </div>

      <div className={style.line}></div>

      {/* stake */}
      <div className={style.stake_sec}>
        <div className={style.left}>
          <div className={style.text}> {token.name} Staked</div>
          <div className={style.number}>{disabled ? '0' : numberToPrecision(balanceOf, 6)}</div>
        </div>
        {token.tokenContract ? (
          (overrideApprovalStatus || stakingContractAllowance) && !disabled ? (
            stakeBtns
          ) : (
            <CommonButton onClick={allowSpending} disabled={disabled}>
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
