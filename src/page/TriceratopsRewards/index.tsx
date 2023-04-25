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

const TriceratopsRewards = () => {
  const { userAGIBalance, userEsAGIBalance } = useGlobalStatsContext();
  const [redeemModalOpen, setRedeemModalOpen] = React.useState(false);
  const [stakeModalOpen, setStakeModalOpen] = React.useState(false);

  const countdown = useCountDown(1683520350000);

  const { days, hours, minutes, seconds } = secondsToDHMS(countdown / 1000);

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
        <FarmSectionWrapper extraClassName={style.bg_white}>
          <div className="title">Triceratops Rewards</div>
          <FarmSectionWrapper extraClassName={classNames(style.bg_purple, style.convert_inner)}>
            <h4>
              <span>
                Rewards Period Ends {days}d: {hours}h: {minutes}m: {seconds}s
              </span>
              &nbsp;
              <span>esAGI Potential Hold APR: 60%</span>
            </h4>
          </FarmSectionWrapper>
          <FarmSectionWrapper extraClassName={classNames(style.rewards_item_wrapper, style.bg_yellow)}>
            <FarmSectionWrapper extraClassName={style.rewards_item}>
              <span>#</span>
              <span>Rewards</span>
              <span>Rewards Amount</span>
              <span>Eligible Asset</span>
              <span>My Rewards</span>
              <span></span>
            </FarmSectionWrapper>
            <Tooltip title={'Rewards for esAGI Holders'} placement="bottom">
              <div>
                <FarmSectionWrapper extraClassName={classNames(style.rewards_item, style.bg_white)}>
                  <span>1</span>
                  <span>esAGI</span>
                  <span>150,000</span>
                  <span>esAGI</span>
                  <span>???</span>
                  <span>
                    <ClaimBtn disabled>Claim</ClaimBtn>
                  </span>
                </FarmSectionWrapper>
              </div>
            </Tooltip>

            <Tooltip title={'Rewards for Staking rETH(StaFi) on Farming'} placement="bottom">
              <div>
                <FarmSectionWrapper extraClassName={classNames(style.rewards_item, style.bg_white)}>
                  <span>2</span>
                  <span>FIS</span>
                  <span>5,500</span>
                  <span>rETH-StaFi</span>
                  <span>???</span>
                  <span>
                    <ClaimBtn disabled>Claim</ClaimBtn>
                  </span>
                </FarmSectionWrapper>
              </div>
            </Tooltip>
          </FarmSectionWrapper>
        </FarmSectionWrapper>
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
