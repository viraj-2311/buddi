import React from 'react';
import defaultProps from "./defaultProps";

const Share = ({width, height, fill, stroke}) => {
  const customStyle = {fill: fill};

  return (
    <svg xmlns="http://www.w3.org/2000/svg" id="share" width={width} height={height} viewBox="0 0 20.993 22.902">
      <path id="Path_615"
            d="M129.28 278.029a.709.709 0 0 1-.353-.094l-8.855-5.048a.715.715 0 0 1 .708-1.243l8.854 5.048a.716.716 0 0 1-.355 1.338zm0 0"
            style={customStyle} transform="translate(-114.356 -259.402)"/>
      <path id="Path_614"
            d="M120.405 102.039a.715.715 0 0 1-.355-1.337l8.855-5.048a.715.715 0 0 1 .708 1.244l-8.855 5.048a.717.717 0 0 1-.353.093zm0 0"
            style={customStyle} transform="translate(-114.335 -91.285)"/>
      <path id="Path_611"
            d="M312.91 7.157a3.578 3.578 0 1 1 3.579-3.578 3.583 3.583 0 0 1-3.579 3.578zm0-5.725a2.147 2.147 0 1 0 2.147 2.147 2.15 2.15 0 0 0-2.147-2.148zm0 0"
            style={customStyle} transform="translate(-295.496)"/>
      <path id="Path_612"
            d="M312.91 359.157a3.578 3.578 0 1 1 3.579-3.578 3.583 3.583 0 0 1-3.579 3.578zm0-5.725a2.147 2.147 0 1 0 2.147 2.147 2.15 2.15 0 0 0-2.147-2.148zm0 0"
            style={customStyle} transform="translate(-295.496 -336.255)"/>
      <path id="Path_613"
            d="M3.578 183.157a3.578 3.578 0 1 1 3.578-3.578 3.583 3.583 0 0 1-3.578 3.578zm0-5.725a2.147 2.147 0 1 0 2.147 2.147 2.15 2.15 0 0 0-2.147-2.148zm0 0"
            style={customStyle} transform="translate(0 -168.127)"/>
    </svg>
  );
};

Share.defaultProps = defaultProps;

export default Share;
