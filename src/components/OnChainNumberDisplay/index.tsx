/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import useReadContractNumber from '@hooks/useReadContractNumber';
import { type BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils.js';
import React from 'react';

import { useAccount, useContractRead } from 'wagmi';
import useTVL from '../../hooks/useTVL';
import { type IContract } from '../../page/Farm/tokenConfigs';
import { bigNumberToDecimal, numberToPrecision } from '../../utils/number';
import Shimmer from '../Shimmer';

const OnChainNumberDisplay: React.FC<{
  contract: IContract;
  valueName: string;
  args?: any[];
  watch?: boolean;
  transform?: (value: number) => React.ReactNode;
}> = ({ contract, valueName, args, transform, watch }) => {
  //   return 333;
  const { isConnected } = useAccount();

  const { data: value, isLoading } = useReadContractNumber({
    address: contract.address,
    abi: contract.abi,
    functionName: valueName,
    args,
    watch,
  });

  return (
    <>
      {isConnected ? (
        isLoading ? (
          <Shimmer>Loading...</Shimmer>
        ) : transform ? (
          transform(value)
        ) : (
          numberToPrecision(value)
        )
      ) : (
        '???'
      )}
    </>
  );
};
export default OnChainNumberDisplay;
