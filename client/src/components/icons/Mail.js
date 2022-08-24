import React from 'react';
import defaultProps from './defaultProps';

const Mail = ({ width, height, fill }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 16"
    >
      <path
        fill={fill}
        d="M20 4H4a2 2 0 0 0-1.99 2L2 18a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V6a2.006 2.006 0 0 0-2-2zm0 4l-8 5-8-5V6l8 5 8-5z"
        transform="translate(-2 -4)"
      />
    </svg>
  );
};

Mail.defaultProps = defaultProps;

export default Mail;
