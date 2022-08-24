import React from 'react';
import defaultProps from './defaultProps';

const NextArrow = ({ width, height, fill }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 30 30'
    >
      <path
        fill={fill}
        d='M19 4l-2.644 2.644 10.463 10.481H4v3.75h22.819L16.356 31.356 19 34l15-15z'
        transform='translate(-503 -825) translate(499 821)'
      />
    </svg>
  );
};

NextArrow.defaultProps = defaultProps;

export default NextArrow;
