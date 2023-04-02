/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { BigNumber } from 'ethers';
import { useContractRead } from 'wagmi';
import { tokenConfigs } from '../page/Farm/tokenConfigs';

const useTVL = () => {
  const { tokenList } = tokenConfigs;

  let TVL = BigNumber.from(0);

  for (let index = 0; index < tokenList.length; index++) {
    const element = tokenList[index];
    const { data, isError, isLoading } = useContractRead({
      address: element.stakingContract.address,
      abi: element.stakingContract.abi,
      functionName: 'totalSupply',
      watch: true,
    });
    TVL = TVL.add(isError || !data ? BigNumber.from(0) : (data as unknown as BigNumber));
  }
  return TVL;
};

export default useTVL;
