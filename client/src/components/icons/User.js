import React from 'react';
import defaultProps from "./defaultProps";

const User = ({width, height, fill}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16 16">
      <path fill={fill} d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" transform="translate(-4 -4)"/>
    </svg>
  );
};

User.defaultProps = defaultProps;

export default User;
