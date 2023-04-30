import FarmSectionWrapper from '@components/farmSectionWrapper';
import PageWrapper from '@components/pageWrapper';
import style from './index.module.less';
import React from 'react';
import { useGlobalStatsContext } from 'src/contexts/globalStatsContext';
import { bigNumberToDecimal } from '@utils/number';
import { ClaimBtn, RedeemBtn, StakeBtn } from '@components/Btns';
import RedeemModal from '@components/Modals/redeemModal';
import ConvertModal from '@components/Modals/convertModal';
import { VestBox } from '@page/Farm/VestBox';
import classNames from 'classnames';
import { Tooltip } from 'antd';

import useCountDown from '@hooks/useCountdown';
import { secondsToDHMS } from '@utils/time';
import Airdrop from './Airdrop';

const TriceratopsRewards = () => {
  const { userAGIBalance, userEsAGIBalance } = useGlobalStatsContext();
  const [redeemModalOpen, setRedeemModalOpen] = React.useState(false);
  const [stakeModalOpen, setStakeModalOpen] = React.useState(false);

  return (
    <>
      <PageWrapper>
        <FarmSectionWrapper>
          <div className="title">AGI &lt;&gt; esAGI</div>
          <FarmSectionWrapper extraClassName={style.convert_inner}>
            <h2>Balance</h2>
            <h2
              style={{
                flexGrow: 1,
                textAlign: 'left',
              }}
            >
              $AGI: {bigNumberToDecimal(userAGIBalance, 6)} $esAGI: {bigNumberToDecimal(userEsAGIBalance, 6)}
            </h2>
            <StakeBtn
              onClick={() => {
                setStakeModalOpen(true);
              }}
            ></StakeBtn>
            <RedeemBtn
              onClick={() => {
                setRedeemModalOpen(true);
              }}
              disabled={userEsAGIBalance.isZero()}
            ></RedeemBtn>
          </FarmSectionWrapper>
        </FarmSectionWrapper>
        <Airdrop />
        <VestBox
          disableRedeem
          redeemInfoFilter={redeemInfo => {
            if (redeemInfo === null) return false;
            return redeemInfo[0].eq(redeemInfo[1]);
          }}
        ></VestBox>
      </PageWrapper>
      <RedeemModal
        isModalOpen={redeemModalOpen}
        setIsModalOpen={setRedeemModalOpen}
        esAGIBalance={userEsAGIBalance}
        lockReemPeriod={14}
      ></RedeemModal>
      <ConvertModal isModalOpen={stakeModalOpen} setIsModalOpen={setStakeModalOpen}></ConvertModal>
    </>
  );
};
export default TriceratopsRewards;
