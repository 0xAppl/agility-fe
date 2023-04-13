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
import { InjectedConnector } from 'wagmi/dist/connectors/injected';
import { GlobalStatsContext } from '../contexts/globalStatsContext';
import axios from 'axios';
import useTVL from '../hooks/useTVL';
import { formatEther, parseEther } from 'ethers/lib/utils.js';
import { getContracts } from '../page/Farm/tokenConfigs';
import { type BigNumber } from 'ethers';
import { bigNumberToDecimal } from '../utils/number';
import { ToastContainer } from 'react-toastify';
// import useGetTokenPriceFromLP from '@hooks/useGetTokenPriceFromLP';
import { UniLpAbi } from '../page/Farm/abis';
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
    new WalletConnectConnector({
      chains,
      options: {
        projectId: '3d8d3a0c9a64a94b80febc07f5ae4c9e',
      },
    }),
    // new InjectedConnector({
    //   chains,
    //   options: {
    //     name: 'Injected',
    //     shimDisconnect: true,
    //   },
    // }),
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
          Something went wrong.{' '}
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
  const { isConnected } = useAccount();

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

  const tokenPrice = useGetTokenPriceFromLP(
    data?.data.ethereum.usd || 0,
    getContracts().AGIETHTradingPool.address,
    getContracts().AGIETHTradingPool.abi,
    'getReserves',
  );

  const { data: AGITotalSupply } = useReadContractNumber({
    address: getContracts().AGI.address,
    abi: getContracts().AGI.abi,
    functionName: 'totalSupply',
    enabled: true,
  });

  return (
    <GlobalStatsContext.Provider
      value={{
        ethPrice: data?.data.ethereum.usd || 0,
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
        AGITotalSupply,
      }}
    >
      <div className={style.container_body}>
        <NavLine />
        <div className={style.main_content_wrapper}>
          <Routes>
            <Route path="/" element={home} />
            {list.map(route => (
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
