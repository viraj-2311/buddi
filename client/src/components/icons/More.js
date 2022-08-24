import React from 'react';
import defaultProps from "./defaultProps";

const More = ({width, height, fill}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16 4">
      <path fill={fill} d="M6 10a2 2 0 1 0 2 2 2.006 2.006 0 0 0-2-2zm12 0a2 2 0 1 0 2 2 2.006 2.006 0 0 0-2-2zm-6 0a2 2 0 1 0 2 2 2.006 2.006 0 0 0-2-2z" transform="translate(-4 -10)"/>
    </svg>
  );
};

More.defaultProps = {
  width: 16,
  height: 4,
  fill: '#2f2e50'
};

export default More;
