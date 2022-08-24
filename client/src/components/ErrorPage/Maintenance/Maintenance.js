import React from 'react';
import IntlMessages from '@iso/components/utility/intlMessages';
import ErrorPage from '@iso/components/ErrorPage';

export default function () {
  return (
    <ErrorPage
      subTitle={<IntlMessages id='page.maintenance.subTitle' />}
      description={<IntlMessages id='page.maintenance.description' />}
      backCtaLink={'/jobs'}
    />
  );
}
