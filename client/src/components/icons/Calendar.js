import React from 'react';
import defaultProps from "./defaultProps";

const Calendar = ({width, height, fill}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 22.024 22">
          <path fill={fill} d="M21.822 3h-1.1V1h-2.2v2H7.506V1H5.3v2H4.2A2.115 2.115 0 0 0 2 5v16a2.115 2.115 0 0 0 2.2 2h17.622a2.115 2.115 0 0 0 2.2-2V5a2.115 2.115 0 0 0-2.2-2zm0 18H4.2V8h17.622z" transform="translate(-2 -1)"/>
    </svg>
  );
};

Calendar.defaultProps = defaultProps;

export default Calendar;
