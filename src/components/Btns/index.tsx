import React from 'react';
import cs from 'classnames';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { ReactComponent as ArrowIcon } from '../../assets/arrow.svg';
import style from './index.module.less';
import { Link } from 'react-router-dom';
import { notification } from 'antd';

export const ClaimBtn = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className={style.btn} onClick={onClick}>
      <ArrowIcon className={style.rotate280} />
      Claim esAGI
    </div>
  );
};

export const RedeemBtn = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className={style.btn} onClick={onClick}>
      <ArrowIcon className={style.rotate280} />
      Redeem ( only available when theres available esAGI, when esAGI = 0 || esAGI is vesting, this button is
      unavailable)
    </div>
  );
};

export const StakeBtn = ({ onClick, styles }: { onClick: () => void; styles?: React.CSSProperties }) => {
  return (
    <div className={style.btn} onClick={onClick} style={styles}>
      <ArrowIcon />
      Stake
    </div>
  );
};

export const WithdrawBtn = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className={cs(style.btn, style.draw)} onClick={onClick}>
      <ArrowIcon className={cs(style.arrow_white, style.rotate280)} />
      Withdraw
    </div>
  );
};

export const WithdrawAGIBtn = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className={cs(style.btn, style.draw)} onClick={onClick}>
      <ArrowIcon className={cs(style.arrow_white, style.rotate160)} />
      Withdraw AGI
    </div>
  );
};

export const DocsButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div
      className={cs(style.btn, style.fs_lg)}
      onClick={onClick}
      style={{
        width: 128,
      }}
    >
      <ArrowIcon className={cs(style.rotate280)} />
      Docs
    </div>
  );
};

export const CommonButton: React.FC<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = props => {
  return <button className={cs(style.btn, style.fs_lg)} {...props}></button>;
};

const openNotification = () => {
  notification.open({
    message: 'Coming soon!',
  });
};

export const LaunchAppButton: React.FC = () => {
  return (
    <Link
      to={'/farm'}
      style={{
        display: 'inline-flex',
      }}
      onClick={e => {
        e.preventDefault();
        openNotification();
      }}
    >
      <div
        className={cs(style.btn, style.fs_lg, style.color_gray)}
        style={{
          width: 'unset',
        }}
      >
        <ArrowIcon className={cs(style.rotate280, style.color_gray)} />
        Launch App
      </div>
    </Link>
  );
};
