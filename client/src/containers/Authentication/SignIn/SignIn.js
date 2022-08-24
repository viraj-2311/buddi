import React, { useEffect, useState } from 'react';
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Checkbox from '@iso/components/uielements/checkbox';
import IntlMessages from '@iso/components/utility/intlMessages';
import LogoWrapper from '@iso/components/utility/logoWrapper.style';
import { Formik, Field, Form } from 'formik';
import SignInStyleWrapper from './SignIn.styles';
import { InputField } from '@iso/components';
import Button from '@iso/components/uielements/button';
import ErrorComponent from '@iso/components/ErrorComponent';
import * as authAction from '@iso/redux/auth/actions';
import appAction from '@iso/redux/app/actions';
import validationSchema from './schema';

const { signinRequest } = authAction;
const { clearMenu } = appAction;

export default function SignIn (){
  let history = useHistory();
  let location = useLocation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.Auth.token.access);
  const {
    user,
    signin: { error: signInError, loading: signInLoading },
  } = useSelector((state) => state.Auth);
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setRedirectToReferrer(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!signInLoading && !signInError && user) {
      if (user.companies && user.companies.length) {
        history.push(`/companies/${user.companies[0].id}/jobs`);
      } else {
        history.push('/jobs');
      }
    }
  }, [signInError, signInLoading]);

  const signInFields = {
    email: '',
    password: '',
  };

  const handleLogin = (values) => {
    dispatch(signinRequest({ email: values.email, password: values.password }));
    dispatch(clearMenu());
  };

  const goToSignUp = () => {
    history.push('/signup');
  };

  let { from } = location.state || { from: { pathname: '/jobs' } };

  if (redirectToReferrer) {
    return <Redirect to={from} />;
  }

  const SignInForm = ({ isValid, values, setFieldValue, isSubmitting }) => {
    return (
      <Form>
        <div className='isoInputWrapper'>
          <span className='field-label'>Email</span>
          <Field
            component={InputField}
            name='email'
            type='text'
            onChange={(e) =>
              setFieldValue('email', e.target.value.replace(/\s/g, ''))
            }
          />
        </div>

        <div className='isoInputWrapper'>
          <span className='field-label'>Password</span>
          <Field component={InputField} name='password' type='password' />
        </div>

        <div className='isoActionWrapper leftRightComponent'>
          <Checkbox className='isoRememberMe'>
            <IntlMessages id='page.signInRememberMe' />
          </Checkbox>
          <Link to='/forgot-password' className='isoForgotPass'>
            <IntlMessages id='page.signInForgotPass' />
          </Link>
        </div>
        <div className='isoActionWrapper paddingBottom'>
          {isSubmitting && signInError && (
            <ErrorComponent error={signInError} />
          )}

          <div className='leftRightComponent'>
            <Button
              htmlType='submit'
              type='primary'
              shape='round'
              className='isoSignInBtn'
              loading={signInLoading}
            >
              <IntlMessages id='page.signInButton' />
            </Button>
            <Button shape='round' className='isoSignUpBtn' onClick={goToSignUp}>
              <IntlMessages id='page.signUpButton' />
            </Button>
          </div>
        </div>
      </Form>
    );
  };

  return (
    <SignInStyleWrapper className='isoSignInPage'>
       <div className="logo-left-area">
        <LogoWrapper/>
      </div>
      <div className='isoLoginContentWrapper'>
        <div className='isoLoginContent'>
          <div className='isoSignInForm'>
            <div className='isoLoginTitleWrapper'>
              <h3>
                <IntlMessages id='page.signInTitle' />
              </h3>
            </div>
            <Formik
              initialValues={signInFields}
              onSubmit={handleLogin}
              validationSchema={validationSchema}
              component={SignInForm}
            />
          </div>
        </div>
      </div>
    </SignInStyleWrapper>
  );
}
