/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { formatEther, parseEther } from 'ethers/lib/utils.js';
import React from 'react';

import { useAccount, useContractRead } from 'wagmi';
import useTVL from '../../hooks/useTVL';
import { type IContract } from '../../page/Farm/tokenConfigs';
import Shimmer from '../Shimmer';

const OnChainNumberDisplay: React.FC<{
  contract: IContract;
  valueName: string;
  args?: any[];
  watch?: boolean;
}> = ({ contract, valueName: functionName, args }) => {
  const { isConnected, address } = useAccount();

  const { data, isError, isLoading } = useContractRead({
    address: contract.address,
    abi: contract.abi,
    functionName,
    args,
    watch: true,
  });

  return isConnected ? (
    isLoading ? (
      <Shimmer>Loading...</Shimmer>
    ) : (
      Number(formatEther(data?.toString())).toFixed(3)
    )
  ) : (
    '???'
  );
};
export default OnChainNumberDisplay;
