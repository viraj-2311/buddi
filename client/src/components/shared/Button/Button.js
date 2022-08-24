/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './Button.styles';

const Button = ({
  type,
  className,
  children,
  customCss,
  disabled,
  ...rest
}) => {
  return (
    <button
      type={type}
      css={[styles.defaultCss, customCss]}
      className={cn(
        'py-2 text-lg text-white border border-solid border-white',
        {
          'border-gray-500': disabled,
          'text-gray-500': disabled,
          'pointer-events-none': disabled,
        },
        className
      )}
      {...rest}
      disabled={disabled}
    >
      <span>{children}</span>
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
  customCss: PropTypes.any,
  disabled: PropTypes.bool,
};
Button.defaultProps = {
  type: 'button',
  disabled: false,
};

export default Button;
