import React from 'react';
import defaultProps from "./defaultProps";

const Declined = ({width, height}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 20 20">
      <path fill="#fff" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zM4 12a8 8 0 0 1 8-8 7.9 7.9 0 0 1 4.9 1.69L5.69 16.9A7.9 7.9 0 0 1 4 12zm8 8a7.9 7.9 0 0 1-4.9-1.69L18.31 7.1A7.9 7.9 0 0 1 20 12a8 8 0 0 1-8 8z" transform="translate(-2 -2)"/>
    </svg>
  );
};

Declined.defaultProps = defaultProps;

export default Declined;
