import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WalletUserRegister, {
  SSNHintTextWrapper,
} from './WalletUserRegister.style';
import { Col, Row } from 'antd';
import { Field, Form, Formik } from 'formik';
import Button from '@iso/components/uielements/button';
import basicStyle from '@iso/assets/styles/constants';
import { InputField } from '@iso/components';
import NumberFormat from 'react-number-format';
import Input from '@iso/components/uielements/input';
import LocationField from '@iso/components/LocationField';
import ZipCode from '@iso/components/shared/ZipCode';
import { formatDateString } from '@iso/lib/helpers/utility';
import PopupRegisterSuccess from './PopupRegisterSuccess';
import DateInput from '@iso/components/DateInput';
import schemaValidateRegisterWallet from './schema';
import Spin from '@iso/components/uielements/spin';
import { WalletStatus, checkStatusFailed } from '@iso/enums/wallet_status';
import {
  getCorporateSilaUser,
  postUserRequestKYC,
  registerSilaUser,
  updateSilaUser,
} from '@iso/redux/user/actions';
import Popover from '@iso/components/uielements/popover';
import _ from 'lodash';
import notify from '@iso/lib/helpers/notify';
import IconInfo from '@iso/components/icons/IconInfo';
import { InfoCircleFilled } from '@ant-design/icons';
import { getUserSilaKYC } from '@iso/redux/user/actions';

const { rowStyle, gutter } = basicStyle;
export default forwardRef(
  ({ userDetail, goToNextStep, statusWallet, allowDisplayPopup }, ref) => {
    const dispatch = useDispatch();
    const formikRef = useRef(null);
    const { locations } = useSelector((state) => state.Location);
    const { silaKYC, silaUser } = useSelector((state) => state.User);
    const [showPopupSuccess, displayPopupRegisterSuccess] = useState(false);
    const [displayUpdateMode, setDisplayUpdateMode] = useState(false);
    const [allowRequestKYC, setAllowRequestKYC] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [registerWalletApiErrors, setRegisterWalletApiErrors] = useState({});
    const backendErrorKeyFormFieldNameMap = {
      first_name: 'firstName',
      last_name: 'lastName',
      social_security_number: 'securityNumber',
      date_of_birth: 'birthday',
      phone_number: 'phone',
      home_address: 'street',
      city: 'city',
      state: 'state',
      zip: 'zip',
    };

    useEffect(() => {
      if (userDetail) {
        let data = initData(userDetail);
        setUserInfo(data);
        if (!silaKYC.silaKYC.id) {
          dispatch(getCorporateSilaUser());
        }
      }
      if (checkStatusFailed(statusWallet)) {
        setDisplayUpdateMode(true);
      }
    }, []);

    useEffect(() => {
      if (silaKYC.silaKYC.id && allowDisplayPopup) {
        setLoading(false);
        displayPopupRegisterSuccess(true);
      } else if (!silaKYC.loading && silaKYC.error) {
        setLoading(false);
        setAllowRequestKYC(false);
        if (silaKYC.error.error) {
          notify('error', silaKYC.error.error);
        } else {
          notify('error', JSON.stringify(silaKYC.error));
        }
      }
    }, [silaKYC]);

    useEffect(() => {
      if (
        silaUser &&
        silaUser.userInfo &&
        silaUser.userInfo.id &&
        !allowRequestKYC
      ) {
        setDisplayUpdateMode(true);
        let userInfo = silaUser.userInfo;
        let formData = {};
        formData.firstName = userInfo.firstName || '';
        formData.lastName = userInfo.lastName || '';
        formData.securityNumber = userInfo.socialSecurityNumber || '';
        formData.birthday =
          formatDateString(userInfo.dateOfBirth, 'MM/DD/YYYY') || '';
        formData.phone = userInfo.phoneNumber || '';
        formData.street = userInfo.homeAddress || '';
        formData.city = userInfo.city || '';
        formData.state = userInfo.state || '';
        formData.zipCode = userInfo.zip || '';
        setUserInfo(formData);
      }
    }, [silaUser]);

    useEffect(() => {
      if (
        silaUser.userInfo &&
        !silaUser.loading &&
        !silaKYC.silaKYC.id &&
        allowRequestKYC
      ) {
        dispatch(postUserRequestKYC());
      } else if (!silaUser.loading && silaUser.error) {
        setLoading(false);
        setAllowRequestKYC(false);
        if (silaUser.error.error) {
          notify('error', silaUser.error.error);
        } else {
          const errors = {};
          for (let errorKey in backendErrorKeyFormFieldNameMap) {
            if (silaUser.error[errorKey]) {
              errors[backendErrorKeyFormFieldNameMap[errorKey]] =
                silaUser.error[errorKey];
            }
          }

          setRegisterWalletApiErrors(errors);
        }
      }
    }, [silaUser]);

    const initData = (user) => {
      var userInfo = {};
      userInfo.firstName = user.firstName || '';
      userInfo.lastName = user.lastName || '';
      userInfo.securityNumber = user.securityNumber || '';
      userInfo.birthday = formatDateString(user.birthday, 'MM/DD/YYYY');
      userInfo.phone = user.phone || '';
      userInfo.street = user.street || '';
      userInfo.city = user.city || '';
      userInfo.state = user.state || '';
      userInfo.zipCode = user.zipCode || '';
      return userInfo;
    };

    const handleRegisterWallet = (userInfo) => {
      let data = {
        first_name: userInfo.firstName,
        last_name: userInfo.lastName,
        social_security_number: userInfo.securityNumber,
        date_of_birth: formatDateString(userInfo.birthday, 'YYYY-MM-DD'),
        phone_number: userInfo.phone,
        home_address: userInfo.street,
        city: userInfo.city,
        state: userInfo.state,
        zip: userInfo.zipCode,
      };
      const payload = _.cloneDeep(data);
      if (
        checkStatusFailed(statusWallet) ||
        (silaUser.userInfo && silaUser.userInfo.id && !allowRequestKYC)
      ) {
        setLoading(true);
        setAllowRequestKYC(true);
        dispatch(updateSilaUser(payload));
      } else {
        setLoading(true);
        setAllowRequestKYC(true);
        dispatch(registerSilaUser(payload));
      }
    };

    const navigateToVerification = () => {
      displayPopupRegisterSuccess(false);
      setTimeout(() => {
        dispatch(getUserSilaKYC());
      }, 1000);
      goToNextStep();
    };

    useImperativeHandle(ref, () => ({
      hidePopupSuccess() {
        displayPopupRegisterSuccess(false);
      },
    }));

    const SSNHintText = () => {
      return (
        <SSNHintTextWrapper>
          <p>
            <strong>SSN</strong>
          </p>
          <span>
            US Federal regulations require us to obtain your Social Security
            Number to confirm your identity. This will not impact your credit.
          </span>
        </SSNHintTextWrapper>
      );
    };

    const NameHintText = () => {
      return (
        <SSNHintTextWrapper>
          <p>
            <strong>Name/Address/DOB</strong>
          </p>
          <span>
            To help the government fight terrorism funding and money laundering,
            all financial institutions are required by federal law to obtain,
            verify, and record information about you, including your name,
            address, and date of birth. We may also ask to see your driver's
            license or other identifying documents.
          </span>
        </SSNHintTextWrapper>
      );
    };

    return (
      <WalletUserRegister>
        <PopupRegisterSuccess
          visible={showPopupSuccess}
          action={navigateToVerification}
          title={'Success!'}
          description={
            'You are now registered. Please Click Next to verify your identity.'
          }
          titleButton={'Next'}
        />
        <Spin spinning={loading}>
          <div className='content'>
            {checkStatusFailed(statusWallet) && (
              <div className='kyc-wallet'>
                <div>
                  <p className='verification-title'>ID Verification</p>
                  <span className='description'>
                    We must verify that all users of the Buddi platform are who
                    they say they are, present a low fraud risk, and are not on
                    any watchlists. We do this by submitting end-user
                    information for review by our identity verification partner.
                    The user will not be able to transact until the user is
                    verified.
                  </span>
                </div>
                <div>
                  <p className='verification-status'>ID Verification Status</p>
                  <div className='failed-status'>
                    <p className='username'>Kevin Loc</p>
                    <span className='failed'>Failed</span>
                  </div>
                </div>
              </div>
            )}
            {checkStatusFailed(statusWallet) && (
              <div className='document-require failed-container'>
                <div className='info-desc'>
                  <div className='icon-view'>
                    <IconInfo width={18} height={18} fill='#e25656' />
                  </div>
                  <div>
                    <p>You failed our initial ID Verification.</p>
                    <span className='description-warning'>
                      We allow our users a one-time opportunity to update their
                      registration data but if you fail again we will need more
                      documents which can be used to verify your information.
                    </span>
                  </div>
                </div>
              </div>
            )}
            <Formik
              innerRef={formikRef}
              enableReinitialize={true}
              initialValues={userInfo}
              validationSchema={schemaValidateRegisterWallet}
              onSubmit={handleRegisterWallet}
            >
              {({ values, errors, touched, setFieldValue }) => (
                <Form>
                  <div>
                    <p className='register-title'>
                      {checkStatusFailed(statusWallet)
                        ? 'Update Registration Data'
                        : 'Register User'}
                    </p>
                    {checkStatusFailed(statusWallet) && (
                      <span className='descRegister'>
                        For security purpose we need a few more details to prove
                        that you're a real person.
                      </span>
                    )}
                  </div>
                  <div className='content-view'>
                    <Row style={rowStyle} gutter={gutter} justify='start'>
                      <Col md={12} sm={12} xs={24}>
                        <span className='field-label required'>First Name</span>
                        <Field
                          component={InputField}
                          name='firstName'
                          type='text'
                        />
                        {touched.firstName &&
                          registerWalletApiErrors &&
                          registerWalletApiErrors.firstName && (
                            <div className='helper-text lowercase'>
                              {registerWalletApiErrors.firstName}
                            </div>
                          )}
                      </Col>
                      <Col md={12} sm={12} xs={24}>
                        <div className='ssn-view'>
                          <span className='field-label required'>
                            Last Name
                          </span>

                          <Popover content={NameHintText} placement='bottom'>
                            <InfoCircleFilled className='iconHint' />
                          </Popover>
                        </div>

                        <Field
                          component={InputField}
                          name='lastName'
                          type='text'
                        />
                        {touched.lastName &&
                          registerWalletApiErrors &&
                          registerWalletApiErrors.lastName && (
                            <div className='helper-text lowercase'>
                              {registerWalletApiErrors.lastName}
                            </div>
                          )}
                      </Col>
                    </Row>
                    <Row style={rowStyle} gutter={gutter} justify='start'>
                      <Col md={8} sm={12} xs={24}>
                        <span className='field-label required'>
                          Date of Birth mm/dd/yyyy
                        </span>
                        <DateInput
                          inputValue={values.birthday}
                          onChangeDateInput={(date) =>
                            setFieldValue('birthday', date)
                          }
                        />
                        {touched.birthday &&
                          (errors.birthday ||
                            registerWalletApiErrors.birthday) && (
                            <div className='helper-text lowercase'>
                              {errors.birthday ||
                                registerWalletApiErrors.birthday}
                            </div>
                          )}
                      </Col>
                      <Col md={8} sm={12} xs={24}>
                        <span className='field-label required'>
                          Phone Number
                        </span>
                        <NumberFormat
                          format='+1 (###) ###-####'
                          mask='_'
                          customInput={Input}
                          value={values.phone}
                          onValueChange={(phone) =>
                            setFieldValue('phone', phone.value)
                          }
                          name='phone'
                        />
                        {touched.phone &&
                          (errors.phone || registerWalletApiErrors.phone) && (
                            <div className='helper-text lowercase'>
                              {errors.phone || registerWalletApiErrors.phone}
                            </div>
                          )}
                      </Col>
                      <Col md={8} sm={12} xs={24}>
                        <div className='ssn-view'>
                          <span className='field-label required'>
                            Social Security Number
                          </span>

                          <Popover content={SSNHintText} placement='bottom'>
                            <InfoCircleFilled className='iconHint' />
                          </Popover>
                        </div>
                        <Field
                          component={InputField}
                          name='securityNumber'
                          type='text'
                        />
                        {touched.securityNumber &&
                          registerWalletApiErrors &&
                          registerWalletApiErrors.securityNumber && (
                            <div className='helper-text lowercase'>
                              {registerWalletApiErrors.securityNumber}
                            </div>
                          )}
                      </Col>
                    </Row>
                    <Row style={rowStyle} gutter={gutter} justify='start'>
                      <Col md={24} sm={24} xs={24}>
                        <span className='field-label required'>
                          Home Address
                        </span>
                        <Field
                          component={InputField}
                          name='street'
                          type='text'
                        />
                        {touched.street &&
                          registerWalletApiErrors &&
                          registerWalletApiErrors.street && (
                            <div className='helper-text lowercase'>
                              {registerWalletApiErrors.street}
                            </div>
                          )}
                      </Col>
                    </Row>
                    <Row style={rowStyle} gutter={gutter} justify='start'>
                      <Col md={8} sm={8} xs={24}>
                        <span className='field-label required'>City</span>
                        <Field name='city'>
                          {() => (
                            <LocationField
                              value={values.city}
                              locations={locations.city}
                              onChange={(city) => setFieldValue('city', city)}
                            />
                          )}
                        </Field>
                        {touched.city &&
                          (errors.city || registerWalletApiErrors.city) && (
                            <div className='helper-text lowercase'>
                              {errors.city || registerWalletApiErrors.city}
                            </div>
                          )}
                      </Col>
                      <Col md={8} sm={8} xs={24}>
                        <span className='field-label required'>State</span>
                        <Field>
                          {() => (
                            <LocationField
                              value={values.state}
                              locations={locations.state}
                              onChange={(state) =>
                                setFieldValue('state', state)
                              }
                            />
                          )}
                        </Field>
                        {touched.state &&
                          (errors.state || registerWalletApiErrors.state) && (
                            <div className='helper-text lowercase'>
                              {errors.state || registerWalletApiErrors.state}
                            </div>
                          )}
                      </Col>
                      <Col md={8} sm={8} xs={24}>
                        <span className='field-label required'>Zip</span>
                        <Field name='zipCode'>
                          {() => (
                            <ZipCode
                              value={values.zipCode}
                              onChange={(zipCode) =>
                                setFieldValue('zipCode', zipCode)
                              }
                            />
                          )}
                        </Field>
                        {touched.zipCode &&
                          (errors.zipCode || registerWalletApiErrors.zip) && (
                            <div className='helper-text lowercase'>
                              {errors.zipCode || registerWalletApiErrors.zip}
                            </div>
                          )}
                      </Col>
                    </Row>
                    <Row style={rowStyle} gutter={gutter} justify='center'>
                      <Button
                        htmlType='submit'
                        type='primary'
                        shape='round'
                        className='buttonWrap'
                      >
                        {displayUpdateMode ? 'Update' : 'Next'}
                      </Button>
                    </Row>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Spin>
      </WalletUserRegister>
    );
  }
);
