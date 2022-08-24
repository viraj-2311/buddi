import React from 'react';
import defaultProps from "./defaultProps";

const Message = ({width, height}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16 12.8">
      <path fill="#fff" d="M16.4 4H3.6a1.6 1.6 0 0 0-1.592 1.6L2 15.2a1.6 1.6 0 0 0 1.6 1.6h12.8a1.6 1.6 0 0 0 1.6-1.6V5.6A1.6 1.6 0 0 0 16.4 4zm0 3.2l-6.4 4-6.4-4V5.6l6.4 4 6.4-4z" transform="translate(-2 -4)"/>
    </svg>
  );
};

Message.defaultProps = defaultProps;

export default Message;
