import React, { useState } from 'react';
import cs from 'classnames';
import { getContracts, moduleConfigs } from './tokenConfigs';
import style from './index.module.less';
import { TokenBox } from './TokenBox';
import { StatusBox } from './StatusBox';
import { VestBox } from './VestBox';
import CountDown from './CountDown';

import { useAccount, useProvider } from 'wagmi';
import { useGlobalStatsContext } from '../../contexts/globalStatsContext';
import { commas, numberToPrecision } from '@utils/number';
import useReadContractNumber from '@hooks/useReadContractNumber';
import PageWrapper from '@components/pageWrapper';
import FarmSectionWrapper from '@components/farmSectionWrapper';

const { tokenList } = moduleConfigs;

export const Farm = () => {
  const contract = getContracts('0x1');
  const provider = useProvider();
  const { connector } = useAccount();

  const { isConnected, address } = useAccount();
  const [signer, setSigner] = useState<any>(null);

  const { TVL, ethPrice, AGIPrice } = useGlobalStatsContext();

  return (
    <PageWrapper>
      {/* total  */}
      <div className={style.total_container}>
        TVL ${commas(TVL)} AGI ${numberToPrecision(AGIPrice, 3)}
      </div>

      {/* farm tokens */}
      <div className={cs(style.farm_sec_container, style.token_container)}>
        <div className={style.title}>Farm</div>
        <CountDown />
        <div className={style.box_container}>
          {tokenList.map((token, idx) => (
            <TokenBox token={token} key={idx} />
          ))}
        </div>
      </div>

      {/* farm status */}
      <div className={cs(style.farm_sec_container, style.status_container)}>
        <div className={style.title}>Status</div>
        <div className={style.box_container}>
          <StatusBox typeText={'TVL'} />
          <StatusBox typeText={'AGI'} />
        </div>
      </div>

      {/* Vesting  */}
      <VestBox />
    </PageWrapper>
  );
};
