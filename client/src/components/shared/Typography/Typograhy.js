/** @jsx jsx */

import React from 'react';
import PropTypes from 'prop-types';

const Typography = ({ color, variant, children, style, ...rest }) => {
  let element = 'p';
  let props = {
    style: { ...style, color },
    ...rest,
  };

  switch (variant) {
    case 'h1':
      element = 'h1';
      props.style = { ...props.style, fontSize: '50px' };
      break;
    case 'h2':
      element = 'h2';
      props.style = { ...props.style, fontSize: '45px' };
      break;
    case 'h3':
      element = 'h3';
      props.style = { ...props.style, fontSize: '40px' };
      break;
    case 'h4':
      element = 'h4';
      props.style = { ...props.style, fontSize: '35px' };
      break;
    case 'h5':
      element = 'h5';
      props.style = { ...props.style, fontSize: '30px' };
      break;
    case 'h6':
      element = 'h6';
      props.style = { ...props.style, fontSize: '25px' };
      break;
    case 'caption':
      element = 'p';
      props.style = { ...props.style, fontSize: '20px' };
      break;
    case 'subTitle1':
      element = 'p';
      props.style = { ...props.style, fontSize: '18px' };
      break;
    case 'subTitle2':
      element = 'p';
      props.style = { ...props.style, fontSize: '16px' };
      break;
    case 'body1':
      element = 'p';
      props.style = { ...props.style, fontSize: '14px' };
      break;
    case 'body2':
      element = 'p';
      props.style = { ...props.style, fontSize: '12px' };
      break;
    case 'overline':
      element = 'p';
      props.style = { ...props.style, fontSize: '10px' };
      break;
    default:
      element = 'p';
      break;
  }

  return React.createElement(element, props, children);
};

Typography.propTyes = {
  color: PropTypes.string,
  variant: PropTypes.string,
  children: PropTypes.any,
};

Typography.defaultProps = {
  color: 'white',
  variant: 'caption',
};

export default Typography;
