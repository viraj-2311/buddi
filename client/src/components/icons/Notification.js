import React from 'react';
import defaultProps from "./defaultProps";

const Notification = ({width, height, fill, stroke}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 18.377 21.62">
      <g>
        <path fill={fill} d="M47.439 21.62a2.168 2.168 0 0 0 2.161-2.162h-4.323a2.168 2.168 0 0 0 2.162 2.162zm7.027-6.486V9.189a6.956 6.956 0 0 0-5.405-6.81v-.757a1.622 1.622 0 0 0-3.243 0v.757a6.956 6.956 0 0 0-5.405 6.81v5.946L38.25 17.3v1.081h18.377V17.3z" transform="translate(-38.25)"/>
      </g>
    </svg>
  );
};

Notification.defaultProps = defaultProps;

export default Notification;
