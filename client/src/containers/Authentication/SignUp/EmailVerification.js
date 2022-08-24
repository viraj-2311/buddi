import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import EmailVerificationStyleWrapper from './EmailVerification.style';
import { verifyEmailRequest } from '../../../redux/auth/actions';
import { Typography } from 'antd';
import basicStyle from '@iso/assets/styles/constants';
import notify from '@iso/lib/helpers/notify';

const EmailVerification = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const { loading: verificationLoading, error: verificationError } =
    useSelector((state) => state.Auth.verification);
  const [action, setAction] = useState('');

  useEffect(() => {
    if (
      !verificationLoading &&
      !verificationError &&
      action === 'signup_verification'
    ) {
      notify('success', 'Account has been activated');
      history.push('/login');
    }

    if (!verificationLoading && action === 'signup_verification') {
      setAction('');
    }
  }, [verificationLoading, verificationError]);

  useEffect(() => {
    const { search } = location;

    if (search && search.includes('token')) {
      const queries = search.split('?token=');
      const token = queries[queries.length - 1];
      dispatch(verifyEmailRequest(token));
      setAction('signup_verification');
    }
  }, [location, dispatch]);

  return (
    <EmailVerificationStyleWrapper>
      <div className='isoEmailVerificationText'>{verificationError}</div>
    </EmailVerificationStyleWrapper>
  );
};

export default EmailVerification;
