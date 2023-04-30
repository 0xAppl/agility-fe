import { WithdrawBtn } from '@components/Btns';
import { bigNumberToDecimal, commas } from '@utils/number';
import { Modal } from 'antd';
import { type BigNumber } from 'ethers';
import React, { useEffect } from 'react';

import styles from './index.module.less';
import useWriteContract from '@hooks/useWriteContract';
import { type IContract } from '../tokenConfigs';

const WithdrawComponent: React.FC<{
  withdrawDetails: [string, BigNumber, BigNumber, BigNumber, BigNumber];
  contract: IContract;
}> = ({ withdrawDetails, contract }) => {
  const canWithdraw = new Date(Number(withdrawDetails[3].toString()) * 1000).getTime() < Date.now();

  const { write: withdraw, isLoading } = useWriteContract({
    ...contract,
    functionName: 'withdrawLocked',
    args: [withdrawDetails[0]],
    enabled: canWithdraw,
    overrides: {
      gasLimit: 1000000,
    },
  });
  return (
    <WithdrawBtn
      isLoading={isLoading}
      disabled={!canWithdraw || isLoading}
      onClick={() => {
        console.log('withdraw');
        withdraw?.();
      }}
    >
      Withdraw
    </WithdrawBtn>
  );
};

const WithdrawLockedModal: React.FC<{
  onClose: () => void;
  isOpen: boolean;
  withdrawDetails: Array<[string, BigNumber, BigNumber, BigNumber, BigNumber]>;
  contract: IContract;
}> = ({ onClose, isOpen, withdrawDetails, contract }) => {
  useEffect(() => {
    if (withdrawDetails.length === 0 || withdrawDetails.every(detail => detail[1].toString() === '0')) {
      onClose();
    }
  }, [withdrawDetails, onClose]);
  return (
    <Modal
      title="Withdraw Locked"
      open={isOpen}
      onCancel={onClose}
      maskClosable={false}
      footer={null}
      transitionName=""
      width={'60%'}
      className="locked-modal"
    >
      <div className={styles.row_wrapper}>
        <span>Start Time</span>
        <span>Locked</span>
        <span>Ending Time</span>
        <span>Multiplier</span>
        <span>Withdraw</span>
      </div>
      {withdrawDetails.map((detail, index) => {
        // console.log(detail[1].toString());
        if (detail[1].toString() === '0') return null;
        return (
          <div key={detail[0]} className={styles.row_wrapper}>
            <span>{new Date(Number(detail[1].toString()) * 1000).toLocaleString()}</span>
            <span>{commas(bigNumberToDecimal(detail[2], 2))}</span>
            <span>{new Date(Number(detail[3].toString()) * 1000).toLocaleString()}</span>
            <span>{bigNumberToDecimal(detail[4], 2)}</span>
            <span>
              <WithdrawComponent contract={contract} withdrawDetails={detail} />
            </span>
          </div>
        );
      })}
    </Modal>
  );
};

export default WithdrawLockedModal;
