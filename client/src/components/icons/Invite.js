import React from 'react';
import defaultProps from "./defaultProps";
import custom from '../../config/theme/custom';

const Invite = ({width, height, fill, stroke}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 19 19">
      <g>
        <path fill={fill} d="M18.838.164a.557.557 0 0 0-.6-.123L.35 7.2a.557.557 0 0 0-.036 1.013l7.053 3.421 3.421 7.053a.557.557 0 0 0 .5.314h.02a.557.557 0 0 0 .5-.35L18.961.764a.557.557 0 0 0-.123-.6zm-16.9 7.6l14.2-5.68-8.467 8.46zm9.307 9.307l-2.787-5.74 8.462-8.462z" transform="translate(0 -.001)"/>
      </g>
    </svg>

  );
};

Invite.defaultProps = defaultProps;

export default Invite;
