import React from 'react';
import Alert from '@iso/components/Feedback/Alert';
import { showServerError } from '@iso/lib/helpers/utility';

const ErrorComponent = ({error, closable}) => {
  return (
    <Alert
      message={showServerError(error)}
      type="error"
      closable={closable}
    />
  );
};

export default ErrorComponent;
