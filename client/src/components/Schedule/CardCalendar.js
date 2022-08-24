import React from 'react';
import Calendar from 'react-calendar';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import 'react-calendar/dist/Calendar.css';
import ScheduleCardCalendarWrapper from './CardCalendar.style';

const ScheduleCardCalendar = ({value, tileClassName, onChange, ...rest}) => {
  const handleChange = (date) => {
    if (onChange) onChange(date);
  };

  return (
    <ScheduleCardCalendarWrapper>
      <Calendar
        nextLabel={<RightOutlined />}
        prevLabel={<LeftOutlined />}
        next2Label={null}
        prev2Label={null}
        calendarType="US"
        activeStartDate={value}
        value={value}
        tileClassName={tileClassName}
        onChange={handleChange}
        onActiveStartDateChange={({activeStartDate}) => handleChange(activeStartDate)}
        {...rest}
      />
    </ScheduleCardCalendarWrapper>
  )
};

export default ScheduleCardCalendar;
