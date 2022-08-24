import React from 'react';
import defaultProps from "./defaultProps";

const Plus = ({width, height, fill}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16.31 14">
      <path fill={fill} d="M21.31 13h-6.99v6h-2.33v-6H5v-2h6.99V5h2.33v6h6.99z" transform="translate(-5 -5)"/>
    </svg>
  );
};

Plus.defaultProps = defaultProps;

export default Plus;
