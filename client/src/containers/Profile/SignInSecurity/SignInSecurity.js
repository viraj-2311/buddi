import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import { Card, Col, Row } from 'antd';
import PasswordStrengthBar from 'react-password-strength-bar';

import InputField from '@iso/components/shared/InputField/InputField';
import notify from '@iso/lib/helpers/notify';
import Button from '@iso/components/uielements/button';
import { changePasswordRequest } from '@iso/redux/user/actions';
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  InfoCircleFilled,
} from '@ant-design/icons';
import Popover from '@iso/components/uielements/popover';

import { SignInSecurityValidation } from './schema';
import {
  SignInSecurityWrapper,
  PasswordHintTextWrapper,
  ChangePasswordFormWrapper,
} from './SignInSecurity.style';

const ChangePassword = ({ user }) => {
  const [isRevealPassword, setIsRevealPassword] = useState(false);
  const [isRevealConfirmPassword, setIsRevealConfirmPassword] = useState(false);
  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();
  const { error: passwordError, loading } = useSelector(
    (state) => state.User.password
  );
  const { user: authUser } = useSelector((state) => state.Auth);
  const [passwordFields, setpasswordFields] = useState({
    id: authUser?.id,
    currentPassword: '',
    password: '',
    confirmPassword: '',
  });
  const formikRef = useRef();

  useEffect(() => {
    if (!loading && !passwordError && loader) {
      notify('success', 'Password Changed successfully');
      formikRef.current.resetForm();
    }

    if (!loading && loader) {
      setLoader(false);
    }
    if (passwordError) {
      notify('error', 'Failed to change password');
    }
  }, [loading, passwordError]);

  const handleChangePassword = (values) => {
    try {
      setLoader(true);
      const payload = {
        new_password: values.confirmPassword,
        old_password: values.currentPassword,
      };
      dispatch(changePasswordRequest(payload));
      setpasswordFields({});
    } catch (e) {
      setLoader(false);
    }
  };

  const onTogglePassword = (event) => {
    setIsRevealPassword(!isRevealPassword);
  };

  const onToggleConfirmPassword = (event) => {
    setIsRevealConfirmPassword(!isRevealConfirmPassword);
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

  const ChangePasswordForm = ({ values, touched, errors }) => {
    return (
      <ChangePasswordFormWrapper>
        <Form>
          <h2>Sign in & Security</h2>
          <h3>Change Password</h3>
          <p>Choose a unique password to protect your account</p>
          <Row>
            <Col md={12}>
              <div className='formGroup'>
                <label className='fieldLabel'>Type your current password</label>
                <Field
                  name='currentPassword'
                  component={InputField}
                  type='password'
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <div className='formGroup'>
                <label className='fieldLabel'>New password</label>
                <Field
                  name='password'
                  component={InputField}
                  type={isRevealPassword ? 'text' : 'password'}
                  icon={
                    isRevealPassword ? (
                      <EyeOutlined onClick={onTogglePassword} />
                    ) : (
                      <EyeInvisibleOutlined onClick={onTogglePassword} />
                    )
                  }
                />
                {touched.password && errors.password && (
                  <div className='helper-text lowercase'>{errors.password}</div>
                )}

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
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <div className='formGroup'>
                <label className='fieldLabel'>Try it again</label>
                <Field
                  component={InputField}
                  name='confirmPassword'
                  type={isRevealConfirmPassword ? 'text' : 'password'}
                  icon={
                    isRevealConfirmPassword ? (
                      <EyeOutlined onClick={onToggleConfirmPassword} />
                    ) : (
                      <EyeInvisibleOutlined onClick={onToggleConfirmPassword} />
                    )
                  }
                />
              </div>
            </Col>
          </Row>
          <Row className='actionRow'>
            <Col span={24}>
              <Button htmlType='submit' type='primary' shape='round'>
                Change Password
              </Button>
            </Col>
          </Row>
        </Form>
      </ChangePasswordFormWrapper>
    );
  };

  return (
    <SignInSecurityWrapper>
      <Card>
        <Formik
          innerRef={formikRef}
          initialValues={passwordFields}
          validationSchema={SignInSecurityValidation}
          onSubmit={(values) => handleChangePassword(values)}
          component={ChangePasswordForm}
        ></Formik>
      </Card>
    </SignInSecurityWrapper>
  );
};

export default ChangePassword;
