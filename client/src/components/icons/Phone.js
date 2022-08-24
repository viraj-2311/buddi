import React from 'react';
import defaultProps from './defaultProps';

const Phone = ({ width, height, fill }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 18 18"
    >
      <path
        fill={fill}
        d="M20.01 15.38a11.443 11.443 0 0 1-3.53-.56.977.977 0 0 0-1.01.24l-1.57 1.97a15.183 15.183 0 0 1-6.89-6.83l1.95-1.66a1.021 1.021 0 0 0 .24-1.02 11.153 11.153 0 0 1-.56-3.53A1 1 0 0 0 7.65 3H4.19C3.65 3 3 3.24 3 3.99A17.152 17.152 0 0 0 20.01 21a1.049 1.049 0 0 0 .99-1.18v-3.45a1 1 0 0 0-.99-.99z"
        transform="translate(-3 -3)"
      />
    </svg>
  );
};

Phone.defaultProps = defaultProps;

export default Phone;
