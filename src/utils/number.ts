/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { BigNumber, FixedNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils.js';
import { trimTailingZeros } from './string';

export function expandTo18Decimals(n: number) {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18));
}

export const BigZero = BigNumber.from(0);

export function bigNumberToDecimal(bigNumber = BigZero, toPrecision?: boolean | number) {
  const result = Number(formatEther(bigNumber));
  if (typeof toPrecision === 'boolean' && toPrecision) {
    return numberToPrecision(result);
  }
  if (typeof toPrecision === 'number') {
    return numberToPrecision(result, toPrecision);
  }
  if (typeof toPrecision === 'undefined') {
    return result;
  }
  return result;
}

export const numberToPrecision = (number: number, precision: number = 3) => {
  return precision === 0 ? Number(number.toFixed(0)) : Number(trimTailingZeros(number.toFixed(precision)));
};

export const commas = (x: number) => {
  return x
    .toFixed(0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
