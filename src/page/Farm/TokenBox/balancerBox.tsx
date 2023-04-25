/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from 'react';
import { type BigNumber, ethers } from 'ethers';
import { type Address, useAccount, useContractReads } from 'wagmi';
import { ClaimBtn, CommonButton, StakeBtn, WithdrawBtn } from '../../../components/Btns';
import { useGlobalStatsContext } from '../../../contexts/globalStatsContext';
import { BigZero, bigNumberToDecimal, commas, numberToPrecision } from '@utils/number';
import { capitalize } from '@utils/string';
import { getContracts, type IToken } from '../tokenConfigs';

import style from './index.module.less';
import StackingModal from '../../../components/Modals/StakeModal';
import { useLocation } from 'react-router-dom';
import useWriteContract from '@hooks/useWriteContract';
import CustomSpin from '@components/spin';
import useReportTVL from '@hooks/useReportTVL';
import { Tooltip } from 'antd';
import DoubleTokenLogo from '@components/TripleTokenLogo';
import { InfoIcon } from '../../../icons';

export const BalancerBox = ({ token }: { token: IToken }) => {
  const { disabled } = token;
  const isHomepage = useLocation().pathname === '/';

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [overrideApprovalStatus, setOverrideApprovalStatus] = useState(false);

  const [modalMode, setModalMode] = useState<'stake' | 'withdraw'>('stake');

  const { isConnected, address } = useAccount();

  const { ethPrice, AGIPrice, ankrETH, rETH, fraxETH, stETH } = useGlobalStatsContext();

  const otherPrices: Record<string, any> = {
    ankrETH,
    rETH,
    fraxETH,
    stETH,
    AGI: { price: AGIPrice },
  };

  const { data: publicData, isLoading: isLoadingPublic } = useContractReads<
    any,
    any,
    any,
    [BigNumber, BigNumber, [[Address, Address], [BigNumber, BigNumber], BigNumber]]
  >({
    contracts: [
      /**
       * staked balance
       */
      {
        ...token.stakingContract,
        functionName: token.stakeSettings?.totalSupplyFunctionName ?? 'totalSupply',
      },
      /**
       * LP token total supply
       */
      {
        ...token.tokenContract,
        functionName: 'totalSupply',
      },
      {
        address: getContracts().balancerDeployer.address,
        abi: getContracts().balancerDeployer.abi,
        args: [token.balancerTokenId],
        functionName: 'getPoolTokens',
      },
    ],

    enabled: !isHomepage && !disabled,
    watch: true,
  });

  const {
    data: accountData,
    isLoading: isLoadingAccountData,
    isFetching: isFetchingAccountData,
    isRefetching: isRefetchingAccountData,
  } = useContractReads({
    contracts: [
      {
        ...token.stakingContract,
        functionName: 'balanceOf',
        args: [address],
      },
      {
        ...token.stakingContract,
        functionName: 'earned',
        args: [address],
      },
    ].concat(
      token.tokenContract
        ? [
            {
              ...token.tokenContract,
              functionName: 'allowance',
              args: [address, token.stakingContract.address],
            },
          ]
        : [],
    ),
    enabled: isConnected && !isHomepage && !disabled,
    watch: true,
  });

  const totalStackedToken = (publicData?.[0] as BigNumber) ?? BigZero;

  const LPTotalSupply = (publicData?.[1] as BigNumber) ?? BigZero;

  const [AGIReserve, ETHReserve] = publicData?.[2]?.[1] ?? [BigZero, BigZero];

  const accountStakedBalance = (accountData?.[0] as unknown as BigNumber) ?? BigZero;

  const esAGIEarned: BigNumber = Array.isArray(accountData?.[1])
    ? (accountData?.[1][0] as BigNumber) ?? BigZero
    : (accountData?.[1] as unknown as BigNumber) ?? BigZero;

  const stakingContractAllowance = (accountData?.[2] as unknown as BigNumber) ?? BigZero;

  const hasStacked = !accountStakedBalance.isZero();

  const { write: exit, isLoading: isLoadingExit } = useWriteContract({
    address: token.stakingContract.address,
    abi: token.stakingContract.abi,
    functionName: 'exit',
    enabled: !isLoadingAccountData && hasStacked,
    successMessage: 'Withdraw all Success!',
    supressWarning: true,
  });

  const pricePerToken =
    (bigNumberToDecimal(AGIReserve) * AGIPrice + bigNumberToDecimal(ETHReserve) * ethPrice) /
    bigNumberToDecimal(LPTotalSupply);

  const TVL = pricePerToken * bigNumberToDecimal(totalStackedToken);

  const APYAvailable = token.tokenContract
    ? AGIReserve && ETHReserve && ethPrice && AGIPrice && totalStackedToken && LPTotalSupply
    : AGIPrice && bigNumberToDecimal(totalStackedToken) && ethPrice;

  const APR = APYAvailable ? ((token.poolDailyEmission * AGIPrice) / TVL) * 365 * 100 : '???';

  useReportTVL(disabled ? 0 : TVL, token.name);

  const onExit = () => {
    if (disabled) return;
    if (hasStacked) {
      exit?.();
    }
  };

  const onClaimClick = () => {
    if (disabled) return;
    if (!esAGIEarned.isZero()) claimReward?.();
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
    enabled: !esAGIEarned.isZero() && !disabled,
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

  // if (token.name === 'AGI') {
  //   console.log(TVL, pricePerToken, bigNumberToDecimal(totalStackedToken), otherPrices);
  // }
  const withdrawBtns = (
    <>
      <WithdrawBtn onClick={onWithdrawClick} disabled={!hasStacked || disabled}>
        Withdraw
      </WithdrawBtn>
      <Tooltip
        title={disabled ?? !hasStacked ? undefined : `Withdraw all your staked ${token.name} + esAGI rewards`}
        placement="bottom"
      >
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
        if (disabled) return;
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
            {token.explainContent?.explainText ? (
              <Tooltip title={token.explainContent.explainText}>
                <InfoIcon
                  fill={'#a6b0c3'}
                  style={{
                    marginInlineStart: 4,
                  }}
                ></InfoIcon>
              </Tooltip>
            ) : null}
          </span>
          {token.explainContent?.buyLPLink ? (
            <span>
              <a href={token.explainContent.buyLPLink}>{token.explainContent.buyLPText}</a>
            </span>
          ) : null}
        </span>
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
          <div className={style.number}>${disabled ?? isNaN(TVL) ? '???' : commas(TVL)}</div>
        </div>
      </div>

      {/* claim */}
      <div className={style.claim_sec}>
        <div className={style.left}>
          <div className={style.text}> esAGI Earned</div>
          <div className={style.number}>{disabled ? 0 : bigNumberToDecimal(esAGIEarned, 6)} $esAGI</div>
        </div>
        {!esAGIEarned.isZero() && !disabled ? (
          <ClaimBtn onClick={onClaimClick} isLoading={isLoadingClaim} disabled={esAGIEarned.isZero() || disabled} />
        ) : null}
      </div>

      <div className={style.line}></div>

      {/* stake */}
      <div className={style.stake_sec}>
        <div className={style.left}>
          <div className={style.text}> {token.name} Staked</div>
          <div className={style.number}>
            {disabled ? '0' : numberToPrecision(bigNumberToDecimal(accountStakedBalance), 6)}
            {/* {!disabled && (
              <>
                {LPValue * bigNumberToDecimal(accountStakedBalance) > 0
                  ? ` ($${numberToPrecision(LPValue * bigNumberToDecimal(accountStakedBalance), 0)})`
                  : ''}
              </>
            )} */}
          </div>
        </div>
        {token.tokenContract ? (
          (overrideApprovalStatus || !stakingContractAllowance.isZero()) && !disabled ? (
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
        stakeSettings={token.stakeSettings}
      />
    </div>
  );
};
