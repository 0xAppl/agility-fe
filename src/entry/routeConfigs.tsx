import React from 'react';
// import { Docs } from '../page/Docs';
import { LiquidityDistribute } from '../page/LiquidityDistribute';
import { Farm } from '../page/Farm';
import { aUSDTrading as AUSDTrading } from '../page/aUSDrading';
import LandingPage from '../page/Landing';
import TriceratopsRewards from '@page/TriceratopsRewards';
import { globalConfig } from '@page/globalConfig';

const { twitterHref, discordHref, docsHref } = globalConfig;

export const routeConfigs = {
  home: <LandingPage />,
  list: [
    {
      path: 'LiquidityDistribute',
      label: 'Liquidity Distribute',
      disabled: true,
      component: <LiquidityDistribute />,
    },
    {
      path: 'aUSDTrading',
      label: 'aUSD Trading',
      disabled: true,
      component: <AUSDTrading />,
    },
    {
      path: 'farm',
      label: 'Farm',
      disabled: false,
      component: <Farm />,
    },
    {
      path: 'https://app.uniswap.org/#/swap?outputCurrency=0x5f18ea482ad5cc6bc65803817c99f477043dce85',
      label: 'Buy $AGI',
    },
    {
      path: 'triceratops',
      label: 'Triceratops Rewards',
      disabled: false,
      component: <TriceratopsRewards />,
    },
    {
      path: docsHref,
      label: 'Docs',
    },
    // {
    //   path: 'Docs',
    //   label: 'Docs',
    //   disabled: false,
    //   component: <Docs />,
    // },
  ],
};
