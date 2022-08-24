import React from 'react';
import defaultProps from "./defaultProps";

const Status = ({width, height, fill, stroke}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 17 17">
      <g transform="translate(-946 -368)">
        <g fill="none" stroke={stroke} strokeWidth={2} transform="translate(946 368)">
          <circle cx="8.5" cy="8.5" r="8.5" stroke="none"/>
          <circle cx="8.5" cy="8.5" r="7.5"/>
        </g>
        <circle cx="4.5" cy="4.5" r="4.5" fill={fill} transform="translate(950 372)"/>
      </g>
    </svg>
  );
};

Status.defaultProps = defaultProps;

export default Status;
