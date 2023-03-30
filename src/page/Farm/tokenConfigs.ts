import { type IStatus } from './StatusBox';
import { type IToken } from './TokenBox';
import { type VestData } from './VestBox';

export interface TokenConfigs {
  tokenList: IToken[];
  statusList: IStatus[];
  esAGIVestingConfig: VestData;
}

export const tokenConfigs: TokenConfigs = {
  tokenList: [
    {
      icon: 'string',
      name: 'ETH',
      apr: 'string',
      esAGIEarned: 'string',
      ethStaked: 'string',
    },
    {
      icon: 'string',
      name: 'stETH',
      apr: 'string',
      esAGIEarned: 'string',
      ethStaked: 'string',
    },
    {
      icon: 'string',
      name: 'stETH2',
      apr: 'string',
      esAGIEarned: 'string',
      ethStaked: 'string',
    },
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
