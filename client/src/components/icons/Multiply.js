import React from 'react';
import defaultProps from "./defaultProps";

const Multiply = ({width, height, fill}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 14 14">
      <path fill={fill ? fill : '2f2e50'} d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" transform="translate(-5 -5)"/>
    </svg>
  );
};

Multiply.defaultProps = defaultProps;

export default Multiply;
