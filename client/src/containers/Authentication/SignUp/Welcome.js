import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router';
import WelcomeStyleWrapper from './Welcome.style';
import LogoWrapper from '@iso/components/utility/logoWrapper.style';
import Button from '@iso/components/uielements/button';
import notify from '@iso/lib/helpers/notify';
import { resendVerificationEmailRequest } from '@iso/redux/auth/actions';

export default () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { user: signUpUser } = useSelector((state) => state.Auth.signup);
  const { resendVerification } = useSelector((state) => state.Auth);
  const [action, setAction] = useState('');

  useEffect(() => {
    if (
      !resendVerification.loading &&
      !resendVerification.error &&
      action === 'resend'
    ) {
      notify('success', 'Email resent successfully');
    }

    if (!resendVerification.loading && action === 'resend') {
      setAction('');
    }
  }, [resendVerification]);

  const handleEmailResend = () => {
    if (signUpUser && signUpUser.email) {
      setAction('resend');
      const payload = { email: signUpUser.email };
      dispatch(resendVerificationEmailRequest(payload));
    } else {
      history.push('/');
    }
  };

  const goToSignUp = () => {
    window.location.href = '/signup';
  };

  if (!signUpUser || !signUpUser.email) {
    return <Redirect to={'/'} />;
  }

  return (
    <WelcomeStyleWrapper>
      <LogoWrapper />

      <div className='isoSignUpWelcomeContentWrapper'>
        <div className='isoSignUpWelcomeContent'>
          <div className='isoSignUpWelcomeForm'>
            <div className='isoSignUpWelcomeTitleWrapper'>
              <h3>Thanks for signing up to Buddi Bands!</h3>
            </div>
            <div className='isoWelcomeTextWrapper'>
              To start exploring Buddi Bands app, please verify your account by
              clicking the link in email.
            </div>
            <div className='isoActionWrapper'>
              <p>Didn't receive your email?</p>
              <Button
                type='primary'
                shape='round'
                className='resend-email'
                onClick={handleEmailResend}
                loading={action === 'resend'}
              >
                Resend email
              </Button>
              <Button
                type='primary'
                shape='round'
                className='signup-diff-email'
                onClick={goToSignUp}
              >
                Sign up using a different email
              </Button>
            </div>
          </div>
        </div>
      </div>
    </WelcomeStyleWrapper>
  );
};
