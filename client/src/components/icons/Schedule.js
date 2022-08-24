import React from 'react';
import defaultProps from "./defaultProps";

const Schedule = ({width, height, fill, stroke}) => {
  const customStyle = {fill: fill};

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18.642" height="16.821" viewBox="0 0 18.642 16.821">
      <g id="calendar" transform="translate(0 -25)">
        <path id="Path_942"
              d="M18.642 30.243v-2.148A1.64 1.64 0 0 0 17 26.456h-.218v2a.546.546 0 1 1-1.092 0v-2.91a.546.546 0 1 0-1.092 0v.91h-3.639v2a.546.546 0 1 1-1.092 0v-2.91a.546.546 0 1 0-1.092 0v.91H5.134v2a.546.546 0 1 1-1.092 0v-2.91a.546.546 0 1 0-1.092 0v.91H1.638A1.64 1.64 0 0 0 0 28.095v2.148z"
              style={customStyle}/>
        <path id="Path_943"
              d="M0 199v8.847a1.64 1.64 0 0 0 1.638 1.638H17a1.64 1.64 0 0 0 1.638-1.638V199zm5.243 7.573H4.078a.546.546 0 0 1 0-1.092h1.165a.546.546 0 0 1 0 1.092zm0-2.33H4.078a.546.546 0 0 1 0-1.092h1.165a.546.546 0 0 1 0 1.092zm0-2.33H4.078a.546.546 0 1 1 0-1.092h1.165a.546.546 0 1 1 0 1.092zm4.66 4.66H8.738a.546.546 0 0 1 0-1.092H9.9a.546.546 0 0 1 0 1.092zm0-2.33H8.738a.546.546 0 0 1 0-1.092H9.9a.546.546 0 0 1 0 1.092zm0-2.33H8.738a.546.546 0 1 1 0-1.092H9.9a.546.546 0 1 1 0 1.092zm4.66 4.66H13.4a.546.546 0 0 1 0-1.092h1.165a.546.546 0 0 1 0 1.092zm0-2.33H13.4a.546.546 0 0 1 0-1.092h1.165a.546.546 0 0 1 0 1.092zm0-2.33H13.4a.546.546 0 1 1 0-1.092h1.165a.546.546 0 1 1 0 1.092z"
              style={customStyle} transform="translate(0 -167.665)"/>
      </g>
    </svg>
  );
};

Schedule.defaultProps = defaultProps;

export default Schedule;
