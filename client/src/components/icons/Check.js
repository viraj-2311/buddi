import React from 'react';
import defaultProps from "./defaultProps";

const Check = ({width, height, fill}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 17.59 13.41">
      <path fill={fill} d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" transform="translate(-3.41 -5.59)"/>
    </svg>
  );
};

Check.defaultProps = defaultProps;

export default Check;
