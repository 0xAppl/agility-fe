/* eslint-disable no-constant-condition */
import React from 'react';
import cs from 'classnames';
import { RedeemBtn } from '../../../components/Btns';
import style from './index.module.less';
import farmStyle from '../index.module.less';

import RedeemModal from '../../../components/Modals/redeemModal';
import useReadContractNumber from '@hooks/useReadContractNumber';
import { getContracts } from '../tokenConfigs';
import { useAccount, useContractRead, useContractReads } from 'wagmi';
import { toast } from 'react-toastify';
import { type BigNumber } from 'ethers';
import { BigZero, bigNumberToDecimal } from '@utils/number';
import VestingStatus from './vestingStatus';
import { useGlobalStatsContext } from '../../../contexts/globalStatsContext';

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

export const VestBox: React.FC<{
  disableRedeem?: boolean;
  redeemInfoFilter?: (redeemInfo: AGIReedemInfo) => boolean;
}> = ({ disableRedeem, redeemInfoFilter = () => true }) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const { userAGIBalance, userEsAGIBalance, userAGIRedeemingCount } = useGlobalStatsContext();

  const { address, isConnected } = useAccount();

  const convertedAGIRedeemingCount = userAGIRedeemingCount.toNumber();

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
    if (userEsAGIBalance.isZero()) {
      return toast.info('No esAGI balance');
    }
    setModalOpen(true);
  };

  return (
    <>
      <div className={cs(farmStyle.farm_sec_container, farmStyle.vesting_container)}>
        <div className={farmStyle.title}>esAGI Vesting</div>
        <div className={farmStyle.balance}>
          Balance: $AGI: {bigNumberToDecimal(userAGIBalance, true)}&nbsp;&nbsp;$esAGI:{' '}
          {bigNumberToDecimal(userEsAGIBalance, true)}{' '}
          {disableRedeem === undefined && (
            <RedeemBtn
              onClick={onClickRedeem}
              disabled={userEsAGIBalance === undefined ? true : userEsAGIBalance.isZero()}
            />
          )}
        </div>

        <div className={style.box_container}>
          {/* balance  */}

          {/* input output */}
          {(!Array.isArray(AGIRedeemingInfo) ? [] : (AGIRedeemingInfo as unknown as AGIReedemInfo[]))
            .filter(redeemInfoFilter)
            .map((data, index) => {
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              if (!data) return null;
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              return <VestingStatus index={index} key={data[2]?.toString() + address || index} data={data} />;
            })}
        </div>
      </div>
      <RedeemModal isModalOpen={modalOpen} setIsModalOpen={setModalOpen} esAGIBalance={userEsAGIBalance}></RedeemModal>
    </>
  );
};
