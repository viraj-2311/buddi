import React from 'react';
import defaultProps from './defaultProps';

const Edit = ({ width, height, fill }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 18.002 18.003"
    >
      <path
        fill={fill}
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
        transform="translate(-3 -2.997)"
      />
    </svg>
  );
};

Edit.defaultProps = defaultProps;

export default Edit;
