import { toast } from 'react-toastify';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

interface IUseWriteContract {
  address: `0x${string}`;
  abi: any[];
  functionName: string;
  args: any[];
  successMessage?: string;
  enabled?: boolean;
}

const useWriteContract = (config: IUseWriteContract) => {
  const { address, abi, functionName, args, successMessage, enabled } = config;
  const { config: writeConfig } = usePrepareContractWrite({
    address,
    abi,
    functionName,
    args,
    enabled,
  });

  const { write, data: finalizeRedeemData, isLoading: isPendingTx } = useContractWrite(writeConfig);

  const { isLoading } = useWaitForTransaction({
    hash: finalizeRedeemData?.hash,
    onSuccess(data) {
      toast.success(successMessage ?? 'Success!');
    },
    onError(err) {
      console.log(err);
    },
  });
  return { write, isLoading: isLoading || isPendingTx };
};

export default useWriteContract;
