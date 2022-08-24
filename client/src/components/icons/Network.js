import React from 'react';
import defaultProps from "./defaultProps";

const Network = ({width, height, fill, stroke}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 19.755 15.265">
      <path fill={fill} d="M374.382 985.943a13.919 13.919 0 0 1 2.6-.359 9.512 9.512 0 0 1 2.6.359 9.226 9.226 0 0 1 2.514 1.078 2.166 2.166 0 0 1 1.167 1.706v4.939H370.7v-4.939a1.978 1.978 0 0 1 1.167-1.706 7.892 7.892 0 0 1 2.515-1.078zm4.4-2.963a2.6 2.6 0 1 1 .808-1.886 2.585 2.585 0 0 1-.808 1.885zm7.184 0a2.6 2.6 0 1 1 .808-1.886 2.584 2.584 0 0 1-.809 1.885zm-1.886 2.6a9.512 9.512 0 0 1 2.6.359 11.315 11.315 0 0 1 2.6 1.078 1.978 1.978 0 0 1 1.167 1.706v4.939h-5.388v-4.939a3.878 3.878 0 0 0-1.8-3.143z" transform="translate(-370.7 -978.4)"/>
    </svg>
  );
};

Network.defaultProps = defaultProps;

export default Network;
