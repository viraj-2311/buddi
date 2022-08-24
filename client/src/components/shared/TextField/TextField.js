/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import Input, { Textarea } from '@iso/components/uielements/input';
import { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const TextField = ({
  id,
  error,
  width,
  type,
  icon,
  placeholder,
  className,
  disabled,
  helperText,
  onChange,
  onBlur,
  name,
  value,
  append,
  multiline,
  rows,
  ...rest
}) => {
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const handleShowPlaceholder = (event) => {
    setShowPlaceholder(true);
    if (onBlur) onBlur(event);
  };

  const handleNotShowPlaceholder = () => setShowPlaceholder(false);

  return (
    <div
      className={cn({
        'relative shadow-2xl': true,
        [className]: true,
        'h-10': !multiline,
      })}
    >
      {multiline ? (
        <Textarea
          value={value || ''}
          onChange={onChange}
          name={name}
          disabled={disabled}
          width={width}
          onClick={handleNotShowPlaceholder}
          // onBlur={handleShowPlaceholder}
          rows={rows}
          {...rest}
        />
      ) : (
        <Input
          value={value || ''}
          type={type || 'text'}
          onChange={onChange}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          width={width}
          onClick={handleNotShowPlaceholder}
          suffix={icon}
          {...rest}
        />
      )}
      {append && (
        <div className="absolute inset-y-0 right-0 bg-white px-3 py-2">
          {append()}
        </div>
      )}
      {helperText && (
        <div className="helper-text lowercase">{helperText}</div>
      )}
    </div>
  );
};

TextField.propTypes = {
  width: PropTypes.string,
  onChange: PropTypes.func,
  children: PropTypes.any,
  className: PropTypes.string,
};

TextField.defaultProps = {
  placeholder: '',
};

export default TextField;
