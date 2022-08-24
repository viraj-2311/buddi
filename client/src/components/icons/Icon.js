import React from 'react';

export const Icon = ({ image, width, height, ...rest }) => {
  return <img src={image} width={width} height={height} {...rest} />;
};

Icon.defaultProps = {
  width: 20,
  height: 20
};

export default Icon;
