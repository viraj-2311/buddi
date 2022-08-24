import React from 'react';
import IntlMessages from '@iso/components/utility/intlMessages';
import ErrorPage from '@iso/components/ErrorPage';

export default function () {
  return (
    <ErrorPage
      title={<IntlMessages id='page404.title' />}
      subTitle={<IntlMessages id='page404.subTitle' />}
      description={<IntlMessages id='page404.description' />}
      backCtaLink={'/jobs'}
    />
  );
}
