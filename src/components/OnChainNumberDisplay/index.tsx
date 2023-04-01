/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react';

import { getContract } from '@wagmi/core';
import { useAccount, useContractRead } from 'wagmi';
import { getContracts } from '../../page/Farm/tokenConfigs';
import Shimmer from '../Shimmer';

const OnChainNumberDisplay: React.FC<{
  contractAddress: `0x${string}`;
  functionName: string;
}> = ({ contractAddress, functionName }) => {
  const { isConnected, address } = useAccount();

  const { data, isError, isLoading } = useContractRead({
    address: contractAddress,
    abi: Object.values(getContracts()).filter(contract => contract.address === contractAddress)[0].abi,
    functionName,
    args: [address],
  });

  return isConnected ? isLoading ? <Shimmer>Loading...</Shimmer> : data?.toNumber() : '???';
};
export default OnChainNumberDisplay;
