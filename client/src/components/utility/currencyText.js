import React from 'react';
import NumberFormat from 'react-number-format';

export default ({ symbol = '$', value, ...rest }) => {
  return (
    <NumberFormat
      prefix={symbol}
      thousandSeparator={true}
      decimalScale={2}
      fixedDecimalScale={true}
      displayType="text"
      value={value}
      {...rest}
    />
  )
};
