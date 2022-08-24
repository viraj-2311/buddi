import React from 'react';
import defaultProps from "./defaultProps";

const Back = ({width, height}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 11.67 19.8">
      <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z" transform="translate(0 -2.1)"/>
    </svg>
  );
};

Back.defaultProps = defaultProps;

export default Back;
