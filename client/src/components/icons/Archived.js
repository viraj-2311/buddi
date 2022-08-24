import React from 'react';
import defaultProps from "./defaultProps";

const Archived = ({width, height}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16 16">
      <path fill="#2f2e50" d="M18.591 4.982l-1.236-1.493A1.29 1.29 0 0 0 16.333 3H5.667a1.321 1.321 0 0 0-1.031.489L3.409 4.982A1.74 1.74 0 0 0 3 6.111v11.111A1.783 1.783 0 0 0 4.778 19h12.444A1.783 1.783 0 0 0 19 17.222V6.111a1.74 1.74 0 0 0-.409-1.129zM11 15.889L6.111 11h3.111V9.222h3.556V11h3.111zM4.884 4.778l.72-.889h10.667l.836.889z" transform="translate(-3 -3)"/>
    </svg>
  );
};

Archived.defaultProps = defaultProps;

export default Archived;
