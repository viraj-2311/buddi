import React, { useState, useRef, useEffect } from 'react';
import FooterWrapper from './Footer.styles';
import { Link } from 'react-router-dom';

const Footer = ({ titleFooter }) => {
  return (
    <FooterWrapper>
      <div className='footer'>
        <span>{titleFooter}</span>
      </div>

      <div className='term-of-service'>
        <Link to='/term-of-service' className='isoTosButton'>
          <span>Terms of Service</span>
        </Link>
      </div>
    </FooterWrapper>
  );
};
export default Footer;
