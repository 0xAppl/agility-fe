/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type BigNumber } from 'ethers';
import { type IContract } from '@page/Farm/tokenConfigs';
import { bigNumberToDecimal, BigZero } from '@utils/number';
import { useAccount, useContractRead } from 'wagmi';

const useGetTokenPriceFromLP = (
  ethPrice: number,
  lpAddress: IContract['address'],
  lpAbi: any[],
  functionName: string,
): number => {
  const { isConnected } = useAccount();
  const { data, isError, isLoading } = useContractRead({
    address: lpAddress,
    abi: lpAbi,
    enabled: isConnected,
    watch: true,
    functionName,
    chainId: 1,
  });
  if (!isLoading && !isError && data) {
    try {
      const [reserve0, reserve1] = data as unknown as [BigNumber, BigNumber];
      const tokenPrice = (Number(reserve1.toString()) / Number(reserve0.toString()) / 1) * ethPrice;
      return tokenPrice;
    } catch (e) {
      console.error(e);
      return 0;
    }
  } else {
    return 0;
  }
};

export default useGetTokenPriceFromLP;
