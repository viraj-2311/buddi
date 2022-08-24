import React from 'react';
import defaultProps from "./defaultProps";

const Setting = ({width, height}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 15.555 16">
      <path fill="#fff" d="M15.95 10.78A6.527 6.527 0 0 0 16 10a4.932 4.932 0 0 0-.06-.78l1.69-1.32a.413.413 0 0 0 .1-.51l-1.6-2.77a.407.407 0 0 0-.49-.18l-1.99.8a5.859 5.859 0 0 0-1.35-.78L12 2.34a.4.4 0 0 0-.4-.34H8.4a.389.389 0 0 0-.39.34l-.3 2.12a6.015 6.015 0 0 0-1.35.78l-1.99-.8a.4.4 0 0 0-.49.18l-1.6 2.77a.388.388 0 0 0 .1.51l1.69 1.32a4.713 4.713 0 0 0-.01 1.56L2.37 12.1a.413.413 0 0 0-.1.51l1.6 2.77a.407.407 0 0 0 .49.18l1.99-.8a5.859 5.859 0 0 0 1.35.78l.3 2.12a.407.407 0 0 0 .4.34h3.2a.382.382 0 0 0 .39-.34l.3-2.12a6.015 6.015 0 0 0 1.35-.78l1.99.8a.4.4 0 0 0 .49-.18l1.6-2.77a.388.388 0 0 0-.1-.51l-1.67-1.32zM10 13a3 3 0 1 1 3-3 3.009 3.009 0 0 1-3 3z" transform="translate(-2.222 -2)"/>
    </svg>
  );
};

Setting.defaultProps = defaultProps;

export default Setting;
