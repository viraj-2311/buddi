import React from 'react';
import defaultProps from "./defaultProps";

const Callsheet = ({width, height}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 18 20">
      <path fill="#fff"
            d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2.006 2.006 0 0 0 2-2V5a2.006 2.006 0 0 0-2-2zm-7 3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm6 12H6v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1z"
            transform="translate(-3 -1)"/>
    </svg>
  );
};

Callsheet.defaultProps = defaultProps;

export default Callsheet;
