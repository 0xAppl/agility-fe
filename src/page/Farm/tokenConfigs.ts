import { type IStatus } from './StatusBox';
import { type IToken } from './TokenBox';
import { type VestData } from './VestBox';
import ETHIcon from '../../assets/ETH_icon.svg';

export interface IContract {
  address: `0x${string}`;
  abi: any[];
}

export const nativeTokenAddress = '0x0000000000000000000000000000000000000000';

export const getContracts = (network = '0x1'): Record<string, IContract> => {
  return {
    ETHPool: {
      address: '0xdee9477b0a5D62f987aA9cfE18Ee651a68F13556',
      abi: [
        {
          inputs: [
            { internalType: 'address', name: '_rewardsDistribution', type: 'address' },
            { internalType: 'address', name: '_rewardsToken', type: 'address' },
            { internalType: 'address', name: '_nativeTokenWrapper', type: 'address' },
            { internalType: 'uint256', name: '_durationInDays', type: 'uint256' },
          ],
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        {
          anonymous: false,
          inputs: [
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
          ],
          name: 'ELRewardWithdrawn',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [{ indexed: false, internalType: 'uint256', name: 'reward', type: 'uint256' }],
          name: 'RewardAdded',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            { indexed: true, internalType: 'address', name: 'user', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'reward', type: 'uint256' },
          ],
          name: 'RewardPaid',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            { indexed: true, internalType: 'address', name: 'user', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
          ],
          name: 'Staked',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            { indexed: true, internalType: 'address', name: 'user', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
          ],
          name: 'Withdrawn',
          type: 'event',
        },
        {
          inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
          name: 'balanceOf',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
          name: 'earned',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
        { inputs: [], name: 'exit', outputs: [], stateMutability: 'nonpayable', type: 'function' },
        { inputs: [], name: 'getReward', outputs: [], stateMutability: 'nonpayable', type: 'function' },
        {
          inputs: [],
          name: 'getRewardForDuration',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'lastTimeRewardApplicable',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'lastUpdateTime',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [{ internalType: 'uint256', name: 'reward', type: 'uint256' }],
          name: 'notifyRewardAmount',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'periodFinish',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'rewardPerToken',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'rewardPerTokenStored',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'rewardRate',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [{ internalType: 'address', name: '', type: 'address' }],
          name: 'rewards',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'rewardsDistribution',
          outputs: [{ internalType: 'address', name: '', type: 'address' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'rewardsDuration',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'rewardsToken',
          outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
          name: 'stake',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'stakingToken',
          outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'totalSupply',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [{ internalType: 'address', name: '', type: 'address' }],
          name: 'userRewardPerTokenPaid',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'weth',
          outputs: [{ internalType: 'contract IWETH', name: '', type: 'address' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
          name: 'withdraw',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
          name: 'withdrawELRewards',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        { stateMutability: 'payable', type: 'receive' },
      ],
    },
    stETHPool: {
      address: '0x8E7A8962a16f21005E93B3C8FCD39a81608ee520',
      abi: null,
    },
    AGI: {
      address: '0xa49573920bd91e61bd46669059E80288FB44FAa0',
      abi: null,
    },
    esAGI: {
      address: '0x6bCdeB6457982b26A244521CC3A129571BAB8D22',
      abi: null,
    },
    poolFactory: {
      address: '0xa378671de217b5B69154CA14297e00086619b512',
      abi: null,
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
      apr: 'string',
      esAGIEarned: 'string',
      ethStaked: 'string',
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
