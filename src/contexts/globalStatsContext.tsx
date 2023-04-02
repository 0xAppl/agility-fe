import { type BigNumber } from 'ethers';
import React, { useContext } from 'react';
import { BigZero } from '../utils/number';

export const GlobalStatsContext = React.createContext<{
  ethPrice: number;
  TVL: number;
  AGIPrice: number;
  AGITotalSupply: number;
}>({
  ethPrice: 0,
  TVL: 0,
  AGIPrice: 0,
  AGITotalSupply: 0,
});

export const useGlobalStatsContext = () => useContext(GlobalStatsContext);
