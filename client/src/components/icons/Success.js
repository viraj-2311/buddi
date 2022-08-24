import React from 'react';
import defaultProps from "./defaultProps";

const Success = ({width, height}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 50 50">
      <path fill="#19913d" d="M27 2a25 25 0 1 0 25 25A25.009 25.009 0 0 0 27 2zm-5 37.5L9.5 27l3.525-3.525L22 32.425 40.975 13.45 44.5 17z" transform="translate(-2 -2)"/>
    </svg>
  );
};

Success.defaultProps = defaultProps;

export default Success;
