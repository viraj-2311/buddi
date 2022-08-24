import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
const CustomScrollbar = ({ id, style, children, className, ...rest }) => (
  <Scrollbars
    id={id}
    className={className}
    style={style}
    universal={true}
    {...rest}
  >
    {children}
  </Scrollbars>
);

CustomScrollbar.defaultProps = {
  autoHide: true,
  autoHideTimeout: 1000,
  autoHideDuration: 200,
  autoHeightMin: 0,
  autoHeightMax: 200,
  thumbMinSize: 30
};

export default CustomScrollbar;
