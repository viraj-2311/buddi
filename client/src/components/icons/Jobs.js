import React from 'react';
import defaultProps from "./defaultProps";

const Jobs = ({width, height, fill}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16 14.4">
      <path fill={fill} d="M8.4 13.4v-.8H2.808L2.8 15.8a1.594 1.594 0 0 0 1.6 1.6h11.2a1.594 1.594 0 0 0 1.6-1.6v-3.2h-5.6v.8zm8-7.2h-3.208V4.6l-1.6-1.6h-3.2l-1.6 1.6v1.6H3.6A1.6 1.6 0 0 0 2 7.8v2.4a1.594 1.594 0 0 0 1.6 1.6h4.8v-1.6h3.2v1.6h4.8a1.6 1.6 0 0 0 1.6-1.6V7.8a1.6 1.6 0 0 0-1.6-1.6zm-4.8 0H8.4V4.6h3.2z" transform="translate(-2 -3)"/>
    </svg>
  );
};

Jobs.defaultProps = defaultProps;

export default Jobs;
