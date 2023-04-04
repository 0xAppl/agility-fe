/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from 'react';
import cs from 'classnames';
import { getContracts, tokenConfigs } from './tokenConfigs';
import style from './index.module.less';
import { TokenBox } from './TokenBox';
import { StatusBox } from './StatusBox';
import { VestBox } from './VestBox';
import CountDown from './CountDown';
// import ContractContext from '../../contexts/contractContext';
import { useAccount, useProvider } from 'wagmi';
import { useGlobalStatsContext } from '../../contexts/globalStatsContext';
import { numberToPrecision } from '@utils/number';
import useReadContractNumber from '@hooks/useReadContractNumber';

// const s = fetchSigner();

const { tokenList, statusList, esAGIVestingConfig } = tokenConfigs;

export const Farm = () => {
  const contract = getContracts('0x1');
  const provider = useProvider();
  const { connector } = useAccount();
  // connector?.getProvider();
  const { isConnected, address } = useAccount();
  const [signer, setSigner] = useState<any>(null);

  const { TVL, ethPrice } = useGlobalStatsContext();

  const { data: esAGIBalance } = useReadContractNumber({
    ...getContracts().esAGI,
    functionName: 'balanceOf',
    args: [address],
  });

  return (
    // <ContractContext.Provider
    //   value={{
    //     contracts: {
    //       ETHContract: new ethers.Contract(contract.ETHPool.address, contract.ETHPool.abi, provider),
    //     },
    //   }}
    // >
    <div className={style.farm_section}>
      {/* total  */}
      <div className={style.total_container}>
        TVL ${numberToPrecision(TVL * ethPrice, 0)} ETH ${ethPrice || '???'}
      </div>

      {/* farm tokens */}
      <div className={cs(style.farm_sec_container, style.token_container)}>
        <div className={style.title}>Farm</div>
        <CountDown />
        <div className={style.box_container}>
          {tokenList.map(token => (
            <TokenBox token={token} key={token.name} />
          ))}
        </div>
      </div>

      {/* farm status */}
      <div className={cs(style.farm_sec_container, style.status_container)}>
        <div className={style.title}>Status</div>
        <div className={style.box_container}>
          {statusList.map(status => (
            <StatusBox data={status} key={status.typeText} />
          ))}
        </div>
      </div>

      {/* Vesting  */}
      <div className={cs(style.farm_sec_container, style.vesting_container)}>
        <div className={style.title}>esAGI Vesting</div>
        <div className={style.balance}>Balance {numberToPrecision(esAGIBalance)} $esAGI</div>
        <div className={style.box_container}>
          <VestBox data={esAGIVestingConfig} />
        </div>
      </div>
    </div>
    // </ContractContext.Provider>
  );
};
