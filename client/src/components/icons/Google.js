import React from 'react';
import defaultProps from './defaultProps';

const Apple = ({ width, height, fill }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20.661 21"
    >
      <path
        fill={fill}
        d="M20.661 11.308c0 5.991-4.1 10.254-10.161 10.254a10.5 10.5 0 0 1 0-21 10.1 10.1 0 0 1 7.041 2.748l-2.858 2.748c-3.739-3.607-10.691-.9-10.691 5a6.577 6.577 0 0 0 6.507 6.63 5.678 5.678 0 0 0 5.961-4.526H10.5V9.555h10a9.2 9.2 0 0 1 .161 1.753z"
        transform="translate(0 -.563)"
      />
    </svg>
  );
};

Apple.defaultProps = defaultProps;

export default Apple;
