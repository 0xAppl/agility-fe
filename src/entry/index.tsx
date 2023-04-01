import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WagmiConfig, createClient, goerli, mainnet, configureChains } from 'wagmi';
import style from './index.module.less';
import { routeConfigs } from './routeConfigs';
import { NavLine } from './NavLine';
import '../theme.less';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { InjectedConnector } from 'wagmi/dist/connectors/injected';

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli],
  [infuraProvider({ apiKey: '984b463612ff47fc93c9607b89e96ee8' }), publicProvider()],
);

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

const Layout = ({ children }: any) => {
  // const s = useMatch();
  // console.log(s);
  return (
    <div className={style.container_body}>
      <NavLine />
      <div className={style.main_content_wrapper}>{children}</div>
    </div>
  );
};

export default function App() {
  return (
    <WagmiConfig client={client}>
      <Layout>
        <Routes>
          <Route path="/" element={home} />
          {list.map(route => (
            <Route path={route.path} element={route.component} key={route.path} />
          ))}
          <Route path="*" element={home} />
        </Routes>
      </Layout>
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
