import React from 'react';
import defaultProps from './defaultProps';

const Download = ({ width, height, stroke, strokeWidth }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 19.873 20.436'
    >
      <path
        fill='none'
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M3 15.311v4.081a2.075 2.075 0 0 0 2.1 2.04h14.676a2.069 2.069 0 0 0 2.1-2.04v-4.081m-4.194-5.149l-5.243 5.1-5.243-5.1m5.243 3.877V2'
        transform='translate(-2.5 -1.496)'
      />
    </svg>
  );
};

Download.defaultProps = defaultProps;

export default Download;
