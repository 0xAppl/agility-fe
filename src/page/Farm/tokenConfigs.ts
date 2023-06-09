/* eslint-disable max-lines */
import { type IStatus } from './StatusBox';
import { type VestData } from './VestBox';
import ETHIcon from '../../assets/ETH_icon.svg';
import {
  AGIAbi,
  esAGIAbi,
  ETHPoolAbi,
  AGIWETHContractAbi,
  AGIWETHLPAbi,
  stETHAbi,
  fraxETHAbi,
  rETHAbi,
  ankrETHAbi,
  stafiStakedETHAbi,
  lockedAGIWETHLPPoolAbi,
  BalancerLPTokenAbi,
  balancerAbi,
} from './abis';
import stETHLogo from '../../assets/stETH.svg';
import rETHLogo from '../../assets/rETH.png';
import fraxETHLogo from '../../assets/fraxETH.svg';
import wETHLogo from '../../assets/weth_logo.png';
import AGILogo from '../../assets/agility_logo.png';
import ankrETHLogo from '../../assets/ankreth-logo.png';
import stafiStakedETHLogo from '../../assets/stafi-staked-eth.png';
import binance from '../../assets/binance.jpeg';
import balancerLogo from '../../assets/balancer.png';

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

const isTestnet = false;

export const getContracts = (network = '0x1') => {
  return {
    ETHPool: {
      address: '0xB3db4e3238c1656fb6b832FB692643f4Fa452010',
      abi: ETHPoolAbi,
    },

    AGIPool: {
      address: '0x2090D4CDA71E3E870b8756ACee51481421806202',
      abi: AGIWETHContractAbi,
    },

    AGI: {
      address: isTestnet ? '0xA91EA4023Da8e4FEf15372EC79e3DA15dFF3Be48' : '0x5F18ea482ad5cc6BC65803817C99f477043DcE85',
      abi: AGIAbi,
    },
    esAGI: {
      address: isTestnet ? '0x76d0c12b6164b184dae8899320b237646ce535d5' : '0x801C71A771E5710D41AC4C0F1d6E82bd07B5Fa43',
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
      abi: AGIWETHLPAbi,
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
      abi: AGIWETHContractAbi,
    },
    fraxETH: {
      address: '0x5E8422345238F34275888049021821E8E08CAa1f',
      abi: fraxETHAbi,
    },
    fraxETHPool: {
      address: '0xabb828565d46F9Db074d55241D82621B129bcF16',
      abi: AGIWETHContractAbi,
    },
    rETH: {
      address: '0xae78736cd615f374d3085123a210448e74fc6393',
      abi: rETHAbi,
    },
    rEthPool: {
      address: '0x9775F32737f141AB1b661dD83F7afdf4ef749F3D',
      abi: AGIWETHContractAbi,
    },
    ankrETH: {
      address: '0xe95a203b1a91a908f9b9ce46459d101078c2c3cb',
      abi: ankrETHAbi,
    },
    ankrEthPool: {
      address: '0x5d5897797287a3c2552251A9D9185E09dd25b558',
      abi: AGIWETHContractAbi,
    },
    stafiRETHPool: {
      address: '0xF9FDb8eF7b8cd32c1Db753E525EBbc3089DE963b',
      abi: AGIWETHContractAbi,
    },
    'stafi-staked-eth': {
      address: '0x9559aaa82d9649c7a7b220e7c461d2e74c9a3593',
      abi: stafiStakedETHAbi,
    },
    lockedAGIWETHLPPool: {
      address: '0x87d4712b1291a5a3e30e2e31255e7b6f7cbabf81',
      abi: lockedAGIWETHLPPoolAbi,
    },
    balancer20AGI80WETHPool: {
      address: '0x2B34c261880533f897B245CB8B86cCa86bA83c8e',
      abi: AGIWETHContractAbi,
    },
    balancerLPToken: {
      address: '0x6987633f18Ca0B4a10831331FcC57211941B6bA0',
      abi: BalancerLPTokenAbi,
    },
    balancerDeployer: {
      address: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
      abi: balancerAbi,
    },
  } as const;
};

export interface IContract {
  address: `0x${string}`;
  abi: any[];
}

export interface FarmingBoxConfig {
  icon?: string | [string, string];
  name: string;
  /**
   * staking contract, the contract that user stake to
   */
  stakingContract: IContract;
  /**
   * token contract, the token contract that user stake
   */
  tokenContract?: IContract;
  /**
   * pool daily emission, in esAGI
   */
  poolDailyEmission: number;
  /**
   * is disabled
   */
  disabled?: true;
  /**
   * is LP
   */
  isLP?: boolean;
  /**
   * explain content
   */
  explainContent?: {
    explainText?: string;
    buyLPText?: string;
    buyLPLink?: string;
  };
  waiting?: true;
  type?: 'balancer' | 'lockedLP';
  balancerTokenId?: string;
}

// export interface TokenConfigs {
//   tokenList: IToken[];
// }

export const havlingTime = 1681045200001;

export const moduleConfigs: { tokenList: FarmingBoxConfig[] } = {
  tokenList: [
    {
      icon: AGILogo,
      name: 'AGI',
      stakingContract: getContracts().AGIPool,
      tokenContract: getContracts().AGI,
      poolDailyEmission: 0,
    },
    {
      icon: [AGILogo, wETHLogo],
      name: 'AGI-WETH LP',
      stakingContract: getContracts().AGIWETHContract,
      tokenContract: getContracts().AGIWETHLP,
      poolDailyEmission: 0,
      isLP: true,
      explainContent: {
        buyLPText: 'Mint AGI-WETH LP',
        buyLPLink: 'https://app.uniswap.org/#/swap?outputCurrency=0x5f18ea482ad5cc6bc65803817c99f477043dce85',
      },
    },

    {
      icon: AGILogo,
      name: '20AGI-80WETH BPT',
      stakingContract: getContracts().balancer20AGI80WETHPool,
      tokenContract: getContracts().balancerLPToken,
      poolDailyEmission: 0,
      type: 'balancer',
      balancerTokenId: '0x6987633f18ca0b4a10831331fcc57211941b6ba0000200000000000000000530',
      explainContent: {
        buyLPText: 'Mint 20AGI-80WETH LP',
        buyLPLink:
          'https://app.balancer.fi/#/ethereum/pool/0x6987633f18ca0b4a10831331fcc57211941b6ba0000200000000000000000530/add-liquidity',
      },
      isLP: true,
    },
    {
      icon: stETHLogo,
      name: 'stETH',
      stakingContract: getContracts().stETHPool,
      tokenContract: getContracts().stETH,
      poolDailyEmission: 0,
    },
    {
      icon: ETHIcon,
      name: 'ETH',
      stakingContract: getContracts().ETHPool,
      poolDailyEmission: 0,
    },
    {
      icon: binance,
      name: 'Binance ETH',
      stakingContract: getContracts().ETHPool,
      poolDailyEmission: 0,
      disabled: true,
    },

    {
      icon: rETHLogo,
      name: 'rETH',
      explainContent: {
        explainText: 'Rocket Pool ETH',
      },
      stakingContract: getContracts().rEthPool,
      tokenContract: getContracts().rETH,
      poolDailyEmission: 0,
    },
    {
      icon: fraxETHLogo,
      name: 'frxETH',
      stakingContract: getContracts().fraxETHPool,
      tokenContract: getContracts().fraxETH,
      poolDailyEmission: 0,
    },
    {
      icon: ankrETHLogo,
      name: 'ankrETH',
      stakingContract: getContracts().ankrEthPool,
      tokenContract: getContracts().ankrETH,
      poolDailyEmission: 0,
    },
    {
      icon: stafiStakedETHLogo,
      name: 'rETH',
      stakingContract: getContracts().stafiRETHPool,
      tokenContract: getContracts()['stafi-staked-eth'],
      poolDailyEmission: 0,
      explainContent: {
        explainText: 'Stafi staked ETH',
      },
    },
    {
      icon: stafiStakedETHLogo,
      name: 'rETH',
      stakingContract: getContracts().stafiRETHPool,
      tokenContract: getContracts()['stafi-staked-eth'],
      poolDailyEmission: 0,
      waiting: true,
    },
  ],
};

export interface LockedFarmingConfig {
  icon: string | [string, string];
  name: string;
  stakingContract: IContract;
  tokenContract: IContract;
  poolDailyEmission: number;
}

export const lockedModuleConfigs: LockedFarmingConfig[] = [
  {
    icon: stafiStakedETHLogo,
    name: 'AGI-WETH LP',
    stakingContract: getContracts().lockedAGIWETHLPPool,
    tokenContract: { ...getContracts().AGI, address: '0xed39eb8b3c81381988baa71a2eafba2282edabc4' },
    poolDailyEmission: 0,
  },
];
