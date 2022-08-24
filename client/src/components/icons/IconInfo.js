import React from 'react';
import defaultProps from './defaultProps';

const IconInfo = ({ width, height, fill }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 20 20'
    >
      <path
        fill={fill}
        d='M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-6h2zm0-8h-2V7h2z'
        transform='translate(-2 -2)'
      />
    </svg>
  );
};

IconInfo.defaultProps = defaultProps;

export default IconInfo;
