import React, {useEffect, useState} from 'react';
import NumberFormat from 'react-number-format';
import Input from '@iso/components/uielements/input';

const ZipCode  = ({value, onChange, ...rest}) => {
  const [state, setState] = useState({
    value: ''
  });

  useEffect(() => {
    setState({value})
  }, [value]);

  const zipFormat = (value) => {
    if (value.length <= 5) return value;

    return value.slice(0, 5) + '-' + value.slice(5, 9);
  };

  const onValueChange = (values) => {
    setState({value: values.value});
    onChange(values.value);
  };

  return (
    <NumberFormat
      customInput={Input}
      format={zipFormat}
      value={state.value}
      onValueChange={onValueChange}
      {...rest}
    />
  );
};

export default ZipCode;
