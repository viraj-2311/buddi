import _ from 'lodash';
import { amountDecimal } from './appConstant';
export const INFINITY_LENGTH = 999999999999999999;

export const formatInputNumber = (
  inputAmount,
  decimalCount = amountDecimal
) => {
  try {
    let amount = inputAmount.replace(/,/g, '');
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? amountDecimal : decimalCount;

    if (!isNaN(amount) && Math.abs(amount) < INFINITY_LENGTH) {
      let formatNumber = amount
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      let splitAmount = formatNumber.split('.');
      if (splitAmount[1] && splitAmount[1].length > decimalCount) {
        let pence = splitAmount[1].slice(0, 2);
        return splitAmount[0] + '.' + pence;
      } else {
        return formatNumber;
      }
    }
  } catch (e) {
    return '';
  }
};

export const formatMoney = (
  amountInput,
  decimalCount = amountDecimal,
  decimal = '',
  thousands = ','
) => {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? amountDecimal : decimalCount;
    let amount = amountInput.toString().replace(/,/g, '');
    const negativeSign = amount < 0 ? '-' : '';

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    let evenMoney =
      negativeSign +
      (j ? i.substr(0, j) + thousands : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands);
    let pence = decimalCount
      ? decimal +
        Math.abs(amount - i)
          .toFixed(decimalCount)
          .slice(2)
      : '';
    return {
      evenMoney: evenMoney,
      pence: pence,
    };
  } catch (e) {
    return {
      evenMoney: 0,
      pence: 0,
    };
  }
};

export const displayFormatMoney = (
  amountInput,
  decimalCount = amountDecimal,
  decimal = '',
  thousands = ','
) => {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? amountDecimal : decimalCount;
    let amount = amountInput.toString().replace(/,/g, '');
    const negativeSign = amount < 0 ? '-' : '';

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    let evenMoney =
      negativeSign +
      (j ? i.substr(0, j) + thousands : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands);
    let pence = decimalCount
      ? decimal +
        Math.abs(amount - i)
          .toFixed(decimalCount)
          .slice(2)
      : '';
    return evenMoney + '.' + pence;
  } catch (e) {
    return '0.00';
  }
};

export const formatAmount = (amount, decimalCount = amountDecimal) => {
  return amount ? amount.toFixed(decimalCount) : 0;
};

export const formatOriginalNumber = (numberValue) => {
  try {
    const convertValue = numberValue.toString();
    let value = convertValue.replace('$', '');
    value = value.replace('-', '');
    value = value.replace(' ', '');
    return value.replace(/,/g, '');
  } catch (e) {
    return 0;
  }
};

export const convertCurrencyToDollar = (numberValue) => {
  try {
    const convertValue = numberValue.toString();
    let value = convertValue.replace('$', '');
    value = value.replace(/[$-,]/g, '');
    value = parseFloat(value) / 100;
    return value;
  } catch (e) {
    return 0;
  }
};
export const convertCurrencyToCent = (numberValue) => {
  try {
    let value = numberValue * 100;
    return value.toFixed(0);
  } catch (e) {
    return 0;
  }
};
