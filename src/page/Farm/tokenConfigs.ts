/* eslint-disable max-lines */
import { type IStatus } from './StatusBox';
import { type VestData } from './VestBox';
import ETHIcon from '../../assets/ETH_icon.svg';
import { AGIAbi, esAGIAbi, ETHPoolAbi, UniLpAbi as UniPoolAbi, AGIWETHContractAbi, AGIWETHLPAbi } from './abis';
import stETH from '../../assets/stETH.svg';
import rETH from '../../assets/rETH.png';
import fraxETH from '../../assets/fraxETH.svg';
import wETH from '../../assets/weth_logo.png';
import AGI from '../../assets/agility_logo.png';

// export const PoolDailyEmission = 400_000;
// export const PoolBlockEmission = PoolDailyEmission / 7200;

export const getContracts = (
  network = '0x1',
): Record<
  'ETHPool' | 'stETHPool' | 'AGI' | 'esAGI' | 'poolFactory' | 'AGIETHTradingPool' | 'AGIWETHContract' | 'AGIWETHLP',
  IContract
> => {
  return {
    ETHPool: {
      address: '0xB3db4e3238c1656fb6b832FB692643f4Fa452010',
      abi: ETHPoolAbi,
    },
    stETHPool: {
      address: '0x8E7A8962a16f21005E93B3C8FCD39a81608ee520',
      abi: [],
    },
    AGI: {
      address: '0x5F18ea482ad5cc6BC65803817C99f477043DcE85',
      abi: AGIAbi,
    },
    esAGI: {
      address: '0x801C71A771E5710D41AC4C0F1d6E82bd07B5Fa43',
      abi: esAGIAbi,
    },
    poolFactory: {
      address: '0xE4a51EC59233BA1f62b71F84554622a532B584ed',
      abi: [],
    },
    /**
     * AGI-ETH pool, for reading AGI price
     */
    AGIETHTradingPool: {
      address: '0x498c00e1ccc2afff80f6cc6144eaeb95c46cc3b5',
      abi: UniPoolAbi,
    },
    AGIWETHContract: {
      address: '0xC8187048f7Ab0db0774b674fEf3f4F4285A01bF4',
      abi: AGIWETHContractAbi,
    },
    AGIWETHLP: {
      address: '0x498c00e1ccc2afff80f6cc6144eaeb95c46cc3b5',
      abi: AGIWETHLPAbi,
    },
  };
};

export interface IContract {
  address: `0x${string}`;
  abi: any[];
}

export interface IToken {
  icon?: string | [string, string];
  name: string;
  stakingContract: IContract;
  tokenContract?: IContract;
  poolDailyEmission: number;
  disabled?: true;
}

export interface TokenConfigs {
  tokenList: IToken[];
}

export const havlingTime = 1681045200000;

export const tokenConfigs: TokenConfigs = {
  tokenList: [
    {
      icon: ETHIcon,
      name: 'ETH',
      stakingContract: getContracts().ETHPool,
      poolDailyEmission: 540_000,
    },
    {
      icon: [AGI, wETH],
      name: 'AGI-WETH LP',
      stakingContract: getContracts().AGIWETHContract,
      tokenContract: getContracts().AGIWETHLP,
      poolDailyEmission: 470_000,
    },
    {
      icon: stETH,
      name: 'stETH',
      stakingContract: getContracts().AGIWETHContract,
      tokenContract: getContracts().AGIWETHLP,
      poolDailyEmission: 470_000,
      disabled: true,
    },
    {
      icon: rETH,
      name: 'rETH',
      stakingContract: getContracts().AGIWETHContract,
      tokenContract: getContracts().AGIWETHLP,
      poolDailyEmission: 470_000,
      disabled: true,
    },
    {
      icon: fraxETH,
      name: 'fraxETH',
      stakingContract: getContracts().AGIWETHContract,
      tokenContract: getContracts().AGIWETHLP,
      poolDailyEmission: 470_000,
      disabled: true,
    },
    {
      name: '???',
      stakingContract: getContracts().AGIWETHContract,
      tokenContract: getContracts().AGIWETHLP,
      poolDailyEmission: 470_000,
      disabled: true,
    },
  ],
};
