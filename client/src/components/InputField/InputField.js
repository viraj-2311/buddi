import React from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';

import TextField from '../TextField';

const InputField = (props) => {
  const {
    field,
    form,
    helperText,
    disabled,
    placeholder,
    type,
    ...rest
  } = props;

  const error = getIn(form?.errors, field.name);
  const touched = getIn(form?.touched, field.name);

  return (
    <TextField
      id={field.name}
      error={!!(touched && error)}
      type={type}
      placeholder={placeholder}
      helperText={(touched && error) || helperText}
      disabled={disabled}
      {...field}
      {...rest}
    />
  );
};

InputField.propTypes = {
  field: PropTypes.object,
  form: PropTypes.object,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
};

export default InputField;
