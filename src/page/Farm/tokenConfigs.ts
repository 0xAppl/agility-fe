/* eslint-disable max-lines */
import { type IStatus } from './StatusBox';
import { type VestData } from './VestBox';
import ETHIcon from '../../assets/ETH_icon.svg';
import { AGIAbi, esAGIAbi, ETHPoolAbi, UniLpAbi } from './abis';

export const PoolDailyEmission = 400_000;
export const PoolBlockEmission = PoolDailyEmission / 7200;

export const nativeTokenAddress = '0x0000000000000000000000000000000000000000';

export const getContracts = (
  network = '0x1',
): Record<'ETHPool' | 'stETHPool' | 'AGI' | 'esAGI' | 'poolFactory' | 'uniV2Pool' | 'AGIWETHLP', IContract> => {
  return {
    ETHPool: {
      address: '0xdee9477b0a5D62f987aA9cfE18Ee651a68F13556',
      abi: ETHPoolAbi,
    },
    stETHPool: {
      address: '0x8E7A8962a16f21005E93B3C8FCD39a81608ee520',
      abi: [],
    },
    AGI: {
      address: '0xa49573920bd91e61bd46669059E80288FB44FAa0',
      abi: AGIAbi,
    },
    esAGI: {
      address: '0x6bCdeB6457982b26A244521CC3A129571BAB8D22',
      abi: esAGIAbi,
    },
    poolFactory: {
      address: '0xa378671de217b5B69154CA14297e00086619b512',
      abi: [],
    },
    uniV2Pool: {
      address: '0x498c00e1ccc2afff80f6cc6144eaeb95c46cc3b5',
      abi: UniLpAbi,
    },
    AGIWETHLP: {
      address: '0x811aa8a2e44d4020767b10f6535f29bea3e04bb5',
      abi: [],
    },
  };
};

export interface IContract {
  address: `0x${string}`;
  abi: any[];
}

export interface IToken {
  icon: string;
  name: string;
  stakingContract: IContract;
  isNative?: boolean;
  mode?: 'LP';
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
    },
    {
      icon: ETHIcon,
      name: 'AGI-WETH LP',
      stakingContract: getContracts().ETHPool,
      mode: 'LP',
      isNative: false,
    },
  ],
};
