import { fetchBalance } from '@wagmi/core';
import { Input, Modal, Slider } from 'antd';
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
} from 'wagmi';
import { StakeBtn } from '../../../components/Btns';
import CustomSpin from '../../../components/spin';
import useDebounce from '../../../hooks/useDebounce';
import { expandTo18Decimals } from '../../../utils/number';
// import { useContractContext } from '../../../contexts/contractContext';
import { type IContract, nativeTokenAddress } from '../tokenConfigs';

const StackingModal: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  onOK: (stakeAmount: number) => void;
  stackingTokenAddress?: string;
  contractAddress: IContract['address'];
  contractABI: IContract['abi'];
}> = ({
  isModalOpen,
  setIsModalOpen,
  onOK,
  stackingTokenAddress = nativeTokenAddress,
  contractAddress,
  contractABI,
}) => {
  //   const contracts = useContractContext();
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const provider = useProvider();

  const debouncedValue = useDebounce(value);

  const { address } = useAccount();

  const { data: signer, isError, isLoading } = useSigner();

  const contract = useContract({
    address: contractAddress,
    abi: contractABI,
    signerOrProvider: signer,
  });

  //   console.log(debouncedValue);

  const { config, error } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: 'stake',
    args: [parseEther(debouncedValue.toString())],
    enabled: debouncedValue !== 0 && isModalOpen,
  });

  const { write } = useContractWrite(config);

  useEffect(() => {
    if (!isModalOpen || address === undefined) return;
    // read user's wallet balance
    setLoading(true);
    fetchBalance({ address, formatUnits: 'ether' })
      .then(balance => {
        setMaxValue(Number(balance.formatted));
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [provider, stackingTokenAddress, isModalOpen, address]);
  return (
    <Modal
      title="Stake"
      open={isModalOpen}
      onOk={() => {
        setIsModalOpen(false);
      }}
      onCancel={() => {
        setIsModalOpen(false);
      }}
      transitionName=""
      footer={null}
    >
      {loading ? (
        <>
          <CustomSpin></CustomSpin>
        </>
      ) : (
        <>
          <Slider value={value} onChange={setValue} max={maxValue} step={0.0000001} />
          <Input value={value} readOnly></Input>
        </>
      )}
      <div>
        <StakeBtn
          styles={{
            margin: 'auto',
            marginTop: '20px',
          }}
          onClick={() => {
            // console.log(contract?.stake);
            // contract?.stake(1000);
            write?.();
          }}
        />
      </div>
    </Modal>
  );
};

export default StackingModal;
