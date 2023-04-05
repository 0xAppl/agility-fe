/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { fetchBalance } from '@wagmi/core';
import { Button, Input, Modal, Slider } from 'antd';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils.js';
import React, { useEffect, useState } from 'react';
import {
  useAccount,
  useContract,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useProvider,
  useSigner,
  useWaitForTransaction,
} from 'wagmi';
import { StakeBtn } from '../../../components/Btns';
import CustomSpin from '../../../components/spin';
import useDebounce from '../../../hooks/useDebounce';
import { bigNumberToDecimal, expandTo18Decimals } from '../../../utils/number';
// import { useContractContext } from '../../../contexts/contractContext';
import { type IContract, nativeTokenAddress } from '../tokenConfigs';
import style from './index.module.less';

import { toast, ToastContainer } from 'react-toastify';

const StackingModal: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  stackingTokenAddress?: string;
  contractAddress: IContract['address'];
  contractABI: IContract['abi'];
  title?: React.ReactNode;
  modalMode: 'stake' | 'withdraw';
}> = ({ isModalOpen, setIsModalOpen, contractAddress, contractABI, title, modalMode }) => {
  //   const contracts = useContractContext();
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const provider = useProvider();

  const debouncedValue = useDebounce(value);

  const { address } = useAccount();

  // console.log(debouncedValue);

  const { config, error: prepareError } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: modalMode,
    args: [parseEther(debouncedValue.toString())],
    enabled: debouncedValue !== 0 && isModalOpen,
    overrides:
      modalMode === 'stake'
        ? {
            value: parseEther(debouncedValue.toString()),
            gasLimit: BigNumber.from(200000),
          }
        : undefined,
  });

  const { write, data, error } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      toast.success('Transaction Success!');
      setIsModalOpen(false);
    },
    onError(err) {
      console.log(err);
    },
  });

  const {
    data: stakingInfo,
    isError,
    isLoading: isLoadingStakingInfo,
  } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: 'balanceOf',
    args: [address],
    watch: false,
    enabled: modalMode === 'withdraw' && isModalOpen,
  });

  useEffect(() => {
    if (!isModalOpen || address === undefined) return;
    // read user's wallet balance
    if (modalMode === 'stake') {
      setLoading(true);
      fetchBalance({ address, formatUnits: 'ether' })
        .then(balance => {
          setMaxValue(bigNumberToDecimal(balance.value) as number);
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      if (stakingInfo && BigNumber.isBigNumber(stakingInfo)) {
        setMaxValue(bigNumberToDecimal(stakingInfo) as number);
      }
    }
  }, [provider, isModalOpen, address, modalMode, stakingInfo]);

  useEffect(() => {
    if (error ?? prepareError) {
      toast.error(error?.message ?? prepareError?.message);
    }
  }, [error, prepareError]);

  return (
    <>
      <Modal
        title={title}
        open={isModalOpen}
        onOk={() => {
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setIsModalOpen(false);
          setValue(0);
        }}
        transitionName=""
        footer={null}
        maskClosable={false}
      >
        {loading || isLoadingStakingInfo ? (
          <>
            <CustomSpin></CustomSpin>
          </>
        ) : (
          <>
            <Slider value={value} onChange={setValue} max={maxValue} step={0.0000001} />
            <div className={style.input_group}>
              <Input
                value={value}
                max={maxValue}
                onChange={e => {
                  setValue(Number(e.target.value));
                }}
                type="number"
                step={0.001}
                style={{
                  flexGrow: 1,
                }}
              ></Input>
              <Button
                onClick={() => {
                  setValue(maxValue * 0.25);
                }}
              >
                25%
              </Button>
              <Button
                onClick={() => {
                  setValue(maxValue * 0.5);
                }}
              >
                50%
              </Button>
              <Button
                onClick={() => {
                  setValue(maxValue * 0.75);
                }}
              >
                75%
              </Button>
              <Button
                onClick={() => {
                  setValue(maxValue);
                }}
              >
                Max
              </Button>
            </div>
          </>
        )}
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <StakeBtn
            styles={{
              margin: 'auto',
              marginTop: '20px',
            }}
            onClick={() => {
              if (write === undefined || isLoading) {
                return;
              }
              write?.();
            }}
            isLoading={isLoading}
          >
            {modalMode}
          </StakeBtn>
        </div>
      </Modal>
    </>
  );
};

export default StackingModal;
