/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { fetchBalance } from '@wagmi/core';
import { Button, Input, Modal, Slider } from 'antd';
import { ethers, type BigNumber } from 'ethers';
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
import { getContracts, type IContract } from '../../page/Farm/tokenConfigs';
import style from './index.module.less';

import { toast, ToastContainer } from 'react-toastify';
import { capitalize } from '@utils/string';
import useWriteContract from '@hooks/useWriteContract';
import { type AGIContractType } from '@page/Farm/abis';
import { useGlobalStatsContext } from 'src/contexts/globalStatsContext';

const ConvertModal: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}> = ({ isModalOpen, setIsModalOpen }) => {
  const { userAGIBalance } = useGlobalStatsContext();
  //   const contracts = useContractContext();
  const [loading, setLoading] = React.useState(false);
  const [selectedValue, setSelectedValue] = useState<BigNumber>(BigZero);
  //   const [maxValue, setMaxValue] = useState<BigNumber>(userAGIBalance);

  const debouncedValue = useDebounce(selectedValue);

  const { address } = useAccount();

  const { data: allowance, isLoading: isLoadingAllowance } = useContractRead<AGIContractType, 'allowance', BigNumber>({
    address: getContracts().AGI.address,
    abi: getContracts().AGI.abi,
    functionName: 'allowance',
    args: [address, getContracts().esAGI.address],
    watch: true,
    enabled: isModalOpen,
  });

  const hasAllowance = allowance && !allowance.isZero();

  const { write, isLoading: isLoadingConvert } = useWriteContract({
    address: getContracts().esAGI.address,
    abi: getContracts().esAGI.abi,
    functionName: 'convert',
    args: [debouncedValue.toString()],
    successMessage: 'Convert success!',
    enabled: !debouncedValue.isZero() && isModalOpen,
    successCallback(data) {
      setIsModalOpen(false);
    },
  });

  const { write: approve, isLoading: isLoadingApprove } = useWriteContract({
    address: getContracts().AGI.address,
    abi: getContracts().AGI.abi,
    functionName: 'approve',
    args: [getContracts().esAGI.address, ethers.constants.MaxUint256],
    successMessage: 'Approve success!',
    enabled: !hasAllowance && isModalOpen,
  });

  return (
    <>
      <Modal
        title={'Stake'}
        open={isModalOpen}
        onOk={() => {
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedValue(BigZero);
        }}
        transitionName=""
        footer={null}
        maskClosable={false}
      >
        {loading || isLoadingAllowance ? (
          <>
            <CustomSpin></CustomSpin>
          </>
        ) : (
          <>
            <h4>
              Stake {bigNumberToDecimal(userAGIBalance, 3)}$AGI{' '}
              {selectedValue.isZero() ? null : <span>-&gt; {bigNumberToDecimal(selectedValue, 3)} $esAGI</span>}
            </h4>
            <Slider
              value={bigNumberToDecimal(selectedValue)}
              max={bigNumberToDecimal(userAGIBalance)}
              onChange={value => {
                setSelectedValue(
                  parseEther(value.toString()).gt(userAGIBalance) ? userAGIBalance : parseEther(value.toString()),
                );
              }}
              step={0.0000001}
              disabled={!hasAllowance}
            />
            <div className={style.input_group}>
              <Input
                value={bigNumberToDecimal(selectedValue)}
                max={bigNumberToDecimal(userAGIBalance)}
                onChange={e => {
                  setSelectedValue(parseEther(e.target.value));
                }}
                type="number"
                step={0.000001}
                style={{
                  flexGrow: 1,
                }}
                disabled={!hasAllowance}
              ></Input>
              <Button
                onClick={() => {
                  setSelectedValue(userAGIBalance.div(4));
                }}
                disabled={!hasAllowance}
              >
                25%
              </Button>
              <Button
                onClick={() => {
                  setSelectedValue(userAGIBalance.div(2));
                }}
                disabled={!hasAllowance}
              >
                50%
              </Button>
              <Button
                onClick={() => {
                  setSelectedValue(userAGIBalance.div(4).mul(3));
                }}
                disabled={!hasAllowance}
              >
                75%
              </Button>
              <Button
                onClick={() => {
                  setSelectedValue(userAGIBalance);
                }}
                disabled={!hasAllowance}
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
            disabled={hasAllowance ? debouncedValue.isZero() || isLoadingConvert : isLoadingApprove}
            styles={{
              margin: 'auto',
              marginTop: '20px',
            }}
            onClick={() => {
              if (isLoadingApprove || isLoadingConvert) {
                return;
              }
              if (!hasAllowance) {
                return approve?.();
              } else {
                write?.();
              }
            }}
            isLoading={isLoadingApprove || isLoadingConvert}
          >
            {!hasAllowance ? 'Approve' : 'Stake'}
          </StakeBtn>
        </div>
      </Modal>
    </>
  );
};

export default ConvertModal;
