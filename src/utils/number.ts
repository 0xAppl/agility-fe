import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils.js';
import { trimTailingZeros } from './string';

export function expandTo18Decimals(n: number) {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18));
}

export const BigZero = BigNumber.from(0);

export const bigNumberToDecimal = (bigNumber = BigZero) => {
  return Number(formatEther(bigNumber));
};

export const numberToPrecision = (number: number, precision: number = 3) => {
  return precision === 0 ? number.toFixed(0) : Number(trimTailingZeros(number.toFixed(precision)));
};
