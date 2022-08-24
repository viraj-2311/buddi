import React from 'react';
import defaultProps from './defaultProps';

const Mobile = ({ width, height, fill }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 13 22"
    >
      <path
        fill={fill}
        d="M15.5 1h-8A2.5 2.5 0 0 0 5 3.5v17A2.5 2.5 0 0 0 7.5 23h8a2.5 2.5 0 0 0 2.5-2.5v-17A2.5 2.5 0 0 0 15.5 1zm-4 21a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5zm4.5-4H7V4h9z"
        transform="translate(-5 -1)"
      />
    </svg>
  );
};

Mobile.defaultProps = defaultProps;

export default Mobile;
