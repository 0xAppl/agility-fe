/* eslint-disable no-constant-condition */
import React from 'react';
import cs from 'classnames';
import { RedeemBtn } from '../../../components/Btns';
import style from './index.module.less';
import farmStyle from '../index.module.less';

import RedeemModal from './redeemModal';
import useReadContractNumber from '@hooks/useReadContractNumber';
import { getContracts } from '../tokenConfigs';
import { useAccount, useContractRead, useContractReads } from 'wagmi';
import { toast } from 'react-toastify';
import { type BigNumber } from 'ethers';
import { BigZero, bigNumberToDecimal } from '@utils/number';
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

  const { address, isConnected } = useAccount();

  const { data } = useContractReads({
    contracts: [
      {
        ...getContracts().AGI,
        functionName: 'balanceOf',
        args: [address],
      },
      {
        ...getContracts().esAGI,
        functionName: 'balanceOf',
        args: [address],
      },
      {
        ...getContracts().esAGI,
        functionName: 'getUserRedeemsLength',
        args: [address],
      },
    ],
    enabled: isConnected,
    watch: true,
  });

  let AGIBalance = BigZero;
  let esAGIBalance = BigZero;
  let AGIRedeemingCount = BigZero;

  if (Array.isArray(data) && data.every(Boolean)) {
    AGIBalance = (data[0] as unknown as BigNumber) ?? BigZero;
    esAGIBalance = (data[1] as unknown as BigNumber) ?? BigZero;
    AGIRedeemingCount = (data[2] as unknown as BigNumber) ?? BigZero;
  }

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
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              return <VestingStatus index={index} key={data[2]?.toString() + address || index} data={data} />;
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
