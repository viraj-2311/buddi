import React from 'react';
import defaultProps from "./defaultProps";
import custom from '../../config/theme/custom';

const UserGroup = ({width, height, fill}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 22 14">
      <path fill={fill} d="M16 11a3 3 0 1 0-3-3 2.987 2.987 0 0 0 3 3zm-8 0a3 3 0 1 0-3-3 2.987 2.987 0 0 0 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05A4.22 4.22 0 0 1 17 16.5V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" transform="translate(-1 -5)"/>
    </svg>
  );
};

UserGroup.defaultProps = defaultProps;

export default UserGroup;
