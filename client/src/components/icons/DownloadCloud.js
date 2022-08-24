import React from 'react';
import defaultProps from "./defaultProps";

const DownloadCloud = ({ width, height, stroke }) => {
    return (
        // <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 19.873 20.436">
        //   <path fill="none" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" d="M3 15.311v4.081a2.075 2.075 0 0 0 2.1 2.04h14.676a2.069 2.069 0 0 0 2.1-2.04v-4.081m-4.194-5.149l-5.243 5.1-5.243-5.1m5.243 3.877V2" transform="translate(-2.5 -1.496)"/>
        // </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 50 33.333">
            <path fill="#f48d3a" stroke={stroke} d="M40.313 16.583a15.609 15.609 0 0 0-29.167-4.167A12.495 12.495 0 0 0 12.5 37.333h27.083a10.387 10.387 0 0 0 .729-20.75zM29.167 22.75v8.333h-8.334V22.75h-6.25L25 12.333 35.417 22.75z" transform="translate(0 -4)" />
        </svg>
    );
};

DownloadCloud.defaultProps = defaultProps;

export default DownloadCloud;