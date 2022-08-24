import React from 'react';
import defaultProps from "./defaultProps";

const Confirm = ({width, height, fill, stroke}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 62 62">
      <g id="Group_1289" data-name="Group 1289" transform="translate(-12918 -12568)">
        <circle id="Ellipse_4" data-name="Ellipse 4" cx="30" cy="30" r="30" transform="translate(12919 12569)" fill={fill} stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
        <g id="Group_1288" data-name="Group 1288">
          <line id="Line_5" data-name="Line 5" x1="17" y2="17" transform="translate(12940 12591)" fill="none" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
          <line id="Line_6" data-name="Line 6" x2="17" y2="17" transform="translate(12940 12591)" fill="none" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
        </g>
      </g>
    </svg>
  );
};

Confirm.defaultProps = defaultProps;

export default Confirm;
