/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { BigNumber, FixedNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils.js';
import { trimTailingZeros } from './string';

export function expandTo18Decimals(n: number) {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18));
}

export const BigZero = BigNumber.from(0);

export const bigNumberToDecimal = (bigNumber = BigZero, toPrecision?: boolean | number) => {
  const result = Number(formatEther(bigNumber));
  return toPrecision === true
    ? numberToPrecision(result)
    : toPrecision !== undefined && toPrecision !== false
    ? numberToPrecision(result, toPrecision)
    : result;
};

export const numberToPrecision = (number: number, precision: number = 3) => {
  return precision === 0 ? number.toFixed(0) : Number(trimTailingZeros(number.toFixed(precision)));
};

export const commas = (x: number) => {
  return x
    .toFixed(0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
