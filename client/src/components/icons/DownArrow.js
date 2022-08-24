import React from 'react';
import defaultProps from './defaultProps';

const DownArrow = ({ width, height, fill }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 10 5"
    >
      <path fill={fill} d="M7 10l5 5 5-5z" transform="translate(-7 -10)" />
    </svg>
    
  );
};

DownArrow.defaultProps = defaultProps;

export default DownArrow;
