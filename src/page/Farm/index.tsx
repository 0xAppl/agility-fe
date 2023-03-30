import React, { useEffect } from 'react';
import cs from 'classnames';
import { tokenConfigs } from './tokenConfigs';
import style from './index.module.less';
import { TokenBox } from './TokenBox';
import { StatusBox } from './StatusBox';
import { VestBox } from './VestBox';
import { secondsToDHMS } from '../../utils/time';

const { tokenList, statusList, esAGIVestingConfig } = tokenConfigs;

export const Farm = () => {
  const [second, setSecond] = React.useState(12345678);
  const { days, hours, minutes, seconds } = secondsToDHMS(second);
  useEffect(() => {
    const timer = setInterval(() => {
      setSecond(second => second - 1);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <div className={style.farm_section}>
      {/* total  */}
      <div className={style.total_container}>TVL ??? ETH $???</div>

      {/* farm tokens */}
      <div className={cs(style.farm_sec_container, style.token_container)}>
        <div className={style.title}>Farm</div>
        <div className={style.rate_change}>
          {days} days {hours} hours {minutes} minutes {seconds} seconds $esAGI emission rate will decrease by 50%.
        </div>
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
        <div className={style.balance}>Balance {esAGIVestingConfig.balance.countText} $esAGI</div>
        <div className={style.box_container}>
          <VestBox data={esAGIVestingConfig} />
        </div>
      </div>
    </div>
  );
};
