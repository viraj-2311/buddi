import React from 'react';
import defaultProps from "./defaultProps";
import custom from '../../config/theme/custom';

const PowerOff = ({width, height, fill, stroke}) => {
  const customStyle = {fill: fill};

  return (
    <svg xmlns="http://www.w3.org/2000/svg" id="power" width={width} height={height} viewBox="0 0 16.547 18.715">
      <path id="Path_776"
            d="M25.64 46.772a.71.71 0 0 0-1 0 .7.7 0 0 0 0 .991 6.773 6.773 0 0 1 0 9.63 6.908 6.908 0 0 1-9.7 0 6.779 6.779 0 0 1 0-9.629.7.7 0 0 0 0-.991.71.71 0 0 0-1 0 8.175 8.175 0 0 0 0 11.611 8.33 8.33 0 0 0 11.7 0 8.167 8.167 0 0 0 0-11.613z"
            style={customStyle} transform="translate(-11.518 -42.07)"/>
      <path id="Path_777"
            d="M92.556 9.382a.724.724 0 0 0 .724-.724V.724a.724.724 0 0 0-1.448 0v7.933a.724.724 0 0 0 .724.725z"
            style={customStyle} transform="translate(-84.286)"/>
    </svg>
  );
};

PowerOff.defaultProps = defaultProps;

export default PowerOff;
