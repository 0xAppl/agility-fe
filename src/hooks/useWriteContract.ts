/* eslint-disable react-hooks/exhaustive-deps */
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
  supressWarning?: boolean;
}

const useWriteContract = (config: IUseWriteContract) => {
  const { address, abi, functionName, args, successMessage, enabled, successCallback, supressWarning } = config;
  const { config: writeConfig, error: prepareContractError } = usePrepareContractWrite({
    address,
    abi,
    functionName,
    args,
    enabled,
    scopeKey: address + functionName,
  });

  const {
    write,
    error: contractWriteError,
    data: contractWriteData,
    isLoading: isPendingTx,
  } = useContractWrite(writeConfig);

  const { isLoading, error: useWaitForTransactionError } = useWaitForTransaction({
    hash: contractWriteData?.hash,
    onSuccess(data) {
      toast.success(successMessage ?? 'Success!');
      successCallback?.(data);
    },
    onError(err) {
      console.log(err);
    },
  });

  useEffect(() => {
    if (supressWarning) {
      return;
    }
    if (prepareContractError) {
      console.log(prepareContractError);
      toast.error(
        `prepare contract ${String(address)}, method ${functionName} ${
          args ? 'args: ' + JSON.stringify(args) : ''
        }, error:${prepareContractError.message}`,
      );
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
