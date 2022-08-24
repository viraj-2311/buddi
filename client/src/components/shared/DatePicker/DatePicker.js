import React, {useEffect, useState} from 'react';
import DatePickerWrapper from './DatePicker.style';
import Select, { SelectOption } from '@iso/components/uielements/select';
import Input from '@iso/components/uielements/input';
import moment from 'moment';
import _ from 'lodash';

const Option = SelectOption;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const getDaysInMonth  = (year, month) => {
  return new Date(year, month, 0).getDate();
};

const DatePicker = ({value, onChange, format}) => {
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [day, setDay] = useState(null);
  const [monthDays, setMonthDays] = useState(31);

  useEffect(() => {
    if (value) {
      const date = moment(value);
      setYear(date.year());
      setMonth(date.month() + 1);
      setDay(date.date());
    }
  }, [value]);

  useEffect(() => {
    setMonthDays(getDaysInMonth(year, month));

    if (year && month && day) {
      const newDate = moment([year, month - 1, day]);
      if (newDate.isValid()) {
        onChange(newDate.format(format));
      }
    }
  }, [year, month, day]);

  const onYearChange = (e) => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      setYear(value);
    }
  };

  const onMonthChange = (value) => {
    setMonth(value);

  };

  const onDayChange = (value) => {
    setDay(value);
  };

  return (
    <DatePickerWrapper>
      <div className="monthWrapper">
        <Select value={month} onSelect={onMonthChange} style={{width: '100%'}} placeholder="Month">
          {MONTHS.map((month, index) => (
            <Option value={index + 1} key={`month-${index + 1}`}>{month}</Option>
          ))}
        </Select>
      </div>

      <div className="dayWrapper">
        <Select value={day} onSelect={onDayChange} style={{width: '100%'}} placeholder="Day">
          {_.range(1, monthDays + 1).map(value => (
            <Option value={value} key={`day-${value}`}>{value}</Option>
          ))}
        </Select>
      </div>

      <div className="yearWrapper">
        <Input value={year} onChange={onYearChange} placeholder="Year" maxLength={4} />
      </div>
    </DatePickerWrapper>
  );
};

DatePicker.defaultProps = {
  format: 'YYYY-MM-DD'
};

export default DatePicker;