import React from 'react';
import defaultProps from './defaultProps';

const Wallet = ({ width, height, fill }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 34.833 33'
    >
      <defs>
        <linearGradient
          id='d6rarc0gga'
          x2='1'
          y1='.5'
          y2='.5'
          gradientUnits='objectBoundingBox'
        >
          <stop offset='0' stopColor='#6e52fc' />
          <stop offset='1' stopColor='#52a0f8' />
        </linearGradient>
      </defs>
      <path
        fill={fill}
        d='M36 30.5v1.833A3.677 3.677 0 0 1 32.333 36H6.667A3.666 3.666 0 0 1 3 32.333V6.667A3.666 3.666 0 0 1 6.667 3h25.666A3.677 3.677 0 0 1 36 6.667V8.5H19.5a3.666 3.666 0 0 0-3.667 3.667v14.666A3.666 3.666 0 0 0 19.5 30.5zm-16.5-3.667h18.333V12.167H19.5zm7.333-4.583a2.75 2.75 0 1 1 2.75-2.75 2.746 2.746 0 0 1-2.75 2.75z'
        transform='translate(-3 -3)'
      />
    </svg>
  );
};

Wallet.defaultProps = defaultProps;

export default Wallet;
