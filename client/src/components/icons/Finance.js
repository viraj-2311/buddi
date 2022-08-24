import React from 'react';
import defaultProps from "./defaultProps";

const Finance = ({width, height}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16 16">
      <path fill="#fff" d="M10 2a8 8 0 1 0 8 8 8 8 0 0 0-8-8zm1.128 12.872V16.4H8.992v-1.544a2.976 2.976 0 0 1-2.616-2.72h1.568c.08.84.656 1.5 2.12 1.5 1.568 0 1.92-.784 1.92-1.272 0-.664-.352-1.288-2.136-1.712-1.984-.484-3.348-1.3-3.348-2.94a2.773 2.773 0 0 1 2.492-2.568V3.6h2.136v1.56a2.828 2.828 0 0 1 2.28 2.712H11.84c-.04-.888-.512-1.5-1.776-1.5-1.2 0-1.92.544-1.92 1.312 0 .672.52 1.112 2.136 1.528s3.344 1.112 3.344 3.128c-.008 1.464-1.1 2.264-2.5 2.528z" transform="translate(-2 -2)"/>
    </svg>
  );
};

Finance.defaultProps = defaultProps;

export default Finance;
