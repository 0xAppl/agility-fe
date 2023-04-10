/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { fetchBalance } from '@wagmi/core';
import { Button, Input, Modal, Slider } from 'antd';
import { BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils.js';
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
import { bigNumberToDecimal, BigZero, expandTo18Decimals } from '../../../utils/number';
// import { useContractContext } from '../../../contexts/contractContext';
import { type IContract } from '../tokenConfigs';
import style from './index.module.less';

import { toast, ToastContainer } from 'react-toastify';
import { capitalize } from '@utils/string';

const StackingModal: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  stackingTokenAddress?: string;
  poolContract: IContract;
  stakingTokenContract?: IContract;

  title?: React.ReactNode;
  modalMode: 'stake' | 'withdraw';
}> = ({ isModalOpen, setIsModalOpen, poolContract, title, modalMode, stakingTokenContract }) => {
  //   const contracts = useContractContext();
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = useState<BigNumber>(BigZero);
  const [maxValue, setMaxValue] = useState<BigNumber>(BigZero);

  const debouncedValue = useDebounce(value);

  const { address } = useAccount();

  const { config, error: prepareError } = usePrepareContractWrite({
    address: poolContract.address,
    abi: poolContract.abi,
    functionName: modalMode,
    args: [debouncedValue.toString()],
    enabled: !debouncedValue.isZero() && isModalOpen,
    overrides:
      modalMode === 'stake' && !stakingTokenContract
        ? {
            value: debouncedValue.toString(),
          }
        : undefined,
  });

  const { write, data, error } = useContractWrite(config);

  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      toast.success(`${capitalize(modalMode)} Success!`);
      setIsModalOpen(false);
    },
    onError(err) {
      console.log(err);
    },
  });

  const { data: stakingInfo, isLoading: isLoadingStakingInfo } = useContractRead({
    address: poolContract.address,
    abi: poolContract.abi,
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
      fetchBalance({ address, formatUnits: 'ether', token: stakingTokenContract?.address ?? undefined })
        .then(balance => {
          setMaxValue(balance.value);
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      if (stakingInfo && BigNumber.isBigNumber(stakingInfo)) {
        setMaxValue(stakingInfo);
      }
    }
  }, [isModalOpen, address, modalMode, stakingInfo, stakingTokenContract?.address]);

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
          setValue(BigZero);
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
            <h4>Balance: {bigNumberToDecimal(maxValue, 6)}</h4>
            <Slider
              value={bigNumberToDecimal(value) as number}
              max={bigNumberToDecimal(maxValue) as number}
              onChange={value => {
                setValue(parseEther(value.toString()));
              }}
              step={0.0000001}
            />
            <div className={style.input_group}>
              <Input
                value={bigNumberToDecimal(value)}
                max={bigNumberToDecimal(maxValue)}
                onChange={e => {
                  setValue(parseEther(e.target.value));
                }}
                type="number"
                step={0.000001}
                style={{
                  flexGrow: 1,
                }}
              ></Input>
              <Button
                onClick={() => {
                  setValue(maxValue.div(4));
                }}
              >
                25%
              </Button>
              <Button
                onClick={() => {
                  setValue(maxValue.div(2));
                }}
              >
                50%
              </Button>
              <Button
                onClick={() => {
                  setValue(maxValue.div(4).mul(3));
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
            disabled={debouncedValue.isZero() || isLoading}
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
