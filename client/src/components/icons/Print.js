import React from 'react';
import defaultProps from "./defaultProps";

const Print = ({width, height, fill, stroke}) => {
  const customStyle = {fill: fill};

  return (
    <svg xmlns="http://www.w3.org/2000/svg" id="print" width={width} height={height} viewBox="0 0 23.507 23.507">
      <path id="Path_620"
            d="M21.058 17.753H18.12a.49.49 0 1 1 0-.979h2.938a1.471 1.471 0 0 0 1.469-1.474V8.449a1.471 1.471 0 0 0-1.469-1.469H2.449a1.471 1.471 0 0 0-1.47 1.469V15.3a1.471 1.471 0 0 0 1.469 1.469h2.939a.49.49 0 1 1 0 .979H2.449A2.451 2.451 0 0 1 0 15.3V8.449A2.451 2.451 0 0 1 2.449 6h18.61a2.451 2.451 0 0 1 2.449 2.449V15.3a2.451 2.451 0 0 1-2.45 2.453z"
            style={customStyle} transform="translate(0 -.123)"/>
      <path id="Path_621" d="M14.366 20.979H8.49a.49.49 0 1 1 0-.979h5.877a.49.49 0 1 1 0 .979z" style={customStyle}
            transform="translate(-.164 -.411)"/>
      <path id="Path_622" d="M14.366 18.979H8.49a.49.49 0 1 1 0-.979h5.877a.49.49 0 0 1 0 .979z" style={customStyle}
            transform="translate(-.164 -.37)"/>
      <path id="Path_623" d="M10.449 16.979H8.49a.49.49 0 1 1 0-.979h1.959a.49.49 0 0 1 0 .979z" style={customStyle}
            transform="translate(-.164 -.329)"/>
      <path id="Path_624"
            d="M18.223 6.856a.49.49 0 0 1-.49-.49V2.449a1.471 1.471 0 0 0-1.469-1.47H7.449a1.471 1.471 0 0 0-1.47 1.47v3.917a.49.49 0 1 1-.979 0V2.449A2.451 2.451 0 0 1 7.449 0h8.815a2.451 2.451 0 0 1 2.449 2.449v3.917a.49.49 0 0 1-.49.49z"
            style={customStyle} transform="translate(-.103)"/>
      <path id="Path_625"
            d="M16.264 23.774H7.449A2.451 2.451 0 0 1 5 21.325V13.49a.49.49 0 0 1 .49-.49h12.733a.49.49 0 0 1 .49.49v7.836a2.451 2.451 0 0 1-2.449 2.448zM5.979 13.979v7.346a1.471 1.471 0 0 0 1.469 1.469h8.815a1.471 1.471 0 0 0 1.469-1.469v-7.346z"
            style={customStyle} transform="translate(-.103 -.267)"/>
    </svg>
  );
};

Print.defaultProps = defaultProps;

export default Print;
