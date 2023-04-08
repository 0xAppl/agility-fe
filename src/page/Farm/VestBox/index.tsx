/* eslint-disable no-constant-condition */
import React, { useCallback } from 'react';
import cs from 'classnames';
import { CommonButton, RedeemBtn, WithdrawAGIBtn } from '../../../components/Btns';
import { API } from '../../../Api';
import style from './index.module.less';
import farmStyle from '../index.module.less';

import RedeemModal from './redeemModal';
import useReadContractNumber from '@hooks/useReadContractNumber';
import { getContracts } from '../tokenConfigs';
import { useAccount, useContractReads, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { toast } from 'react-toastify';
import { type BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils.js';
import { bigNumberToDecimal, numberToPrecision } from '@utils/number';
import { ONE_DAY_IN_SECS } from '@utils/time';
import CustomSpin from '@components/spin';
import VestingStatus from './vestingStatus';

interface IVest {
  typeText: string;
  countText: string;
}

export interface VestData {
  balance: IVest;
  vestingDays: IVest;
  AGIList: IVest[];
}

export type AGIReedemInfo = [BigNumber, BigNumber, BigNumber, `0x${string}`, BigNumber];

export const VestBox = () => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const [operatingIndex, setOperatingIndex] = React.useState(0);

  const { address, isConnected } = useAccount();

  const { data: esAGIBalance } = useReadContractNumber({
    ...getContracts().esAGI,
    functionName: 'balanceOf',
    args: [address],
    outputBigNumber: true,
    enabled: isConnected,
  });

  const { data: AGIBalance } = useReadContractNumber({
    ...getContracts().AGI,
    functionName: 'balanceOf',
    args: [address],
    outputBigNumber: true,
    enabled: isConnected,
  });

  const { data: AGIRedeemingCount } = useReadContractNumber({
    ...getContracts().esAGI,
    functionName: 'getUserRedeemsLength',
    args: [address],
    enabled: isConnected,
    outputBigNumber: true,
    watch: true,
  });

  const convertedAGIRedeemingCount =
    AGIRedeemingCount !== undefined ? (AGIRedeemingCount as unknown as BigNumber).toNumber() : 0;

  const { data: AGIRedeemingInfo } = useContractReads({
    contracts: Array.from({ length: convertedAGIRedeemingCount }).map((_, index) => {
      return {
        ...getContracts().esAGI,
        functionName: 'getUserRedeem',
        args: [address, index],
      };
    }),
    enabled: isConnected && convertedAGIRedeemingCount > 0,
    watch: true,
    keepPreviousData: true,
  });

  const onClickRedeem = () => {
    if ((esAGIBalance as unknown as BigNumber).isZero()) {
      return toast.info('No esAGI balance');
    }
    setModalOpen(true);
  };

  return (
    <>
      <div className={cs(farmStyle.farm_sec_container, farmStyle.vesting_container)}>
        <div className={farmStyle.title}>esAGI Vesting</div>
        <div className={farmStyle.balance}>
          Balance: $AGI: {bigNumberToDecimal(AGIBalance as unknown as BigNumber, true)}&nbsp;&nbsp;$esAGI:{' '}
          {bigNumberToDecimal(esAGIBalance as unknown as BigNumber, true)}{' '}
          <RedeemBtn
            onClick={onClickRedeem}
            disabled={esAGIBalance === undefined ? true : (esAGIBalance as unknown as BigNumber).isZero()}
          />
        </div>

        <div className={style.box_container}>
          {/* balance  */}

          {/* input output */}
          {(!Array.isArray(AGIRedeemingInfo) ? [] : (AGIRedeemingInfo as unknown as AGIReedemInfo[])).map(
            (data, index) => {
              return <VestingStatus index={index} key={index} data={data} />;
            },
          )}
        </div>
      </div>
      <RedeemModal
        isModalOpen={modalOpen}
        setIsModalOpen={setModalOpen}
        esAGIBalance={esAGIBalance as unknown as BigNumber}
      ></RedeemModal>
    </>
  );
};
