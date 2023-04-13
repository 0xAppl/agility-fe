import { type BigNumber } from 'ethers';
import React, { useContext } from 'react';
import { BigZero } from '../utils/number';

export const GlobalStatsContext = React.createContext<{
  TVL: number;
  AGIPrice: number;
  AGITotalSupply: number;
  ethPrice: number;
  stETH: { price: number };
  rETH: { price: number };
  ankrETH: { price: number };
  fraxETH: { price: number };
}>({
  ethPrice: 0,
  stETH: { price: 0 },
  rETH: { price: 0 },
  ankrETH: { price: 0 },
  fraxETH: { price: 0 },
  TVL: 0,
  AGIPrice: 0,
  AGITotalSupply: 0,
});

export const useGlobalStatsContext = () => useContext(GlobalStatsContext);
