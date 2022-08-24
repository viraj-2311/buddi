import React from 'react';
import defaultProps from "./defaultProps";

const Attach = ({width, height}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 11 22">
      <path fill="#2f2e50" d="M16.5 6v11.5a4 4 0 0 1-8 0V5a2.5 2.5 0 0 1 5 0v10.5a1 1 0 0 1-2 0V6H10v9.5a2.5 2.5 0 0 0 5 0V5a4 4 0 0 0-8 0v12.5a5.5 5.5 0 0 0 11 0V6z" transform="translate(-7 -1)"/>
    </svg>
  );
};

Attach.defaultProps = defaultProps;

export default Attach;
