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
  stafiStakedETHAbi,
} from './abis';
import stETHLogo from '../../assets/stETH.svg';
import rETHLogo from '../../assets/rETH.png';
import fraxETHLogo from '../../assets/fraxETH.svg';
import wETHLogo from '../../assets/weth_logo.png';
import AGILogo from '../../assets/agility_logo.png';
import ankrETHLogo from '../../assets/ankreth-logo.png';
import stafiStakedETHLogo from '../../assets/stafi-staked-eth.png';

// export const PoolDailyEmission = 400_000;
// export const PoolBlockEmission = PoolDailyEmission / 7200;

// type ContractKeys =
//   | 'ETHPool'
//   | 'stETHPool'
//   | 'AGI'
//   | 'esAGI'
//   | 'poolFactory'
//   | 'AGIETHTradingPool'
//   | 'AGIWETHContract'
//   | 'AGIWETHLP'
//   | 'stETH'
//   | 'fraxETH'
//   | 'fraxETHPool'
//   | 'rETH'
//   | 'ankrETH'
//   | 'rEthPool'
//   | 'ankrEthPool';

export const getContracts = (network = '0x1') => {
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
    stafiRETHPool: {
      address: '0xF9FDb8eF7b8cd32c1Db753E525EBbc3089DE963b',
      abi: stETHPoolABi,
    },
    'stafi-staked-eth': {
      address: '0x9559aaa82d9649c7a7b220e7c461d2e74c9a3593',
      abi: stafiStakedETHAbi,
    },
  } as const;
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
  isLP?: boolean;
  explainText?: string;
  byLPText?: string;
  byLPLink?: string;
}

export interface TokenConfigs {
  tokenList: IToken[];
}

export const havlingTime = 1681045200000;

export const moduleConfigs: TokenConfigs = {
  tokenList: [
    {
      icon: ETHIcon,
      name: 'ETH',
      stakingContract: getContracts().ETHPool,
      poolDailyEmission: 402_255 / 3,
    },
    {
      icon: [AGILogo, wETHLogo],
      name: 'AGI-WETH LP',
      stakingContract: getContracts().AGIWETHContract,
      tokenContract: getContracts().AGIWETHLP,
      poolDailyEmission: 1177545.6 / 3,
      isLP: true,
      byLPText: 'Mint AGI-WETH LP',
      byLPLink: 'https://app.uniswap.org/#/swap?outputCurrency=0x5f18ea482ad5cc6bc65803817c99f477043dce85',
    },
    {
      icon: stETHLogo,
      name: 'stETH',
      stakingContract: getContracts().stETHPool,
      tokenContract: getContracts().stETH,
      poolDailyEmission: 1039500 / 3,
    },
    {
      icon: rETHLogo,
      name: 'rETH',
      explainText: 'Rocket Pool ETH',
      stakingContract: getContracts().rEthPool,
      tokenContract: getContracts().rETH,
      poolDailyEmission: 6615 / 3,
    },
    {
      icon: fraxETHLogo,
      name: 'frxETH',
      stakingContract: getContracts().fraxETHPool,
      tokenContract: getContracts().fraxETH,
      poolDailyEmission: 12600 / 3,
    },
    {
      icon: ankrETHLogo,
      name: 'ankrETH',
      stakingContract: getContracts().ankrEthPool,
      tokenContract: getContracts().ankrETH,
      poolDailyEmission: 15750 / 3,
    },
    {
      icon: stafiStakedETHLogo,
      name: 'rETH',
      stakingContract: getContracts().stafiRETHPool,
      tokenContract: getContracts()['stafi-staked-eth'],
      poolDailyEmission: (15750 * 2) / 3,
      explainText: 'Stafi staked ETH',
    },
  ],
};
