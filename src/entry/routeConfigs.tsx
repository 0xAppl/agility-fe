import React from 'react';
// import { Docs } from '../page/Docs';
import { LiquidityDistribute } from '../page/LiquidityDistribute';
import { Farm } from '../page/Farm';
import { aUSDTrading } from '../page/aUSDrading';
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
      path: 'aUSDTrading',
      label: 'aUSD Trading',
      disabled: true,
      component: () => <div>aUSD Trading</div>,
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
