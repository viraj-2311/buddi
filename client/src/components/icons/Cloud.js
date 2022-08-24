import React from 'react';
import defaultProps from './defaultProps';

const Cloud = ({ width, height, fill }) => {
  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="16"
      viewBox="0 0 24 16"
    >
      <path
        fill={fill}
        d="M19.35 10.04a7.492 7.492 0 0 0-14-2A6 6 0 0 0 6 20h13a4.986 4.986 0 0 0 .35-9.96zM14 13v4h-4v-4H7l5-5 5 5z"
        transform="translate(0 -4)"
      />
    </svg>
  );
};

Cloud.defaultProps = defaultProps;

export default Cloud;
