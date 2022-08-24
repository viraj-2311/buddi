import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import InputField from '@iso/components/shared/InputField';
import Button from '@iso/components/uielements/button';
import LogoWrapper from '@iso/components/utility/logoWrapper.style';
import IntlMessages from '@iso/components/utility/intlMessages';
import ErrorComponent from '@iso/components/ErrorComponent';
import SuccessText from '@iso/components/utility/successText';
import ForgotPasswordStyleWrapper from './ForgotPassword.style';
import { forgotPasswordRequest } from '@iso/redux/auth/actions';
import validationSchema from './schema';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.Auth.forgotPassword);
  const [action, setAction] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!loading && !error && action === 'forgot') {
      setSuccessMsg(
        "Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder."
      );
    }

    if (!loading && action === 'forgot') {
      setAction('');
    }
  }, [loading, error]);

  const forgotPasswordForm = {
    email: '',
  };

  const handleForgotPassword = (values) => {
    setAction('forgot');
    setSuccessMsg('');
    dispatch(forgotPasswordRequest(values));
  };

  return (
    <ForgotPasswordStyleWrapper className='isoForgotPassPage'>
      <LogoWrapper />
      <div className='isoFormContentWrapper'>
        <div className='isoFormContent'>
          <div className='isoFormHeadText'>
            <h3>
              <IntlMessages id='page.forgetPassSubTitle' />
            </h3>
            <p>
              <IntlMessages id='page.forgetPassDescription' />
            </p>
          </div>

          <div className='isoForgotPassForm'>
            {error && <ErrorComponent error={error} />}
            <Formik
              initialValues={forgotPasswordForm}
              onSubmit={handleForgotPassword}
              validationSchema={validationSchema}
            >
              {() => (
                <Form>
                  <div className='isoInputWrapper'>
                    <label className='fieldLabel'>Email</label>
                    <Field name='email' type='text' component={InputField} />
                  </div>
                  <div className='isoInputWrapper'>
                    {successMsg && <SuccessText text={successMsg} />}
                    <Button
                      type='primary'
                      shape='round'
                      htmlType='submit'
                      loading={loading}
                    >
                      <IntlMessages id='page.sendRequest' />
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <div className='isoFormFooterText'>
            <p>
              Not a member? <Link to='/signup'>Sign up now</Link>
            </p>
          </div>
        </div>
      </div>
    </ForgotPasswordStyleWrapper>
  );
};

export default ForgotPassword;
