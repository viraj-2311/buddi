import React from 'react';
import IntlMessages from '@iso/components/utility/intlMessages';
import ErrorPage from '@iso/components/ErrorPage';

export default function () {
  return (
    <ErrorPage
      title={<IntlMessages id='page500.title' />}
      subTitle={<IntlMessages id='page500.subTitle' />}
      description={<IntlMessages id='page500.description' />}
      backCtaLink={'/jobs'}
    />
  );
}
