import React from 'react';
import defaultProps from './defaultProps';

const BackArrow = ({ width, height, fill }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 30 30'
    >
      <path
        fill={fill}
        d='M19 4l2.644 2.644-10.463 10.481H34v3.75H11.181l10.463 10.481L19 34 4 19z'
        transform='translate(-4 -4)'
      />
    </svg>
  );
};

BackArrow.defaultProps = defaultProps;

export default BackArrow;
