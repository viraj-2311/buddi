import React from 'react';
import SuccessTextWrapper from './successText.style';

export default ({ text = '' }) => (
  <SuccessTextWrapper>
    <h3>{text}</h3>
  </SuccessTextWrapper>
);
