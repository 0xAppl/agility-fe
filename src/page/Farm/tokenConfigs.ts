/* eslint-disable max-lines */
import { type IStatus } from './StatusBox';
import { type VestData } from './VestBox';
import ETHIcon from '../../assets/ETH_icon.svg';
import {
  AGIAbi,
  esAGIAbi,
  ETHPoolAbi,
  UniLpAbi as UniPoolAbi,
  AGIWETHContractAbi,
  AGIWETHLPAbi,
  stETHAbi,
  stETHPoolABi,
  fraxETHAbi,
  rETHAbi,
  ankrETHAbi,
} from './abis';
import stETH from '../../assets/stETH.svg';
import rETH from '../../assets/rETH.png';
import fraxETH from '../../assets/fraxETH.svg';
import wETH from '../../assets/weth_logo.png';
import AGI from '../../assets/agility_logo.png';
import ankrETH from '../../assets/ankreth-logo.png';

// export const PoolDailyEmission = 400_000;
// export const PoolBlockEmission = PoolDailyEmission / 7200;

type ContractKeys =
  | 'ETHPool'
  | 'stETHPool'
  | 'AGI'
  | 'esAGI'
  | 'poolFactory'
  | 'AGIETHTradingPool'
  | 'AGIWETHContract'
  | 'AGIWETHLP'
  | 'stETH'
  | 'fraxETH'
  | 'fraxETHPool'
  | 'rETH'
  | 'ankrETH'
  | 'rEthPool'
  | 'ankrEthPool';

export const getContracts = (network = '0x1'): Record<ContractKeys, IContract> => {
  return {
    ETHPool: {
      address: '0xB3db4e3238c1656fb6b832FB692643f4Fa452010',
      abi: ETHPoolAbi,
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
    stETH: {
      address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
      abi: stETHAbi,
    },
    stETHPool: {
      address: '0xEFd8a0b5e0e01A95fCc15656DAd61D5B5436B2b4',
      abi: stETHPoolABi,
    },
    fraxETH: {
      address: '0x5E8422345238F34275888049021821E8E08CAa1f',
      abi: fraxETHAbi,
    },
    fraxETHPool: {
      address: '0xabb828565d46F9Db074d55241D82621B129bcF16',
      abi: stETHPoolABi,
    },
    rETH: {
      address: '0xae78736cd615f374d3085123a210448e74fc6393',
      abi: rETHAbi,
    },
    rEthPool: {
      address: '0x9775F32737f141AB1b661dD83F7afdf4ef749F3D',
      abi: stETHPoolABi,
    },
    ankrETH: {
      address: '0xe95a203b1a91a908f9b9ce46459d101078c2c3cb',
      abi: ankrETHAbi,
    },
    ankrEthPool: {
      address: '0x5d5897797287a3c2552251A9D9185E09dd25b558',
      abi: stETHPoolABi,
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
      stakingContract: getContracts().stETHPool,
      tokenContract: getContracts().stETH,
      poolDailyEmission: 250_000,
    },
    {
      icon: rETH,
      name: 'rETH',
      stakingContract: getContracts().rEthPool,
      tokenContract: getContracts().rETH,
      poolDailyEmission: 20_000,
    },
    {
      icon: fraxETH,
      name: 'fraxETH',
      stakingContract: getContracts().fraxETHPool,
      tokenContract: getContracts().fraxETH,
      poolDailyEmission: 20_000,
    },
    {
      icon: ankrETH,
      name: 'ankrETH',
      stakingContract: getContracts().ankrEthPool,
      tokenContract: getContracts().ankrETH,
      poolDailyEmission: 20_000,
    },
  ],
};
