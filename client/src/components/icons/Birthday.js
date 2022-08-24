import React from 'react';
import defaultProps from './defaultProps';

const Birthday = ({ width, height, fill }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 18 22"
    >
      <path
        fill={fill}
        d="M12 6a2 2 0 0 0 2-2 1.9 1.9 0 0 0-.29-1.03L12 0l-1.71 2.97A1.9 1.9 0 0 0 10 4a2.006 2.006 0 0 0 2 2zm4.6 9.99l-1.07-1.07-1.08 1.07a3.543 3.543 0 0 1-4.89 0l-1.07-1.07-1.09 1.07A3.435 3.435 0 0 1 4.96 17 3.474 3.474 0 0 1 3 16.39V21a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-4.61a3.474 3.474 0 0 1-1.96.61 3.435 3.435 0 0 1-2.44-1.01zM18 9h-5V7h-2v2H6a3 3 0 0 0-3 3v1.54a1.963 1.963 0 0 0 1.96 1.96 1.919 1.919 0 0 0 1.38-.57l2.14-2.13 2.13 2.13a2.006 2.006 0 0 0 2.77 0l2.14-2.13 2.13 2.13a1.936 1.936 0 0 0 1.38.57 1.963 1.963 0 0 0 1.96-1.96V12A2.981 2.981 0 0 0 18 9z"
        transform="translate(-3)"
      />
    </svg>
  );
};

Birthday.defaultProps = defaultProps;

export default Birthday;
