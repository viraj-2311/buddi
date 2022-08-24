import React, {useEffect, useState} from 'react';
import TimePickerWrapper from './TimePicker.style';
import NumberFormat from 'react-number-format';
import Input from '@iso/components/uielements/input';
import { RadioGroup, RadioButton } from '@iso/components/uielements/radio';
import moment from 'moment';

export const formatTimeItem = (value) => {
  return `${value || ''}00`.substr(0, 2);
};

const validateTime = (
  newValue = '',
  oldValue,
  colon = ':',
) => {
  const [oldH, oldM] = oldValue.split(colon);

  const noSpaceValue = String(newValue).replace(/\s+/g, '');
  let [newH, newM] = noSpaceValue.split(colon);

  newH = formatTimeItem(newH);
  if (Number(newH[0]) > 1) {
    newH = `0${newH[0]}`;
  } else if (Number(newH) > 12) {
    newH = `${Number(newH) % 12}`;

    if (newH.length == 1) {
      newH = `0${newH}`;
    }
  }

  newM = formatTimeItem(newM);
  if (Number(newM[0]) > 5) {
    newM = oldM;
  }

  const validatedValue = `${newH}${colon}${newM}`;

  return validatedValue;
};

const TimePicker = ({value, onChange, colon}) => {
  const [stateTime, setStateTime] = useState('');
  const [stateAmPm, setStateAmPm] = useState('AM');

  useEffect(() => {
    if (value) {
      const timeString = moment(value, 'hh:mm A').format('hh:mm A');
      const [time, amPm] = timeString.split(' ');

      if (time) {
        setStateTime(time);
      }
      if (amPm) {
        setStateAmPm(amPm);
      }
    } else {
      setStateTime('');
    }
  }, [value]);

  const onTimeChange = (inputValue) => {
    const oldValue = stateTime;
    if (oldValue === inputValue) return;

    const validatedTime = validateTime(
      inputValue,
      oldValue,
      colon
    );

    if (validatedTime) {
      setStateTime(validatedTime);
      onChange(`${validatedTime} ${stateAmPm}`);
    }
  };

  const onAmPmChange = (value) => {
    setStateAmPm(value);
    if (stateTime) {
      onChange(`${stateTime} ${value}`);
    }
  };

  return (
    <TimePickerWrapper>
      <div className="timeInputWrapper">
        <NumberFormat
          customInput={Input}
          format="##:##"
          value={stateTime}
          onValueChange={(time) => onTimeChange(time.formattedValue)}
        />
      </div>

      <div className="amPMWrapper">
        <RadioGroup value={stateAmPm}>
          <RadioButton value="AM" onClick={() => onAmPmChange('AM')}>AM</RadioButton>
          <RadioButton value="PM" onClick={() => onAmPmChange('PM')}>PM</RadioButton>
        </RadioGroup>
      </div>
    </TimePickerWrapper>
  );
};

TimePicker.defaultProps = {
  value: '',
  colon: ':',
};

export default TimePicker;