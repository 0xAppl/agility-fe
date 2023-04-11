/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useEffect, useState } from 'react';

const useTVL = (): number => {
  const [TVLRecords, setTVLRecords] = useState<Record<string, number>>({});
  // const { tokenList } = tokenConfigs;

  // const { isConnected } = useAccount();

  // const { data, isError, isLoading } = useContractReads({
  //   contracts: tokenList.map(token => ({
  //     ...token.stakingContract,
  //     functionName: 'totalSupply',
  //   })),
  //   enabled: isConnected,
  //   watch: true,
  // });

  // return isError || isLoading || !Array.isArray(data)
  //   ? BigZero
  //   : data.reduce<BigNumber>((prev, next) => {
  //       return prev.add(next ? (next as BigNumber) : BigZero);
  //     }, BigZero);
  // const TVL = 0;
  useEffect(() => {
    window.addEventListener('message', event => {
      if (event.data.type === 'TVL') {
        const { TVL, pool } = event.data;
        setTVLRecords(prev => ({ ...prev, [pool]: TVL }));
      }
    });
  }, []);
  return Object.values(TVLRecords).reduce((prev, next) => prev + next, 0);
};

export default useTVL;
