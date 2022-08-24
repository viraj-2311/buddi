import React from 'react';
import defaultProps from "./defaultProps";

const Trash = ({width, height, fill}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 14 18">
      <path fill={fill} d="M6 19a2.006 2.006 0 0 0 2 2h8a2.006 2.006 0 0 0 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z" transform="translate(-5 -3)"/>
    </svg>
  );
};

Trash.defaultProps = defaultProps;

export default Trash;
