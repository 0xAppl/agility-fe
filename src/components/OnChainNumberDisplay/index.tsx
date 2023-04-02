/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils.js';
import React from 'react';

import { useAccount, useContractRead } from 'wagmi';
import useTVL from '../../hooks/useTVL';
import { type IContract } from '../../page/Farm/tokenConfigs';
import { bigNumberToDecimal } from '../../utils/number';
import Shimmer from '../Shimmer';

const OnChainNumberDisplay: React.FC<{
  contract: IContract;
  valueName: string;
  args?: any[];
  watch?: boolean;
  transform?: (value: BigNumber) => React.ReactNode;
}> = ({ contract, valueName: functionName, args, transform, watch }) => {
  //   return 333;
  const { isConnected } = useAccount();

  const { data, isError, isLoading } = useContractRead({
    address: contract.address,
    abi: contract.abi,
    functionName,
    args,
    watch,
    enabled: isConnected,
  });

  return (
    <>
      {isConnected ? (
        isLoading ? (
          <Shimmer>Loading...</Shimmer>
        ) : transform ? (
          transform(data as unknown as BigNumber)
        ) : (
          bigNumberToDecimal(data as unknown as BigNumber).toFixed(3)
        )
      ) : (
        '???'
      )}
    </>
  );
};
export default OnChainNumberDisplay;
