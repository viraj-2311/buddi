import React from 'react';
import defaultProps from './defaultProps';

const HelpChat = ({ width, height, fill }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 25 29.167'
    >
      <path
        fill={fill}
        d='M25.222 2H5.778A2.777 2.777 0 0 0 3 4.778v19.444A2.777 2.777 0 0 0 5.778 27h5.556l4.166 4.167L19.667 27h5.556A2.786 2.786 0 0 0 28 24.222V4.778A2.786 2.786 0 0 0 25.222 2zm-8.333 22.222h-2.778v-2.778h2.778zm2.875-10.764l-1.25 1.278a4.728 4.728 0 0 0-1.625 3.931h-2.778v-.694a5.59 5.59 0 0 1 1.625-3.931l1.722-1.75a2.716 2.716 0 0 0 .819-1.958 2.778 2.778 0 0 0-5.556 0H9.944a5.556 5.556 0 1 1 11.111 0 4.42 4.42 0 0 1-1.291 3.124z'
        transform='translate(-3 -2)'
      />
    </svg>
  );
};

HelpChat.defaultProps = defaultProps;

export default HelpChat;
