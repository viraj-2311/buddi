import React from 'react';
import defaultProps from "./defaultProps";

const Dashboard = ({width, height}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16 16">
      <path fill="#fff" d="M15.581 5.186l-7-5a1 1 0 0 0-1.162 0l-7 5a1 1 0 0 0 1.162 1.628L2 6.515V15a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6.515A1.7 1.7 0 0 0 15 7a1 1 0 0 0 .582-1.814zM12 14h-2v-3a2 2 0 0 0-4 0v3H4V5.086l4-2.857 4 2.857z"/>
    </svg>
  );
};

Dashboard.defaultProps = defaultProps;

export default Dashboard;
