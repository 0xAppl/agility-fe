/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

interface IUseWriteContract {
  address?: `0x${string}`;
  abi?: any[];
  functionName: string;
  args?: any[];
  successMessage?: string;
  enabled?: boolean;
  successCallback?: (data: any) => void;
}

const useWriteContract = (config: IUseWriteContract) => {
  const { address, abi, functionName, args, successMessage, enabled, successCallback } = config;
  const { config: writeConfig, error: prepareContractError } = usePrepareContractWrite({
    address,
    abi,
    functionName,
    args,
    enabled,
  });

  const {
    write,
    error: contractWriteError,
    data: finalizeRedeemData,
    isLoading: isPendingTx,
  } = useContractWrite(writeConfig);

  const { isLoading, error: useWaitForTransactionError } = useWaitForTransaction({
    hash: finalizeRedeemData?.hash,
    onSuccess(data) {
      toast.success(successMessage ?? 'Success!');
      successCallback?.(data);
    },
    onError(err) {
      console.log(err);
    },
  });

  useEffect(() => {
    if (prepareContractError) {
      toast.error(`prepare contract ${String(address)}, method ${functionName} error:${prepareContractError.message}`);
    }
    if (contractWriteError) {
      toast.error(`write contract ${String(address)}, method ${functionName} error:${contractWriteError.message}`);
    }
    if (useWaitForTransactionError) {
      toast.error(
        `wait for contract ${String(address)}, method ${functionName} error:${useWaitForTransactionError.message}`,
      );
    }
  }, [prepareContractError, contractWriteError, useWaitForTransactionError, address, functionName]);

  return { write, isLoading: isLoading || isPendingTx };
};

export default useWriteContract;
