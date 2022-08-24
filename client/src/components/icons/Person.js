import React from 'react';
import defaultProps from "./defaultProps";

const Person = ({width, height}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16 16">
      <path fill="#fff" d="M10 2a8 8 0 1 0 8 8 8 8 0 0 0-8-8zm0 2.4a2.4 2.4 0 1 1-2.4 2.4A2.4 2.4 0 0 1 10 4.4zm0 11.36a5.76 5.76 0 0 1-4.8-2.576c.024-1.592 3.2-2.464 4.8-2.464s4.776.872 4.8 2.464A5.76 5.76 0 0 1 10 15.76z" transform="translate(-2 -2)"/>
    </svg>
  );
};

Person.defaultProps = defaultProps;

export default Person;
