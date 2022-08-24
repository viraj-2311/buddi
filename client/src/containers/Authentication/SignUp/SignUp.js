import React, { useEffect, useRef, useState } from 'react';
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col } from 'antd';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import SignUpStyleWrapper, { PasswordHintTextWrapper } from './SignUp.styles';
import Button from '@iso/components/uielements/button';
import Checkbox from '@iso/components/uielements/checkbox';
import Popover from '@iso/components/uielements/popover';
import { InputField } from '@iso/components';
import LogoWrapper from '@iso/components/utility/logoWrapper.style';
import IntlMessages from '@iso/components/utility/intlMessages';
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  InfoCircleFilled,
} from '@ant-design/icons';
import ErrorComponent from '@iso/components/ErrorComponent';
import PasswordStrengthBar from 'react-password-strength-bar';
import { USER_SIGNUP, INVITE_SIGNUP } from '@iso/redux/auth/constants';
import { signupRequest } from '@iso/redux/auth/actions';
import appAction from '@iso/redux/app/actions';
import {
  invitationAcceptRequest,
  acceptCompanyOwnerInvitationRequest,
} from '@iso/redux/auth/actions';
import { accountValidationSchema } from './schema';
import basicStyle from '@iso/assets/styles/constants';

const buttonMargin = {
  marginLeft: '10px',
};

const { clearMenu } = appAction;

const { rowStyle, colStyle, gutter } = basicStyle;

export default function SignUp() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const { isLoggedIn, inviteTokenError, invitedUser } = useSelector(
    (state) => ({
      isLoggedIn: state.Auth.token.access,
      inviteTokenError: state.Auth.invitation.error,
      invitedUser: state.Auth.invitation.user,
    })
  );
  const {
    user: signUpUser,
    error: signUpError,
    loading: signUpLoading,
  } = useSelector((state) => state.Auth.signup);

  const [isRevealPassword, setIsRevealPassword] = useState(false);
  const [isRevealConfirmPassword, setIsRevealConfirmPassword] = useState(false);
  const [isTokenUrl, setIsTokenUrl] = useState(false);
  const [user, setUser] = useState({});
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);
  const formikRef = useRef();

  useEffect(() => {
    if (signUpUser && !signUpLoading && !signUpError) {
      if (isTokenUrl) {
        history.push('/login');
      } else {
        history.push('/signup/welcome');
      }
    }
  }, [signUpUser, signUpLoading, signUpError]);

  useEffect(() => {
    if (isLoggedIn) {
      setRedirectToReferrer(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const { search } = location;

    if (search && search.includes('token')) {
      const queries = search.split('?token=');
      const token = queries[queries.length - 1];
      setIsTokenUrl(true);
      dispatch(acceptCompanyOwnerInvitationRequest(token));
    } else {
      setIsTokenUrl(false);
    }
  }, [location, dispatch]);

  useEffect(() => {
    if (isTokenUrl && invitedUser && invitedUser.id) {
      if (invitedUser.registered) {
        history.push('/login');
      }

      setUser(invitedUser);
    }
  }, [invitedUser]);

  const { from } = location.state || { from: { pathname: '/jobs' } };

  if (redirectToReferrer) {
    return <Redirect to={from} />;
  }

  const signUpFields = {
    id: user?.id,
    jobTitle: user?.jobTitle || '',
    fullName: user?.fullName || '',
    email: user?.email || '',
    password: '',
    acceptTerms: false,
  };

  const handleSignUp = async (values) => {
    const signUpType = user?.id ? INVITE_SIGNUP : USER_SIGNUP;
    try {
      dispatch(signupRequest({ formData: { ...values }, signUpType, history }));
      dispatch(clearMenu());
    } catch (e) {}
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

  const SignUpForm = ({
    values,
    touched,
    errors,
    setFieldValue,
    isSubmitting,
  }) => {
    return (
      <Form>
        <div className='formGroup'>
          <label className='fieldLabel required'>Primary Gig Role</label>
          <Field component={InputField} name='jobTitle' type='text' />
        </div>
        <div className='formGroup'>
          <label className='fieldLabel required'>Full Name</label>
          <Field component={InputField} name='fullName' type='text' />
        </div>
        <div className='formGroup'>
          <label className='fieldLabel required'>Email</label>
          <Field
            component={InputField}
            name='email'
            type='text'
            disabled={user.email}
            onChange={(e) =>
              setFieldValue('email', e.target.value.replace(/\s/g, ''))
            }
          />
        </div>
        <div className='formGroup'>
          <label className='fieldLabel required'>Password</label>
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
        <div className='formGroup'>
          <label className='fieldLabel required'>Confirm Password</label>
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

        <div className='isoAcceptTermsWrapper'>
          <div className='isoAcceptTerms'>
            <Checkbox
              checked={values.acceptTerms}
              onChange={(e) => setFieldValue('acceptTerms', e.target.checked)}
            />
            <span style={{ marginLeft: '10px' }}>
              I agree to the Buddi&nbsp;
              <Link to='/term-of-service' className='isoTosButton'>
                <IntlMessages id='page.termOfService' />
              </Link>
            </span>
          </div>
          {errors.acceptTerms && touched.acceptTerms && (
            <div className='helper-text'>{errors.acceptTerms}</div>
          )}
        </div>

        <div className='isoActionWrapper'>
          {!signUpLoading && signUpError && (
            <ErrorComponent error={signUpError} />
          )}

          <div className='isoLeftRightComponent'>
            <Button
              htmlType='submit'
              type='primary'
              shape='round'
              loading={signUpLoading}
              className='button-create'
            >
              Create Account
            </Button>
            <div className='isoSignInLink'>
              Already a member? <Link to='/login'>Sign In</Link>
            </div>
          </div>
        </div>
      </Form>
    );
  };

  if (isTokenUrl && !invitedUser) {
    return (
      <SignUpStyleWrapper className='isoSignUpPage'>
        <div className='isoSignUpTokenError'>{inviteTokenError}</div>
      </SignUpStyleWrapper>
    );
  }

  return (
    <SignUpStyleWrapper className='isoSignUpPage'>
      <div className="logo-left-area">
        <LogoWrapper/>
      </div>
      <div className='isoSignUpContentWrapper'>
        <div className='isoSignUpContent'>
          <div className='isoSignUpTitleWrapper'>
            <h3>Create your Buddi Account</h3>
          </div>

          <div className='isoSignUpForm'>
            <Formik
              innerRef={formikRef}
              enableReinitialize
              initialValues={signUpFields}
              onSubmit={handleSignUp}
              validationSchema={accountValidationSchema}
              component={SignUpForm}
            />
          </div>
        </div>
      </div>
    </SignUpStyleWrapper>
  );
}
