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
import { StakeBtn } from '../Btns';
import CustomSpin from '../spin';
import useDebounce from '../../hooks/useDebounce';
import { bigNumberToDecimal, BigZero, expandTo18Decimals } from '../../utils/number';
// import { useContractContext } from '../../../contexts/contractContext';
import { type IToken, type IContract } from '../../page/Farm/tokenConfigs';
import style from './index.module.less';

import { toast, ToastContainer } from 'react-toastify';
import { capitalize } from '@utils/string';

const StackingModal: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  poolContract: IContract;
  stakingTokenContract?: IContract;
  title?: React.ReactNode;
  modalMode: 'stake' | 'withdraw' | string;
  stakeSettings?: IToken['stakeSettings'];
}> = ({ isModalOpen, setIsModalOpen, poolContract, title, modalMode, stakingTokenContract, stakeSettings }) => {
  //   const contracts = useContractContext();
  const [loading, setLoading] = React.useState(false);
  const [stakingValue, setStakingValue] = useState<BigNumber>(BigZero);
  const [maxStakingValue, setMaxStakingValue] = useState<BigNumber>(BigZero);

  const [stakingLockTime, setStakingLockTime] = useState<number>(stakeSettings?.minStakeTime ?? 0);

  const debouncedStakingValue = useDebounce(stakingValue);

  const debouncedStakingLockTime = useDebounce(stakingLockTime);

  const { address } = useAccount();

  const { config, error: prepareError } = usePrepareContractWrite({
    address: poolContract.address,
    abi: poolContract.abi,
    functionName: stakeSettings?.stakeFunctionName ?? modalMode,
    args: [debouncedStakingValue.toString()].concat(
      stakeSettings?.isLocked ? [debouncedStakingLockTime.toString()] : [],
    ),
    enabled: !debouncedStakingValue.isZero() && isModalOpen,
    /**
     * for staking ETH, we need to pass the value to the contract
     */
    overrides:
      modalMode === 'stake' && !stakingTokenContract
        ? {
            value: debouncedStakingValue.toString(),
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
          setMaxStakingValue(balance.value);
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      if (stakingInfo && BigNumber.isBigNumber(stakingInfo)) {
        setMaxStakingValue(stakingInfo);
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
          setStakingValue(BigZero);
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
            <h4>Balance: {bigNumberToDecimal(maxStakingValue, 6)}</h4>
            <Slider
              value={bigNumberToDecimal(stakingValue)}
              max={bigNumberToDecimal(maxStakingValue)}
              onChange={value => {
                setStakingValue(
                  parseEther(value.toString()).gt(maxStakingValue) ? maxStakingValue : parseEther(value.toString()),
                );
              }}
              step={0.0000001}
            />
            <div className={style.input_group}>
              <Input
                value={bigNumberToDecimal(stakingValue)}
                max={bigNumberToDecimal(maxStakingValue)}
                onChange={e => {
                  setStakingValue(parseEther(e.target.value));
                }}
                type="number"
                step={0.000001}
                style={{
                  flexGrow: 1,
                }}
              ></Input>
              <Button
                onClick={() => {
                  setStakingValue(maxStakingValue.div(4));
                }}
              >
                25%
              </Button>
              <Button
                onClick={() => {
                  setStakingValue(maxStakingValue.div(2));
                }}
              >
                50%
              </Button>
              <Button
                onClick={() => {
                  setStakingValue(maxStakingValue.div(4).mul(3));
                }}
              >
                75%
              </Button>
              <Button
                onClick={() => {
                  setStakingValue(maxStakingValue);
                }}
              >
                Max
              </Button>
            </div>
            {stakeSettings?.minStakeTime ? (
              <div>
                <p>
                  <b>Select Unlock Time: {stakingLockTime}, multipiler: </b>
                </p>
                <Slider
                  value={stakingLockTime}
                  min={stakeSettings.minStakeTime}
                  max={stakeSettings.maxStakeTime}
                  onChange={value => {
                    setStakingLockTime(value);
                  }}
                  step={1}
                  disabled={stakingValue.isZero()}
                />
              </div>
            ) : null}
          </>
        )}
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <StakeBtn
            disabled={debouncedStakingValue.isZero() || isLoading}
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
