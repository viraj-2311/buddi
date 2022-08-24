import React from 'react';
import defaultProps from "./defaultProps";

const Note = ({width, height, fill}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 18 20">
      <path fill={fill} d="M17 10H7v2h10zm2-7h-1V1h-2v2H8V1H6v2H5a1.991 1.991 0 0 0-1.99 2L3 19a2 2 0 0 0 2 2h14a2.006 2.006 0 0 0 2-2V5a2.006 2.006 0 0 0-2-2zm0 16H5V8h14zm-5-5H7v2h7z" transform="translate(-3 -1)"/>
    </svg>
  );
};

Note.defaultProps = defaultProps;

export default Note;
