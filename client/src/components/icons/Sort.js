import React from 'react';
import defaultProps from './defaultProps';

const Sort = ({ width, height }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 9.18 18"
    >
      <path
        fill="#2f2e50"
        d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15z"
        transform="translate(-7.41 -3)"
      />
    </svg>
  );
};

Sort.defaultProps = defaultProps;

export default Sort;
