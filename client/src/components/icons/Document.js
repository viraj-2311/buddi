import React from 'react';
import defaultProps from './defaultProps';

const Document = ({ width, height, fill }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 16 12.8'
    >
      <path
        fill={fill}
        d='M8.4 4H3.6a1.6 1.6 0 0 0-1.592 1.6L2 15.2a1.6 1.6 0 0 0 1.6 1.6h12.8a1.6 1.6 0 0 0 1.6-1.6v-8a1.6 1.6 0 0 0-1.6-1.6H10z'
        transform='translate(-2 -4)'
      />
    </svg>
  );
};
Document.defaultProps = {
  ...defaultProps,
  fill: '#fff',
};

export default Document;
