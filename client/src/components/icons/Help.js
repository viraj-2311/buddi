import React from 'react';
import defaultProps from "./defaultProps";

const Help = ({width, height}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 15.555 15.555">
      <path fill="#fff" d="M9.778 2a7.778 7.778 0 1 0 7.778 7.778A7.78 7.78 0 0 0 9.778 2zm.778 13.222H9v-1.556h1.556zm1.61-6.028l-.7.716a2.648 2.648 0 0 0-.91 2.2H9v-.389a3.131 3.131 0 0 1 .91-2.2l.964-.98a1.521 1.521 0 0 0 .459-1.1 1.556 1.556 0 0 0-3.111 0H6.667a3.111 3.111 0 1 1 6.222 0 2.475 2.475 0 0 1-.724 1.753z" transform="translate(-2 -2)"/>
    </svg>
  );
};

Help.defaultProps = defaultProps;

export default Help;
