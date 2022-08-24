import React from 'react';
import defaultProps from './defaultProps';

const UserConnection = ({ width, height, fill }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="16"
      viewBox="0 0 22 16"
    >
      <path
        fill="#fff"
        d="M15 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
        transform="translate(-1 -4)"
      />
    </svg>
  );
};

UserConnection.defaultProps = defaultProps;

export default UserConnection;
