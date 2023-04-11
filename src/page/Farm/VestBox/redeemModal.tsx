/* eslint-disable no-unreachable */
import { VestingDays } from '@page/globalConfig';
import { bigNumberToDecimal, numberToPrecision } from '@utils/number';
import { Button, Modal, Slider } from 'antd';

import React, { useEffect, useState } from 'react';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { getContracts } from '../tokenConfigs';
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
}> = ({ isModalOpen, setIsModalOpen, esAGIBalance }) => {
  const [day, setDay] = useState(VestingDays.min);

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
      title={'Choose Vesting Time'}
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
      <div>
        <Slider value={day} onChange={setDay} min={VestingDays.min} max={VestingDays.max} step={1} />
        <span>
          <b>{day} days</b>
        </span>
      </div>
      <div>
        <h3>You get: </h3>
        <p>
          <b>
            {(bigNumberToDecimal(esAGIBalance) * getPercentage).toFixed(3)} $AGI (
            {numberToPrecision(getPercentage * 100)}
            %)
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
