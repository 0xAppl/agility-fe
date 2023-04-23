/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Link, useLocation } from 'react-router-dom';
import { Button, Modal, Tooltip } from 'antd';
import logoSvg from '../../assets/logo.svg';
import logoSvgSimplified from '../../assets/agility_logo.svg';

import disconnectSvg from '../../assets/disconnect.svg';

import walletSvg from '../../assets/wallet.svg';
import twitterSvg from '../../assets/twitter.svg';
import inviteSvg from '../../assets/invite.svg';

import metamaskLogo from '../../assets/wallets/metamask.png';
import walletConnectLogo from '../../assets/wallets/walletconnect.png';
import okx from '../../assets/wallets/okx.png';

import { routeConfigs } from '../routeConfigs';
import { globalConfig } from '../../page/globalConfig';
import { shortenWalletAddress } from '../../utils/string';
import style from './index.module.less';
import Hamburger from '../../components/hamburger';
import classNames from 'classnames';

import { CommonButton } from '../../components/Btns';

const { twitterHref, discordHref, docsHref } = globalConfig;

const { list } = routeConfigs;

const walletLogoMapping: Record<string, string> = {
  MetaMask: metamaskLogo,
  WalletConnect: walletConnectLogo,
  'OKX Wallet': okx,
};

export const NavLine = () => {
  const { pathname } = useLocation();

  const [activated, setActivated] = React.useState(false);

  const [connectModalOpen, setConnectModalOpen] = React.useState(false);

  const { address, isConnected } = useAccount();
  // const { connect } = useConnect({
  //   connector: new InjectedConnector(),
  // });
  const { disconnect } = useDisconnect();
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();

  useEffect(() => {
    if (isConnected) {
      setConnectModalOpen(false);
    }
  }, [isConnected]);

  // const { data: ensAvatar } = useEnsAvatar({ address });
  // const { data: ensName } = useEnsName({ address });

  const lists: React.ReactElement[] = list.map(route =>
    route.path.startsWith('https') ? (
      <span className={classNames(style.nav_route)} key={route.label}>
        <a href={route.path} className={style.icon_href} target="_blank" rel="noreferrer">
          {route.label}
        </a>
      </span>
    ) : (
      <span
        className={classNames(style.nav_route, {
          [style.disabled]: route.disabled,
          [style.active]: pathname === `/${route.path}`,
        })}
        key={route.path}
      >
        {route.disabled ? route.label : <Link to={`/${route.path}`}>{route.label}</Link>}
      </span>
    ),
  );

  if (pathname === '/') return null;

  return (
    <>
      <div className={style.nav_wrapper}>
        <div className={style.logo}>
          <Link to={`/`}>
            <img src={logoSvg} alt="Logo" />
            <img src={logoSvgSimplified} alt="Logo" />
          </Link>
        </div>
        <div className={style.nav_route_wrapper}>{lists}</div>

        <div className={style.right_nav}>
          <div className={style.wallet_icon}>
            <img src={walletSvg} alt="wallet" className={style.icon_href} />
            {/* {ensAvatar ? <img src={ensAvatar} alt="ENS Avatar" /> : null} */}
            {isConnected ? (
              <>
                {shortenWalletAddress(address)}&nbsp;
                <Button
                  onClick={() => {
                    disconnect();
                  }}
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  setConnectModalOpen(true);
                }}
              >
                Connect Wallet
              </Button>
            )}
          </div>
          <Tooltip title={'Twitter'}>
            <a href={twitterHref} className={style.icon_href} target="_blank" rel="noreferrer">
              <img src={twitterSvg} alt="twitter" />
            </a>
          </Tooltip>
          <Tooltip title={'Discord'}>
            <a href={discordHref} className={style.icon_href} target="_blank" rel="noreferrer">
              <img src={inviteSvg} alt="discord" />
            </a>
          </Tooltip>
          <Tooltip title={'Snapshot'}>
            <a href={globalConfig.snapshotHref} className={style.icon_href} target="_blank" rel="noreferrer">
              <img
                src={'https://ccgateway.infura-ipfs.io/ipfs/QmZDQFEJoRH8Cvk1bEo3n4we2bxAXrPN3PH3Stfv7oEd33'}
                alt="discord"
              />
            </a>
          </Tooltip>
          <Hamburger activated={activated} setActivated={setActivated} />
        </div>
      </div>
      <div
        className={classNames({
          [style.mobileMenu]: true,
          [style.active]: activated,
        })}
      >
        {lists}
      </div>
      <Modal
        open={connectModalOpen && !isConnected}
        onCancel={() => {
          setConnectModalOpen(false);
        }}
        transitionName={''}
        footer={null}
        title="Select Wallet"
        bodyStyle={{
          textAlign: 'center',
        }}
        width={400}
      >
        <div className={style.connectors}>
          {connectors.map(connector => (
            <CommonButton
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => {
                connect({ connector });
                if (connector.name === 'WalletConnect') {
                  setConnectModalOpen(false);
                }
                // setConnectModalOpen(false);
              }}
              style={{
                width: 'auto',
                marginRight: 8,
              }}
            >
              <img src={walletLogoMapping[connector.name]} alt="" />
              {connector.name}
              {!connector.ready && ' (unsupported)'}
              {isLoading && connector.id === pendingConnector?.id && ' (connecting)'}
            </CommonButton>
          ))}
        </div>
      </Modal>
    </>
  );
};
