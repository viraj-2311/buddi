import React from 'react';
import IntlMessages from '@iso/components/utility/intlMessages';
import ErrorPage from '@iso/components/ErrorPage';

export default function () {
  return (
    <ErrorPage
      title={<IntlMessages id='page403.title' />}
      subTitle={<IntlMessages id='page403.subTitle' />}
      backCtaLink={'/jobs'}
    />
  );
}
