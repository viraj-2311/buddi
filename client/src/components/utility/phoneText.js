import React from 'react';
import NumberFormat from 'react-number-format';

export default ({ value, ...rest }) => {
  return (
    <NumberFormat format="+1 (###) ###-####" displayType="text" value={value} />
  )
};
