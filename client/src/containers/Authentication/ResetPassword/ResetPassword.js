import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import Popover from '@iso/components/uielements/popover';
import InputField from '@iso/components/shared/InputField';
import Button from '@iso/components/uielements/button';
import LogoWrapper from '@iso/components/utility/logoWrapper.style';
import IntlMessages from '@iso/components/utility/intlMessages';
import Loader from '@iso/components/utility/loader';
import ErrorComponent from '@iso/components/ErrorComponent';
import SuccessText from '@iso/components/utility/successText';
import {
  InfoCircleFilled,
  EyeInvisibleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import ResetPasswordStyleWrapper from './ResetPassword.style';
import {
  resetPasswordRequest,
  verifyResetPasswordTokenRequest,
} from '@iso/redux/auth/actions';
import validationSchema from './schema';
import PasswordStrengthBar from 'react-password-strength-bar';
import { PasswordHintTextWrapper } from '../SignUp/SignUp.styles';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { resetPassword: resetAction, verifyResetPasswordToken: verifyAction } =
    useSelector((state) => state.Auth);
  const [isRevealPassword, setIsRevealPassword] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [token, setToken] = useState('');
  const [action, setAction] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const { search } = location;
    if (search && search.includes('token')) {
      const queries = search.split('?token=');
      const token = queries[queries.length - 1];
      setToken(token);
      setAction('verify');
      dispatch(verifyResetPasswordTokenRequest(token));
    } else {
      history.push('/forgot-password');
    }
  }, [location]);

  useEffect(() => {
    if (!verifyAction.loading && action === 'verify') {
      setShowLoader(false);
    }
  }, [verifyAction]);

  useEffect(() => {
    if (!resetAction.loading && !resetAction.error && action === 'reset') {
      setSuccessMsg('New password set successfully.');

      setTimeout(() => {
        history.push('/reset-password/welcome');
      }, 2000);
    }

    if (!resetAction.loading && action === 'reset') {
      setAction('');
    }
  }, [resetAction]);

  const isInValidToken = useMemo(() => {
    return verifyAction.error !== null;
  }, [verifyAction]);

  const resetPasswordForm = {
    password: '',
    confirmPassword: '',
  };

  const handleResetPassword = ({ password }) => {
    setAction('reset');
    setSuccessMsg('');
    const payload = { password, token };
    dispatch(resetPasswordRequest(payload));
  };

  const onTogglePassword = (event) => {
    setIsRevealPassword(!isRevealPassword);
  };

  const PasswordHintText = () => {
    return (
      <PasswordHintTextWrapper>
        <p>
          <strong>Password requirements:</strong>
        </p>
        <ul className=''>
          <li>At least 8 characters</li>
          <li>A lowercase letter</li>
          <li>An uppercase letter</li>
          <li>A number</li>
          <li>No parts of your username</li>
        </ul>
      </PasswordHintTextWrapper>
    );
  };

  if (showLoader) {
    return <Loader />;
  }

  return (
    <ResetPasswordStyleWrapper className='isoResetPassPage'>
      <LogoWrapper />
      <div className='isoFormContentWrapper'>
        <div className='isoFormContent'>
          <div className='isoFormHeadText'>
            <h3>
              <IntlMessages id='page.resetPassSubTitle' />
            </h3>
          </div>

          <div className='isoResetPassForm'>
            {isInValidToken && <ErrorComponent error={verifyAction.error} />}

            <Formik
              initialValues={resetPasswordForm}
              onSubmit={handleResetPassword}
              validationSchema={validationSchema}
            >
              {({ values }) => (
                <Form>
                  <div className='isoInputWrapper'>
                    <label className='formLabel'>New password</label>
                    <Field
                      name='password'
                      type={isRevealPassword ? 'text' : 'password'}
                      component={InputField}
                      disabled={isInValidToken}
                      icon={
                        isRevealPassword ? (
                          <EyeOutlined onClick={onTogglePassword} />
                        ) : (
                          <EyeInvisibleOutlined onClick={onTogglePassword} />
                        )
                      }
                    />
                    <div className='isoPasswordStrengthWrapper'>
                      <PasswordStrengthBar
                        className='isoPasswordStrength'
                        scoreWords={[]}
                        password={values.password}
                        shortScoreWord=''
                      />
                      <span className='isoPasswordScore'>
                        {!values.password ? 'Password is blank' : ''}
                      </span>
                      <Popover content={PasswordHintText} placement='right'>
                        <InfoCircleFilled className='isoPasswordHint' />
                      </Popover>
                    </div>
                  </div>

                  <div className='isoInputWrapper'>
                    <label className='formLabel'>Type it again</label>
                    <Field
                      name='confirmPassword'
                      type='password'
                      component={InputField}
                      disabled={isInValidToken}
                    />
                  </div>

                  <div className='isoInputWrapper paddingBottom'>
                    {successMsg && <SuccessText text={successMsg} />}
                    <Button
                      type='primary'
                      shape='round'
                      htmlType='submit'
                      loading={resetAction.loading}
                      disabled={isInValidToken}
                    >
                      <IntlMessages id='page.resetPassSave' />
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </ResetPasswordStyleWrapper>
  );
};

export default ResetPassword;
