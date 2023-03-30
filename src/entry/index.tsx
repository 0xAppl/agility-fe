import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WagmiConfig, createClient } from 'wagmi';
import { providers } from 'ethers';
import style from './index.module.less';
import { routeConfigs } from './routeConfigs';
import { NavLine } from './NavLine';

const client = createClient({
  autoConnect: true,
  provider:
    window.ethereum !== undefined
      ? new providers.Web3Provider(window.ethereum as never)
      : new providers.JsonRpcProvider('https://mainnet.infura.io/v3/435ae80781944e3585e8b13e664a234c'),
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
