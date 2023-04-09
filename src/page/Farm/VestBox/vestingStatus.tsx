/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-constant-condition */
import React from 'react';
import cs from 'classnames';
import { CommonButton, WithdrawAGIBtn } from '../../../components/Btns';
import style from './index.module.less';

import { getContracts } from '../tokenConfigs';
import { toast } from 'react-toastify';
import { bigNumberToDecimal } from '@utils/number';
import CustomSpin from '@components/spin';
import { type AGIReedemInfo } from '.';
import useWriteContract from '@hooks/useWriteContract';

const VestingStatus: React.FC<{ index: number; data: AGIReedemInfo }> = ({ index, data }) => {
  if (!data) return null;
  const [AGIOutput, ESAGIInput, endDate] = data;

  const now = new Date().getTime();
  const canWithdraw = now > Number(endDate) * 1000;

  //   const canWithdraw =

  //   const { config } = usePrepareContractWrite({
  //     address: getContracts().esAGI.address,
  //     abi: getContracts().esAGI.abi,
  //     functionName: 'cancelRedeem',
  //     args: [index],
  //   });

  //   const { write: cancelRedeem, data: cancelData, error } = useContractWrite(config);

  //   const { isLoading: isLoadingCancelRedeem } = useWaitForTransaction({
  //     hash: cancelData?.hash,
  //     onSuccess(data) {
  //       toast.success('Cancel Redeem Success!');
  //     },
  //     onError(err) {
  //       console.log(err);
  //     },
  //   });

  const { write: cencelRedeem, isLoading: isLoadingCancelRedeem } = useWriteContract({
    address: getContracts().esAGI.address,
    abi: getContracts().esAGI.abi,
    functionName: 'cancelRedeem',
    args: [index],
    successMessage: 'Cancel Redeem Success!',
  });

  const { write: finalizeRedeem, isLoading: isLoadingFinalizeRedeem } = useWriteContract({
    address: getContracts().esAGI.address,
    abi: getContracts().esAGI.abi,
    functionName: 'finalizeRedeem',
    args: [index],
    successMessage: 'Redeem Success!',
    enabled: canWithdraw,
  });

  const onWithDrawClick = () => {
    if (canWithdraw) {
      finalizeRedeem?.();
    } else {
      toast.info('Can not withdraw now');
    }
  };

  return (
    <div className={cs(style.vest_box, style.big)}>
      <div className={style.vest_inner_box}>
        <div className={style.type}>Batch</div>
        <div className={style.count}>#{index + 1}</div>
      </div>
      <div className={style.vest_inner_box}>
        <div className={style.type}>AGI OUTPUT</div>
        <div className={style.count}>{bigNumberToDecimal(AGIOutput, 6)}</div>
      </div>
      <div className={style.vest_inner_box}>
        <div className={style.type}>ESAGI INPUT</div>
        <div className={style.count}>{bigNumberToDecimal(ESAGIInput, 6)}</div>
      </div>
      <div className={style.vest_inner_box}>
        <div className={style.type}>Claim On</div>
        <div className={style.count}>{new Date(Number(endDate) * 1000).toLocaleString()}</div>
      </div>

      <div className={style.btn_group}>
        <WithdrawAGIBtn onClick={onWithDrawClick} disabled={!canWithdraw} isLoading={isLoadingFinalizeRedeem} />
        <CommonButton
          style={{
            fontSize: '12px',
          }}
          onClick={() => {
            cencelRedeem?.();
          }}
        >
          {isLoadingCancelRedeem ? <CustomSpin style={{ marginRight: 4 }} /> : null}Cancel
        </CommonButton>
      </div>
    </div>
  );
};

export default VestingStatus;
