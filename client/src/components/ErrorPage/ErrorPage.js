import React from 'react';
import { Link } from 'react-router-dom';
import Image from '@iso/assets/images/rob.png';
import IntlMessages from '@iso/components/utility/intlMessages';
import ErrorPageStyle, {
  ErrorPageContentWrapperStyle,
  ErrorPageImageWrapperStyle
} from './ErrorPage.styles';

export default function ({ title, subTitle, backCtaLink, description }) {
  return (
    <ErrorPageStyle>
      <ErrorPageContentWrapperStyle>
        <h1>{title}</h1>
        <h3>{subTitle}</h3>
        {description && <p>{description}</p>}
        <Link to={backCtaLink}>
          <button type='button'>
            <IntlMessages id='page.errorPage.backButton' />
          </button>
        </Link>
      </ErrorPageContentWrapperStyle>

      <ErrorPageImageWrapperStyle>
        <img alt='#' src={Image} />
      </ErrorPageImageWrapperStyle>
    </ErrorPageStyle>
  );
}
