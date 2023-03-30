import React from 'react';
import cs from 'classnames';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { ReactComponent as ArrowIcon } from '../../assets/arrow.svg';
import style from './index.module.less';
import { Link } from 'react-router-dom';

export const ClaimBtn = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className={style.btn} onClick={onClick}>
      <ArrowIcon className={style.rotate280} />
      Claim
    </div>
  );
};

export const StakeBtn = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className={style.btn} onClick={onClick}>
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

export const LaunchAppButton: React.FC = () => {
  return (
    <Link
      to={'/farm'}
      style={{
        display: 'inline-flex',
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
