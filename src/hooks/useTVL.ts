/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { BigNumber } from 'ethers';
import { useAccount, useContractRead, useContractReads } from 'wagmi';
import { getContracts, tokenConfigs } from '../page/Farm/tokenConfigs';

const useTVL = () => {
  const { tokenList } = tokenConfigs;

  //   const TVL = BigNumber.from(0);

  const { isConnected } = useAccount();

  const { data, isError, isLoading } = useContractReads({
    contracts: tokenList.map(token => ({
      ...token.stakingContract,
      functionName: 'totalSupply',
    })),
    enabled: isConnected,
  });

  return isError || isLoading || !Array.isArray(data)
    ? BigNumber.from(0)
    : data.reduce<BigNumber>((prev, next) => {
        return prev.add(next ? (next as BigNumber) : BigNumber.from(0));
      }, BigNumber.from(0));
};

export default useTVL;
