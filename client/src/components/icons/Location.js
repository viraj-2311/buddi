import React from 'react';
import defaultProps from "./defaultProps";

const Location = ({width, height, fill}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 14 20">
      <path fill={fill} d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5z" transform="translate(-5 -2)"/>
    </svg>
  );
};

Location.defaultProps = defaultProps;

export default Location;
