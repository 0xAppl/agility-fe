/* eslint-disable max-lines */
import { type IStatus } from './StatusBox';
import { type VestData } from './VestBox';
import ETHIcon from '../../assets/ETH_icon.svg';
import { AGIAbi, esAGIAbi, ETHPoolAbi, UniLpAbi } from './abis';

export interface IContract {
  address: `0x${string}`;
  abi: any[];
}

export interface IToken {
  icon: string;
  name: string;
  stakingContract: IContract;
}

export const nativeTokenAddress = '0x0000000000000000000000000000000000000000';

export const getContracts = (
  network = '0x1',
): Record<'ETHPool' | 'stETHPool' | 'AGI' | 'esAGI' | 'poolFactory' | 'uniV2Pool', IContract> => {
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
      address: '0x3322f41dfa379B6D3050C1e271B0b435b3Ee3303',
      abi: UniLpAbi,
    },
  };
};

export interface TokenConfigs {
  tokenList: IToken[];
  statusList: IStatus[];
  esAGIVestingConfig: VestData;
}

export const havlingTime = 1680912000000;

export const tokenConfigs: TokenConfigs = {
  tokenList: [
    {
      icon: ETHIcon,
      name: 'ETH',
      stakingContract: getContracts().ETHPool,
    },
    // {
    //   icon: 'string',
    //   name: 'stETH',
    //   apr: 'string',
    //   esAGIEarned: 'string',
    //   ethStaked: 'string',
    // },
    // {
    //   icon: 'string',
    //   name: 'stETH2',
    //   apr: 'string',
    //   esAGIEarned: 'string',
    //   ethStaked: 'string',
    // },
  ],
  statusList: [
    {
      typeText: 'TVL',
      countText: '??? ETH',
      valueText: '$???',
    },
    {
      typeText: 'AGI',
      countText: 'Price $???',
      valueText: 'MC $???',
    },
  ],
  esAGIVestingConfig: {
    balance: {
      typeText: 'Vesting Days',
      countText: '???',
    },
    vestingDays: {
      typeText: 'Vesting Amount',
      countText: '???',
    },
    AGIList: [
      {
        typeText: 'AGI OUTPUT',
        countText: '???',
      },
      {
        typeText: 'ESAGI INPUT',
        countText: '???',
      },
      {
        typeText: 'TIMELEFT',
        countText: '? month ?? days',
      },
    ],
  },
};
