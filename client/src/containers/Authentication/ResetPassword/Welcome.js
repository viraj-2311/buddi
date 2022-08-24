import React from 'react';
import { Link } from 'react-router-dom';
import LogoWrapper from '@iso/components/utility/logoWrapper.style';
import WelcomeStyleWrapper from './Welcome.style';
import Button from '@iso/components/uielements/button';

export default () => {
  return (
    <WelcomeStyleWrapper>
      <LogoWrapper />
      <div className='isoResetPasswordWelcomeContentWrapper'>
        <div className='isoResetPasswordWelcomeContent'>
          <div className='isoResetPasswordWelcomeForm'>
            <div className='isoResetPasswordWelcomeTitleWrapper'>
              <h3>Password Reset Successful!</h3>
            </div>
            <div className='isoWelcomeTextWrapper'>
              You can now use your new password to login to your account
            </div>
            <div className='isoActionWrapper'>
              <Link to='/login'>
                <Button type='primary' shape='round' className='button-login'>
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </WelcomeStyleWrapper>
  );
};
