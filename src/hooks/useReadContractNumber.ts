import { type IContract } from '@page/Farm/tokenConfigs';
import { bigNumberToDecimal } from '@utils/number';
import { type ExtractArrayType, type ExtractFunctionParams } from '@utils/type';
import { type BigNumber } from 'ethers';
import { useAccount, useContractRead } from 'wagmi';

type IUseReadContractNumber = ExtractArrayType<ExtractFunctionParams<typeof useContractRead>>;

const useReadContractNumber = (params: IUseReadContractNumber) => {
  const { isConnected } = useAccount();

  const { data, isLoading, isError, ...rest } = useContractRead({
    ...params,
    enabled: params?.enabled ?? isConnected,
  });

  return { data: isLoading || isError ? 0 : bigNumberToDecimal(data as BigNumber), isLoading, isError, ...rest };
};

export default useReadContractNumber;
