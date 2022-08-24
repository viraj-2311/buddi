import React, { useState, useMemo, useEffect } from 'react';
import ReactDayPicker, { DateUtils } from 'react-day-picker';
import cn from 'classnames';
import { RadioButton, RadioGroup } from '../../uielements/radio';
import { TextField } from '@iso/components';
import ClickAwayListener from '@iso/components/ClickAwayListener';
import Button from '@iso/components/uielements/button';
import 'react-day-picker/lib/style.css';
import DayPickerStyleWrapper, {
  DayPickerSection,
  ActionDiv,
} from './DayPicker.styles';
import Moment from 'moment';
import {
  stringToDate,
  formatDateString,
  isSequenceDates,
} from '@iso/lib/helpers/utility';
import { extendMoment } from 'moment-range';
import _ from 'lodash';

const moment = extendMoment(Moment);
const PickModes = {
  DATERANGE: 'DATERANGE',
  MULTISELECT: 'MULTI-DAY SELECT',
};

const DayPicker = ({
  placeholder,
  values,
  month,
  showDaysCount,
  onChange,
  className,
  suffixIcon,
  requiredField = false,
  startDate,
  wrapDate,
  disabled=false,
  checkIsRequired = () => {}
}) => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [enumDays, setEnumDays] = useState([]);
  const [calendarMonth, setCalendarMonth] = useState(month);
  const [open, setOpen] = useState(false);
  const [pickMode, setPickMode] = useState(PickModes.DATERANGE);
  const [from, setFrom] = useState(undefined);
  const [to, setTo] = useState(undefined);
  const modifiers = { start: from, end: to };
  const [require, requiredVal] = useState(true);
 
  useEffect(() => {
    setEnumDays(values);
    setFrom(undefined);
    setTo(undefined);

    if (values.length > 1) {
      const minDate = _.min(values);
      const maxDate = _.max(values);

      if (isSequenceDates(values)) {
        setPickMode(PickModes.DATERANGE);
        setSelectedDays([minDate, { from: minDate, to: maxDate }]);
        setFrom(minDate);
        setTo(maxDate);
      } else {
        setPickMode(PickModes.MULTISELECT);
        setSelectedDays(values);
      }

      setCalendarMonth(stringToDate(minDate, 'YYYY-MM').toDate());
    } else if (values.length === 1) {
      setPickMode(PickModes.MULTISELECT);
      setSelectedDays(values);
      setCalendarMonth(stringToDate(values[0], 'YYYY-MM').toDate());
    } else {
      setPickMode(PickModes.DATERANGE);
      setSelectedDays([]);
      setCalendarMonth(null);
    }
  }, [values]);

  const displayText = useMemo(() => {
    if (pickMode == PickModes.MULTISELECT) {
      if (selectedDays.length) {
        const dateStrings = _.sortBy(selectedDays).map((date) =>
          formatDateString(date, 'MMM Do YYYY')
        );
        if (showDaysCount) {
          return `(${selectedDays.length}) days | ${dateStrings.join(', ')}`;
        } else {
          return dateStrings.join(', ');
        }
      }
    } else if (pickMode == PickModes.DATERANGE) {
      if (selectedDays.length > 1) {
        const range = selectedDays[1];
        if (range.from && range.to) {
          if (showDaysCount) {
            const count = moment(range.to).diff(moment(range.from), 'days') + 1;
            return `(${count}) days | ${formatDateString(
              range.from,
              'MMM Do, YYYY'
            )} - ${formatDateString(range.to, 'MMM Do, YYYY')}`;
          } else {
            return `${formatDateString(
              range.from,
              'MMM Do, YYYY'
            )} - ${formatDateString(range.to, 'MMM Do, YYYY')}`;
          }
        }
      }
    }
  }, [selectedDays]);

  useEffect(() => {
    if (enumDays.length && !open) {
      if (onChange) onChange(enumDays);
    }
    
    if(!!requiredField){
      if(enumDays.length > 0){
        checkIsRequired(false);
      } 
      // else {
      //   checkIsRequired(true);
      // }
    } 
  }, [open]);

  useEffect(() => {
    if(!!requiredField){
      if(values.length > 0){
        checkIsRequired(false);
      } 
      // else {
      //   checkIsRequired(true);
      // }
    } 
  },[values]);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const handleDayClick = (day, { selected }, e) => {
    if(!!requiredField){
      requiredVal(false);
    }
    if (e.key === 'Enter' && enumDays.length) {
      setOpen(false);
      if(!!requiredField){
        checkIsRequired(false);
      }
      return;
    }

    const clonedSelected = _.cloneDeep(selectedDays);
    let days = [];

    if (pickMode == PickModes.MULTISELECT) {
      if (selected) {
        const selectedIndex = clonedSelected.findIndex((selectedDay) =>
          DateUtils.isSameDay(selectedDay, day)
        );
        clonedSelected.splice(selectedIndex, 1);
      } else {
        clonedSelected.push(day);
      }

      days = [...clonedSelected];
      if(days.length < 1 && !!requiredField) {
        requiredVal(true);
      }
    } else if (pickMode == PickModes.DATERANGE) {
      if (from && to) {
        setFrom(undefined);
        setTo(undefined);
      }

      const range = DateUtils.addDayToRange(day, {
        from: from && to ? undefined : from,
        to: from && to ? undefined : to,
      });
      setFrom(range.from);
      setTo(range.to);
      clonedSelected.splice(0, clonedSelected.length);
      clonedSelected.push(range.from);
      clonedSelected.push({ from: range.from, to: range.to });

      if (range.from && range.to) {
        days = rangeToDays(range.from, range.to);
      }
      if(days.length < 1 && !!requiredField) {
        requiredVal(true);
      }
    }

    setSelectedDays(clonedSelected);
    setEnumDays(days);
  };

  const rangeToDays = (start, end) => {
    let days = [];
    days = Array.from(moment.range(start, end).by('day'));
    days = days.map((day) => day.toDate());

    return days;
  };

  const handlePickMode = (e) => {
    setPickMode(e.target.value);
    if (e.target.value === PickModes.MULTISELECT) {
      let days = [];
      if (from && to) {
        days = rangeToDays(from, to);
      }

      setSelectedDays(days);
      setEnumDays(days);
      setFrom(undefined);
      setTo(undefined);
    } else {
      if (selectedDays.length) {
        const minDate = _.min(selectedDays);
        const maxDate = _.max(selectedDays);

        setSelectedDays([minDate, { from: minDate, to: maxDate }]);
        setEnumDays(rangeToDays(minDate, maxDate));
        setFrom(minDate);
        setTo(maxDate);
      }
    }
  };

  return (
    <DayPickerStyleWrapper className={cn('relative', className)}>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <TextField
          readOnly
          className='ant-picker-input'
          placeholder={placeholder}
          value={displayText}
          disabled={disabled}
          icon={
            <Button type='link' onClick={toggleOpen}>
              {suffixIcon}
            </Button>
          }
          onClick={toggleOpen}
        />
        {open && (
          <div className='daypickerwrapper'>
            <RadioGroup
              value={pickMode}
              buttonStyle='solid'
              onChange={handlePickMode}
            >
              {Object.keys(PickModes).map((e, index) => (
                <RadioButton key={index} value={PickModes[e]}>
                  {PickModes[e]}
                </RadioButton>
              ))}
            </RadioGroup>
            <DayPickerSection>
              <ReactDayPicker
                modifiers={modifiers}
                month={calendarMonth}
                disabledDays={[
                  {
                    after: new Date(wrapDate),
                    before: new Date(startDate)
                  }
                ]}
                selectedDays={selectedDays}
                onDayClick={handleDayClick}
              />
              <ActionDiv>
                <Button
                  type='default'
                  shape='round'
                  className='doneBtn'
                  onClick={() => {
                    if(!!requiredField){
                      requiredVal(require);
                      checkIsRequired(require);
                    }
                    setOpen(false);
                  }}
                >
                  Done
                </Button>
              </ActionDiv>
            </DayPickerSection>
          </div>
        )}
      </ClickAwayListener>
    </DayPickerStyleWrapper>
  );
};

DayPicker.defaultProps = {
  values: [],
  placeholder: 'Select date',
  showDaysCount: false,
};

export default DayPicker;
