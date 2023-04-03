import React, { useCallback } from 'react';
import cs from 'classnames';
import { RedeemBtn, WithdrawAGIBtn } from '../../../components/Btns';
import { API } from '../../../Api';
import style from './index.module.less';
import RedeemModal from './redeemModal';

interface IVest {
  typeText: string;
  countText: string;
}

export interface VestData {
  balance: IVest;
  vestingDays: IVest;
  AGIList: IVest[];
}

export const VestBox = ({ data }: { data: VestData }) => {
  const { balance, AGIList } = data;

  const [modalOpen, setModalOpen] = React.useState(false);

  const onWithDrawClick = useCallback(() => {
    API.withdraw();
  }, []);
  const onClickRedeem = useCallback(() => {
    setModalOpen(true);
  }, []);

  return (
    <>
      {/* balance  */}
      <div className={cs(style.vest_box, style.small)}>
        <div className={style.vest_inner_box}>
          {/* <div>
            <div className={style.type}> {balance.typeText}</div>
            <div className={style.count}>{balance.countText}</div>
          </div> */}
          {/* <div>
            <div className={style.type}> {vestingDays.typeText}</div>
            <div className={style.count}>{vestingDays.countText}</div>
          </div> */}
        </div>
        <RedeemBtn onClick={onClickRedeem} />
      </div>

      {/* input output */}
      <div className={cs(style.vest_box, style.big)}>
        {AGIList.map(vest => (
          <div className={style.vest_inner_box} key={vest.typeText}>
            <div className={style.type}> {vest.typeText}</div>
            <div className={style.count}>{vest.countText}</div>
          </div>
        ))}
        <div>
          <WithdrawAGIBtn onClick={onWithDrawClick} />
        </div>
      </div>
      <RedeemModal isModalOpen={modalOpen} setIsModalOpen={setModalOpen}></RedeemModal>
    </>
  );
};
