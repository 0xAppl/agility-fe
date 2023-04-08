/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react';
import cs from 'classnames';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { ReactComponent as ArrowIcon } from '../../assets/arrow.svg';
import style from './index.module.less';
import { Link } from 'react-router-dom';
import { notification } from 'antd';
import CustomSpin from '../spin';
import { pipe } from '../../utils/functional';
import { addingOnGoingAffix, capitalize } from '../../utils/string';

export const ClaimBtn = ({
  onClick,
  isLoading,
  disabled,
}: {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}) => {
  return (
    <div className={cs({ [style.btn]: true, [style.disabled]: disabled })} onClick={onClick}>
      {isLoading ? (
        <CustomSpin
          style={{
            marginRight: 8,
          }}
        />
      ) : (
        <ArrowIcon className={style.rotate280} />
      )}
      {`${isLoading ? 'Claiming' : 'Claim'}`} esAGI
    </div>
  );
};

export const RedeemBtn = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => {
  return (
    <div
      className={cs({
        [style.btn]: true,
        [style.disabled]: disabled,
      })}
      onClick={onClick}
    >
      <ArrowIcon className={style.rotate280} />
      Redeem
    </div>
  );
};

export const StakeBtn = ({
  onClick,
  styles,
  isLoading,
  children = 'stake',
  disabled,
}: {
  onClick: () => void;
  styles?: React.CSSProperties;
  isLoading?: boolean;
  children?: string;
  disabled?: boolean;
}) => {
  return (
    <div className={cs(style.btn, disabled ? style.disabled : '')} onClick={onClick} style={styles}>
      {isLoading ? (
        <CustomSpin
          style={{
            marginRight: 8,
          }}
        />
      ) : (
        <ArrowIcon />
      )}
      {isLoading ? addingOnGoingAffix(capitalize(children)) : capitalize(children)}
    </div>
  );
};

export const WithdrawBtn = ({
  onClick,
  children = 'Withdraw',
  isLoading,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
}) => {
  return (
    <div className={cs(style.btn, style.draw, disabled ? style.disabled : '')} onClick={onClick}>
      {isLoading ? (
        <CustomSpin
          style={{
            marginRight: 8,
            color: '#fff',
          }}
        />
      ) : (
        <ArrowIcon className={cs(style.arrow_white, style.rotate280)} />
      )}
      {children}
    </div>
  );
};

export const WithdrawAGIBtn = ({
  onClick,
  disabled,
  isLoading,
}: {
  onClick: () => void;
  disabled: boolean;
  isLoading?: boolean;
}) => {
  return (
    <div className={cs(style.btn, style.draw, disabled ? style.disabled : '')} onClick={onClick}>
      {isLoading ? (
        <CustomSpin
          style={{
            marginRight: 8,
            color: '#fff',
          }}
        />
      ) : (
        <ArrowIcon className={cs(style.arrow_white, style.rotate160)} />
      )}
      {isLoading ? 'Claiming' : 'Claim'} AGI
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
  return <button className={cs(style.btn)} {...props}></button>;
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
