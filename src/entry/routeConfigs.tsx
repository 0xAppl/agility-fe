import React from 'react';
// import { Docs } from '../page/Docs';
import { LiquidityDistribute } from '../page/LiquidityDistribute';
import { Farm } from '../page/Farm';
import { XUSDTrading } from '../page/XUSDTrading';
import LandingPage from '../page/Landing';

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
      path: 'xUSDTrading',
      label: 'xUSD Trading',
      disabled: true,
      component: <XUSDTrading />,
    },
    {
      path: 'farm',
      label: 'Farm',
      disabled: false,
      component: <Farm />,
    },
    // {
    //   path: 'Docs',
    //   label: 'Docs',
    //   disabled: false,
    //   component: <Docs />,
    // },
  ],
};
