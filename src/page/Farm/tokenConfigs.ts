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
      countText: '5000 ETH',
      valueText: '$9,000,000',
    },
    {
      typeText: 'AGI',
      countText: 'Price $0.5',
      valueText: 'MC $300,000,000',
    },
  ],
  esAGIVestingConfig: {
    balance: {
      typeText: 'Balance',
      countText: '500',
    },
    AGIList: [
      {
        typeText: 'AGI OUTPUT',
        countText: '300',
      },
      {
        typeText: 'ESAGI INPUT',
        countText: '300',
      },
      {
        typeText: 'TIMELEFT',
        countText: '5 month 30 days',
      },
    ],
  },
};
