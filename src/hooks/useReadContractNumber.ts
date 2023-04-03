import { type IContract } from '@page/Farm/tokenConfigs';
import { bigNumberToDecimal } from '@utils/number';
import { type BigNumber } from 'ethers';
import { useAccount, useContractRead } from 'wagmi';

const useReadContractNumber = (contract: IContract, valueName: string, args?: any[], watch?: boolean) => {
  const { isConnected } = useAccount();

  const { data, isLoading, isError } = useContractRead({
    address: contract.address,
    abi: contract.abi,
    functionName: valueName,
    args,
    watch,
    enabled: isConnected,
  });

  return { data: isLoading || isError ? 0 : bigNumberToDecimal(data as unknown as BigNumber), isLoading, isError };
};

export default useReadContractNumber;
