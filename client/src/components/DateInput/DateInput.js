import React, { createRef, useState, useEffect } from 'react';
import Inputmask from 'inputmask';
import PropTypes from 'prop-types';
import DateInputWrapper from './DateInput.style';

const propTypes = {
  inputValue: PropTypes.string,
  onChangeDateInput: PropTypes.func.isRequired,
};

const defaultProps = {
  inputValue: ''
}

const DateInput = ({ inputValue, onChangeDateInput }) => {
  const myRef = createRef();
  const [dateValue, setDateValue] = useState('');

  const handleChange = (e) => {
    const { value: val } = e.target;
    setDateValue(val);
    onChangeDateInput(val);
  };

  useEffect(() => {
    const im = new Inputmask({
      alias: 'datetime',
      inputFormat: 'mm/dd/yyyy',
      outputFormat: 'mm/dd/yyyy',
    });
    im.mask(myRef.current);
  }, []);

  useEffect(() => {
    setDateValue(inputValue)
  }, [inputValue]);

  return (
    <DateInputWrapper>
      <input
        className='ant-input'
        ref={myRef}
        type='text'
        value={dateValue}
        placeholder='mm/dd/yyyy'
        onChange={e => handleChange(e)}
        onKeyUp={e => handleChange(e)}
      />
    </DateInputWrapper>
  );
};

DateInput.propTypes = propTypes;
DateInput.defaultProps = defaultProps;
export default DateInput;
