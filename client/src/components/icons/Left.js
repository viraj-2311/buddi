import React from 'react';
import defaultProps from './defaultProps';

const Calendar = ({ width, height, fill }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 19 8'
    >
      <path
        fill={fill}
        d='M22 12l-4-4v3H3v2h15v3z'
        transform='translate(-3 -8)'
      />
    </svg>
  );
};

Calendar.defaultProps = defaultProps;

export default Calendar;
