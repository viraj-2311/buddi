import React from 'react';
import defaultProps from './defaultProps';

const Apple = ({ width, height, fill }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 17.647 21"
    >
      <path
        fill={fill}
        d="M15.035 13.347a4.377 4.377 0 0 1 2.345-3.975 5.037 5.037 0 0 0-3.971-2.091c-1.664-.131-3.483.97-4.149.97-.7 0-2.316-.924-3.582-.924-2.616.042-5.4 2.086-5.4 6.245a11.685 11.685 0 0 0 .675 3.807c.6 1.721 2.766 5.94 5.026 5.87 1.185-.028 2.021-.839 3.557-.839 1.491 0 2.264.839 3.582.839 2.279-.033 4.238-3.868 4.81-5.593a4.648 4.648 0 0 1-2.893-4.309zm-2.654-7.7a4.416 4.416 0 0 0 1.125-3.4 4.971 4.971 0 0 0-3.183 1.636 4.485 4.485 0 0 0-1.2 3.371 3.938 3.938 0 0 0 3.259-1.605z"
        transform="translate(-.281 -2.25)"
      />
    </svg>
  );
};

Apple.defaultProps = defaultProps;

export default Apple;
