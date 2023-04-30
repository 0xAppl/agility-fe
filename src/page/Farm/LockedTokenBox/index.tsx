import React, { useEffect, useState } from 'react';

/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { BigNumber, ethers } from 'ethers';
import { useAccount, useContractRead, useContractReads } from 'wagmi';
import { ClaimBtn, CommonButton, StakeBtn, WithdrawBtn } from '../../../components/Btns';
import { useGlobalStatsContext } from '../../../contexts/globalStatsContext';
import { BigZero, bigNumberToDecimal } from '@utils/number';
import { type LockedFarmingConfig } from '../tokenConfigs';

import style from '../index.module.less';
import { useLocation } from 'react-router-dom';
import useWriteContract from '@hooks/useWriteContract';
import CustomSpin from '@components/spin';
import useReportTVL from '@hooks/useReportTVL';
import DoubleTokenLogo from '@components/TripleTokenLogo';
import useDebounce from '@hooks/useDebounce';
import { Slider } from 'antd';
import { parseEther } from 'ethers/lib/utils.js';
import Shimmer from '@components/Shimmer';
import StackingModal from '@components/Modals/StakeModal';
import { capitalize } from '@utils/string';
import WithdrawLockedModal from './WithdrawLockedModal';

export const LockedTokenBox = ({ token }: { token: LockedFarmingConfig }) => {
  const isHomepage = useLocation().pathname === '/';

  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const [lockTime, setLockTime] = useState(BigZero);

  const debouncedLockTime = useDebounce(lockTime);

  const [overrideApprovalStatus, setOverrideApprovalStatus] = useState(false);

  const { isConnected, address } = useAccount();

  const { AGIPrice } = useGlobalStatsContext();

  const { data: publicData, isLoading: isLoadingPublic } = useContractReads<
    any,
    any,
    any,
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
  >({
    contracts: [
      {
        ...token.tokenContract,
        functionName: 'totalSupply',
      },
      {
        ...token.stakingContract,
        functionName: 'totalLiquidityLocked',
      },

      {
        ...token.stakingContract,
        functionName: 'lock_time_min',
      },
      {
        ...token.stakingContract,
        functionName: 'lock_time_for_max_multiplier',
      },
    ],

    watch: true,
  });

  const {
    data: lockMultiplier,
    isRefetching: isRefetchingLockMultiplier,
    isLoading: isLoadingLockMultiplier,
  } = useContractRead<any, any, BigNumber>({
    ...token.stakingContract,
    functionName: 'lockMultiplier',
    args: [debouncedLockTime],
  });

  const tokenTotalSupply: BigNumber = publicData?.[0] ?? BigZero;

  const contractTotalStacked: BigNumber = publicData?.[1] ?? BigZero;

  const lockTimeMin: BigNumber = publicData?.[2] ?? BigZero;

  const lockTimeMax: BigNumber = publicData?.[3] ?? BigZero;

  const currentLockMultiplier: BigNumber = lockMultiplier ?? BigZero;

  useEffect(() => {
    if (!lockTimeMin.isZero()) {
      //   console.log(lockTimeMin.toString());
      setLockTime(lockTimeMin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockTimeMin.toString()]);

  const {
    data: accountData,
    isLoading: isLoadingAccountData,
    isFetching: isFetchingAccountData,
    isRefetching: isRefetchingAccountData,
  } = useContractReads<
    any,
    any,
    any,
    [BigNumber, BigNumber, BigNumber, Array<[string, BigNumber, BigNumber, BigNumber, BigNumber]>, BigNumber[]]
  >({
    contracts: [
      {
        ...token.tokenContract,
        functionName: 'allowance',
        args: [address, token.stakingContract.address],
      },
      {
        ...token.tokenContract,
        functionName: 'balanceOf',
        args: [address],
      },
      {
        ...token.stakingContract,
        functionName: 'lockedLiquidityOf',
        args: [address],
      },
      {
        ...token.stakingContract,
        functionName: 'lockedStakesOf',
        args: [address],
      },
      {
        ...token.stakingContract,
        functionName: 'earned',
        args: [address],
      },
    ],
    enabled: isConnected && !isHomepage,
    watch: true,
  });

  const accountAllowance: BigNumber = accountData?.[0] ?? BigZero;

  const accountTokenBalance: BigNumber = accountData?.[1] ?? BigZero;

  const accountTotalStaked: BigNumber = accountData?.[2] ?? BigZero;

  const accountStakesDetailed: Array<[string, BigNumber, BigNumber, BigNumber, BigNumber]> = accountData?.[3] ?? [];

  const accountEarned: BigNumber[] = accountData?.[4] ?? [BigZero];

  const accountTotalEarned = accountEarned.reduce((acc, cur) => acc.add(cur), BigZero);

  const accountCanStake = accountAllowance.gt(accountTokenBalance);

  useReportTVL(0, token.name);

  const { write: allowSpending, isLoading: isLoadingApproving } = useWriteContract({
    ...token.tokenContract,
    functionName: 'approve',
    successMessage: 'Approve Success!',
    args: [token.stakingContract.address, ethers.constants.MaxUint256],
    enabled: !accountCanStake,
    successCallback: () => {
      setOverrideApprovalStatus(true);
    },
  });

  const { write: claim, isLoading: isLoadingClaiming } = useWriteContract({
    ...token.stakingContract,
    functionName: 'getReward',
    enabled: isConnected && !isHomepage && accountTotalEarned.gt(BigZero),
  });

  const LPPrice = BigNumber.from(3);

  const TVL = contractTotalStacked.mul(LPPrice);

  const APR = ((AGIPrice * token.poolDailyEmission) / bigNumberToDecimal(TVL)) * 365;

  return (
    <div className={style.token_box}>
      {/* token info */}
      <div className={style.token_info}>
        <span
          className={style.icon}
          style={{
            marginRight: Array.isArray(token.icon) ? 10 : undefined,
            overflow: Array.isArray(token.icon) ? 'visible' : 'hidden',
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
        <span className={style.name}>
          <span>
            {token.name}
            {' Boost 🔥 🔥 🔥'}
          </span>
        </span>
      </div>

      {/* main */}
      <div className={style.main_sec}>
        <div className={style.apr}>
          <div className={style.text}>BASE APR 1X</div>
          <div className={style.number}>{(APR * 100).toFixed(0)}%</div>
        </div>
        <div className={style.tvl}>
          <div className={style.text}>TVL</div>
          <div className={style.number}>${bigNumberToDecimal(LPPrice.mul(contractTotalStacked))}</div>
        </div>
      </div>
      {/* stake */}
      <div className={style.stake_sec}>
        <div className={style.left}>
          <div className={style.text}> {token.name} Staked</div>
          <div className={style.number}>
            {bigNumberToDecimal(accountTotalStaked, 6)}
            {/* {!disabled && (
              <>
                {LPValue * bigNumberToDecimal(accountStakedBalance) > 0
                  ? ` ($${numberToPrecision(LPValue * bigNumberToDecimal(accountStakedBalance), 0)})`
                  : ''}
              </>
            )} */}
          </div>
        </div>
      </div>

      <div className={style.line}></div>

      {/* claim */}
      <div className={style.claim_sec}>
        <div className={style.left}>
          <div className={style.text}> esAGI Earned</div>
          <div className={style.number}>{bigNumberToDecimal(accountTotalEarned, 6)} $esAGI</div>
        </div>
        {!accountTotalEarned.isZero() ? (
          <ClaimBtn
            disabled={accountTotalEarned.isZero() || isLoadingClaiming}
            onClick={() => {
              claim?.();
            }}
            isLoading={isLoadingClaiming}
          />
        ) : null}
      </div>

      <div
        className={style.multiplier_slider}
        style={{
          marginBottom: 12,
        }}
      >
        <p>
          Multiplier:{' '}
          <Shimmer
            isLoading={isLoadingLockMultiplier || isRefetchingLockMultiplier}
            style={{
              minWidth: '2em',
            }}
          >
            {bigNumberToDecimal(currentLockMultiplier, 2)}
          </Shimmer>
          X
        </p>
        <p
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Slider
            value={Number(lockTime.toString())}
            min={Number(lockTimeMin.toString())}
            max={Number(lockTimeMax.toString())}
            onChange={value => {
              setLockTime(BigNumber.from(Math.min(value, Number(lockTimeMax.toString()))));
            }}
            step={1}
            style={{
              flex: 1,
            }}
          />
          <span
            style={{
              fontSize: '0.8em',
            }}
          >
            DURATION:{debouncedLockTime.toString()} DAYS
          </span>
        </p>
        {overrideApprovalStatus || accountCanStake ? (
          <StakeBtn
            onClick={() => {
              setIsStakeModalOpen(true);
            }}
          />
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
        )}
      </div>
      <WithdrawBtn
        onClick={() => {
          setIsWithdrawModalOpen(true);
        }}
        disabled={
          !accountStakesDetailed.length ||
          accountStakesDetailed.every(record => {
            return record[2].isZero();
          })
        }
      >
        Withdraw
      </WithdrawBtn>

      <StackingModal
        isModalOpen={isStakeModalOpen}
        setIsModalOpen={setIsStakeModalOpen}
        poolContract={token.stakingContract}
        stakingTokenContract={token.tokenContract}
        title={'Lock AGI/WETH LP tokens'}
        modalMode={'stake'}
        extraParams={[debouncedLockTime]}
        stakeFuncName={'stakeLocked'}
        multiplier={currentLockMultiplier}
      />
      <WithdrawLockedModal
        isOpen={isWithdrawModalOpen}
        onClose={() => {
          setIsWithdrawModalOpen(false);
        }}
        withdrawDetails={accountStakesDetailed}
        contract={token.stakingContract}
      />
    </div>
  );
};
