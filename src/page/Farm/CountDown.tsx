import React from 'react';

import useCountDown from '../../hooks/useCountdown';
import { secondsToDHMS } from '../../utils/time';
import style from './index.module.less';
import { havlingTime } from './tokenConfigs';

const CountDown = () => {
  const countDown = useCountDown(havlingTime);
  const { days, hours, minutes, seconds } = secondsToDHMS(Math.round(countDown / 1000));
  return (
    <div className={style.rate_change}>
      {days} days {hours} hours {minutes} minutes {seconds} seconds $esAGI emission rate will decrease by 50%.
    </div>
  );
};

export default CountDown;
