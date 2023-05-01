/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  WagmiConfig,
  createClient,
  goerli,
  mainnet,
  configureChains,
  useQuery,
  useContractRead,
  useConnect,
  useAccount,
  useContractReads,
} from 'wagmi';
import 'react-toastify/dist/ReactToastify.css';
import style from './index.module.less';
import { routeConfigs } from './routeConfigs';
import { NavLine } from './NavLine';
import '../theme.less';

import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

import { InjectedConnector } from 'wagmi/connectors/injected';

import { GlobalStatsContext } from '../contexts/globalStatsContext';
import axios from 'axios';
import useTVL from '../hooks/useTVL';
import { formatEther, parseEther } from 'ethers/lib/utils.js';
import { getContracts } from '../page/Farm/tokenConfigs';
import { BigNumber } from 'ethers';
import { BigZero, bigNumberToDecimal } from '../utils/number';
import { ToastContainer } from 'react-toastify';
// import useGetTokenPriceFromLP from '@hooks/useGetTokenPriceFromLP';
import useGetTokenPriceFromLP from '@hooks/useGetTokenPriceFromLP';
import useReadContractNumber from '@hooks/useReadContractNumber';
import { Button } from 'antd';

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains([mainnet, goerli], [publicProvider()]);

const client = createClient({
  autoConnect: true,

  connectors: [
    new MetaMaskConnector({ chains }),
    new InjectedConnector({
      chains,
      options: {
        name: 'OKX Wallet',
        shimDisconnect: true,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: '3d8d3a0c9a64a94b80febc07f5ae4c9e',
      },
    }),
  ],
  provider,
  webSocketProvider,
});

const { list, home } = routeConfigs;

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  {
    hasError: boolean;
  }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <h1 style={{ padding: 32 }}>
          Oops! Something went wrong. <br />
          <Button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            Try Again
          </Button>
        </h1>
      );
    }

    return this.props.children;
  }
}

const Layout = ({ children }: any) => {
  const { address, isConnected } = useAccount();

  const { data, isFetching } = useQuery(
    ['ethPrice'],
    async () => {
      return await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,staked-ether,rocket-pool-eth,frax-ether,ankreth&vs_currencies=usd',
      );
    },
    {
      refetchInterval: 30000,
      keepPreviousData: true,
    },
  );

  const TVL = useTVL();

  const { data: userBalanceInfo } = useContractReads({
    contracts: [
      {
        ...getContracts().AGI,
        functionName: 'balanceOf',
        args: [address],
      },
      {
        ...getContracts().esAGI,
        functionName: 'balanceOf',
        args: [address],
      },
      {
        ...getContracts().esAGI,
        functionName: 'getUserRedeemsLength',
        args: [address],
      },
    ],
    enabled: isConnected,
    watch: true,
  });

  let AGIBalance = BigZero;
  let esAGIBalance = BigZero;
  let AGIRedeemingCount = BigZero;

  if (Array.isArray(userBalanceInfo) && userBalanceInfo.every(Boolean)) {
    AGIBalance = (userBalanceInfo[0] as any) ?? BigZero;
    esAGIBalance = (userBalanceInfo[1] as any) ?? BigZero;
    AGIRedeemingCount = (userBalanceInfo[2] as any) ?? BigZero;
  }

  const { data: publicData } = useContractReads<any, any, any, [BigNumber, [BigNumber, BigNumber, number], BigNumber]>({
    contracts: [
      {
        address: getContracts().AGI.address,
        abi: getContracts().AGI.abi,
        functionName: 'totalSupply',
        chainId: 1,
      },
      {
        ...getContracts().AGIWETHLP,
        functionName: 'getReserves',
        chainId: 1,
      },
      {
        ...getContracts().AGIWETHLP,
        functionName: 'totalSupply',
        chainId: 1,
      },
    ],
    watch: true,
  });

  const ethPrice = data?.data.ethereum.usd || 0;

  const tokenPrice =
    (bigNumberToDecimal(publicData?.[1]?.[1] ?? BigZero) / bigNumberToDecimal(publicData?.[1]?.[0] ?? BigZero)) *
    ethPrice;

  const LPPrice =
    (bigNumberToDecimal(publicData?.[1]?.[1] ?? BigZero) * ethPrice * 2) /
    bigNumberToDecimal(publicData?.[2] ?? BigNumber.from(1));

  return (
    <GlobalStatsContext.Provider
      value={{
        ethPrice,
        stETH: {
          price: data?.data['staked-ether']?.usd || 0,
        },
        fraxETH: {
          price: data?.data['rocket-pool-eth']?.usd || 0,
        },
        rETH: {
          price: data?.data['frax-ether']?.usd || 0,
        },
        ankrETH: {
          price: data?.data.ankreth?.usd || 0,
        },
        TVL,
        AGIPrice: tokenPrice,
        AGITotalSupply: (publicData?.[0] as BigNumber) ?? BigZero,
        userAGIBalance: AGIBalance,
        userEsAGIBalance: esAGIBalance,
        userAGIRedeemingCount: AGIRedeemingCount,
        AGIWETHLP: {
          totalSupply: (publicData?.[2] as BigNumber) ?? BigZero,
          price: LPPrice,
        },
      }}
    >
      <div className={style.container_body}>
        <NavLine />
        <div className={style.main_content_wrapper}>
          <Routes>
            <Route path="/" element={home} />
            {list
              .filter(r => {
                return !r.path.startsWith('https');
              })
              .map(route => (
                <Route path={route.path} element={route.component} key={route.path} />
              ))}
            <Route path="*" element={home} />
          </Routes>
          <ToastContainer hideProgressBar autoClose={5000} />
        </div>
      </div>
    </GlobalStatsContext.Provider>
  );
};

export default function App() {
  return (
    <WagmiConfig client={client}>
      <ErrorBoundary>
        <Layout></Layout>
      </ErrorBoundary>
    </WagmiConfig>
  );
}

let container: HTMLElement | null = null;
document.addEventListener('DOMContentLoaded', function (event) {
  if (container == null) {
    container = document.getElementById('root') as HTMLElement;
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
    );
  }
});
