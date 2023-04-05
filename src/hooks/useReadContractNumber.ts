import { type IContract } from '@page/Farm/tokenConfigs';
import { BigZero, bigNumberToDecimal } from '@utils/number';
import { type ExtractArrayType, type ExtractFunctionParams } from '@utils/type';
import { type BigNumber } from 'ethers';
import { useAccount, useContractRead } from 'wagmi';

type IUseReadContractNumber = ExtractArrayType<ExtractFunctionParams<typeof useContractRead>> & {
  outputBigNumber?: boolean;
};

const useReadContractNumber = <T = number>(params: IUseReadContractNumber) => {
  const { isConnected } = useAccount();

  const { data, isLoading, isError, ...rest } = useContractRead({
    ...params,
    enabled: params?.enabled ?? isConnected,
  });

  const outputData =
    isLoading || isError
      ? params.outputBigNumber ?? false
        ? BigZero
        : 0
      : params.outputBigNumber ?? false
      ? (data as BigNumber)
      : bigNumberToDecimal(data as BigNumber);

  return { data: outputData as T, isLoading, isError, ...rest };
};

export default useReadContractNumber;
