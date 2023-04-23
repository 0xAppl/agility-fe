/* eslint-disable no-unreachable */
import { VestingDays } from '@page/globalConfig';
import { bigNumberToDecimal, numberToPrecision } from '@utils/number';
import { Button, Modal, Slider } from 'antd';

import React, { useEffect, useState } from 'react';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { getContracts } from '../../page/Farm/tokenConfigs';
import { parseEther } from 'ethers/lib/utils.js';
import useDebounce from '@hooks/useDebounce';
import { ONE_DAY_IN_SECS } from '@utils/time';
import { toast } from 'react-toastify';
import CustomSpin from '@components/spin';
import { type BigNumber } from 'ethers';

const RedeemModal: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  esAGIBalance: BigNumber;
  lockReemPeriod?: number;
}> = ({ isModalOpen, setIsModalOpen, esAGIBalance, lockReemPeriod }) => {
  const [day, setDay] = useState(lockReemPeriod ?? VestingDays.min);

  useEffect(() => {
    if (lockReemPeriod !== undefined) {
      setDay(lockReemPeriod);
    }
  }, [lockReemPeriod]);

  const getPercentage = 0.5 + ((day - VestingDays.min) / (VestingDays.max - VestingDays.min)) * 0.5;

  const debouncedDays = useDebounce(day);

  const { config, error: prepareError } = usePrepareContractWrite({
    address: getContracts().esAGI.address,
    abi: getContracts().esAGI.abi,
    functionName: 'redeem',
    args: [esAGIBalance, String(debouncedDays * ONE_DAY_IN_SECS)],
    enabled: isModalOpen && esAGIBalance.gt(0),
  });

  const { write, data, error, isLoading: writing } = useContractWrite(config);

  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      toast.success('Redeem Success!');
      setIsModalOpen(false);
    },
    onError(err) {
      console.log(err);
    },
  });

  return (
    <Modal
      title={'Vesting'}
      open={isModalOpen}
      onOk={() => {
        setIsModalOpen(false);
      }}
      onCancel={() => {
        setIsModalOpen(false);
        setDay(3);
      }}
      transitionName=""
      footer={null}
      maskClosable={false}
    >
      {lockReemPeriod === undefined ? (
        <div>
          <h4>
            Vesting Time:{' '}
            <span>
              <b>{day} days</b>
            </span>
          </h4>
          <Slider value={day} onChange={setDay} min={VestingDays.min} max={VestingDays.max} step={1} />
        </div>
      ) : null}
      <div>
        <h4>
          By Redeeming your <b>{bigNumberToDecimal(esAGIBalance, 3)} $esAGI</b>, you get:
        </h4>
        <p>
          <b>
            {(bigNumberToDecimal(esAGIBalance) * getPercentage).toFixed(3)} $AGI{' '}
            {lockReemPeriod === undefined ? `(${numberToPrecision(getPercentage * 100, 2)}%)` : ''}
          </b>
        </p>
      </div>
      <div className="flex-center">
        <Button onClick={write} disabled={isLoading || writing}>
          {(isLoading || writing) && (
            <CustomSpin
              style={{
                marginRight: 8,
              }}
            />
          )}
          {isLoading ? 'Redeeming...' : 'Redeem'}
        </Button>
      </div>
    </Modal>
  );
};

export default RedeemModal;
