import React from 'react';
import defaultProps from './defaultProps';

const Master = ({ width, height, fill }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 20 16'
    >
      <g id='Master' transform='translate(-2 -4)'>
        <g id='Group_433'>
          <path id='Path_6327' d='M22 8l-4-4v3H3v2h15v3z' fill={fill} />
          <path id='Path_6328' d='M2 16l4 4v-3h15v-2H6v-3z' fill={fill} />
        </g>
      </g>
    </svg>
  );
};

Master.defaultProps = defaultProps;

export default Master;
