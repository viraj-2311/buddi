import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col } from 'antd';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { uploadFile } from '@iso/lib/helpers/s3';
import Spin from '@iso/components/uielements/spin';
import Button from '@iso/components/uielements/button';
import Input from '@iso/components/uielements/input';
import NumberFormat from 'react-number-format';
import { InputField } from '@iso/components';
import LocationField from '@iso/components/LocationField';
import ZipCode from '@iso/components/shared/ZipCode';
import Select, { SelectOption } from '@iso/components/uielements/select';
import Radio, { RadioGroup } from '@iso/components/uielements/radio';
import IntlMessages from '@iso/components/utility/intlMessages';
import ImageUpload from '../../../components/ImageUpload/ImageUpload';
import ErrorComponent from '@iso/components/ErrorComponent';
import Logo from '@iso/assets/images/logo-black.webp';
import { companyValidationSchema } from './schema';
import basicStyle from '@iso/assets/styles/constants';
import { maxFileUploadSize } from '@iso/config/env';
import appAction from '@iso/redux/app/actions';
import {
  registerCompanyRequest,
  fetchCompanyDetailByEmailRequest,
} from '@iso/redux/auth/actions';
import { fetchLocationsRequest } from '@iso/redux/location/actions';

const Option = SelectOption;
const { clearMenu } = appAction;
const { rowStyle, colStyle, gutter } = basicStyle;
const defaultCompany = {
  firstName: '',
  lastName: '',
  jobTitle: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  email: '',
  title: '',
  website: '',
  vimeo: '',
  profilePhotoS3Url: '',
};

export default ({ user, onSuccess }) => {
  const dispatch = useDispatch();

  const {
    company: registerCompany,
    error: registerCompanyError,
    loading: registerCompanyLoading,
  } = useSelector((state) => state.Auth.registerCompany);
  const { company, loading: fetchCompanyDetailLoading } = useSelector(
    (state) => state.Auth.fetchCompanyDetail
  );
  const { locations } = useSelector((state) => state.Location);

  const [isImageUploadFailed, setIsImageUploadFailed] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [originProfileImage, setOriginProfileImage] = useState(null);
  const [loader, setLoader] = useState(false);
  const [locked, setLocked] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    ...defaultCompany,
    companyType: 'Production Company',
    companyRelationship: 'OWNER',
    firstName: user.firstName,
    lastName: user.lastName,
    userEmail: user.email,
    ownerEmail: user.email,
    jobTitle: user.jobTitle,
    title: user.companyName,
    acceptTerms: false,
  });

  const formikRef = useRef();

  useEffect(() => {
    dispatch(fetchLocationsRequest());

    if (user.email) {
      dispatch(fetchCompanyDetailByEmailRequest({ email: user.email }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (loader && !registerCompanyLoading && !registerCompanyError) {
      onSuccess(registerCompany);
    }

    if (!registerCompanyLoading && loader) {
      setLoader(false);
    }
  }, [registerCompanyLoading, registerCompanyError]);

  useEffect(() => {
    if (fetchCompanyDetailLoading) return;

    if (company && company.id) {
      setCompanyForm({ ...formikRef.current.values, ...company });
      setProfileImage(company.profilePhotoS3Url);
      setOriginProfileImage(company.originProfilePhotoS3Url);

      if (formikRef.current.values.companyRelationship === 'PRIVILEGED STAFF') {
        setLocked(true);
      }
    } else {
      if (formikRef.current.values.companyRelationship === 'PRIVILEGED STAFF') {
        setCompanyForm({
          ...formikRef.current.values,
          ...defaultCompany,
        });
        setLocked(false);
      }
      setLocked(false);
      setProfileImage(null);
      setOriginProfileImage(null);
    }
  }, [company, fetchCompanyDetailLoading]);

  const handleProfileImage = (file) => {
    setProfileImage(file);
  };

  const handleOriginProfileImage = (file) => {
    setOriginProfileImage(file);
  };

  const handleRegisterCompany = async (values) => {
    const payload = { ...values };
    delete payload['acceptTerms'];

    try {
      setLoader(true);
      if (profileImage instanceof File) {
        const profileS3DirName =
          process.env.REACT_APP_S3_BUCKET_PROFILE_DIRNAME;
        const s3File = await uploadFile(profileImage, profileS3DirName);

        if (s3File.location) {
          payload['profilePhotoS3Url'] = s3File.location;
        }
      } else {
        payload['profilePhotoS3Url'] = profileImage;
      }

      if (originProfileImage instanceof File) {
        const profileS3DirName =
          process.env.REACT_APP_S3_BUCKET_PROFILE_DIRNAME;
        const s3OriginFile = await uploadFile(
          originProfileImage,
          profileS3DirName
        );

        if (s3OriginFile.location) {
          payload['originProfilePhotoS3Url'] = s3OriginFile.location;
        }
      } else {
        payload['originProfilePhotoS3Url'] = originProfileImage;
      }

      dispatch(registerCompanyRequest({ formData: payload }));
      dispatch(clearMenu());
    } catch (e) {
      setLoader(false);
      setIsImageUploadFailed(true);
    }
  };

  const handleFetchCompanyByEmail = (email) => {
    if (!email) return;

    const payload = { email };
    dispatch(fetchCompanyDetailByEmailRequest(payload));
  };

  const handleCompanyRelationshipChange = (e) => {
    const companyRelationship = e.target.value;

    if (companyRelationship === 'OWNER') {
      setCompanyForm({
        ...defaultCompany,
        companyType: 'Production Company',
        companyRelationship,
        firstName: user.firstName,
        lastName: user.lastName,
        jobTitle: user.jobTitle,
        title: user.companyName,
        userEmail: user.email,
        ownerEmail: user.email,
        acceptTerms: false,
      });
      setLocked(false);
      dispatch(fetchCompanyDetailByEmailRequest({ email: user.email }));
    } else {
      setCompanyForm({
        ...formikRef.current.values,
        ...defaultCompany,
        companyRelationship,
        ownerEmail: '',
        acceptTerms: false,
      });
      setLocked(false);
      setProfileImage(null);
      setOriginProfileImage(null);
    }
  };

  return (
    <Row style={rowStyle} justify='center'>
      <Col xxl={16} md={16} sm={24} xs={24}>
        <div className='isoSignUpContentWrapper'>
          <div className='isoSignUpContent'>
            <div className='logoWrapper'>
              <img src={Logo} className='logo' />
            </div>
            <h2 className='signUpTitle'>Create your Bandleader</h2>
            <div className='isoSignUpForm'>
              <Formik
                innerRef={formikRef}
                enableReinitialize
                initialValues={companyForm}
                onSubmit={handleRegisterCompany}
                validationSchema={companyValidationSchema}
              >
                {({ values, touched, errors, setFieldValue }) => (
                  <Form>
                    <Row style={rowStyle} gutter={gutter} justify='start'>
                      <Col md={24} sm={24} xs={24}>
                        <span className='field-label required'>
                          Company Type
                        </span>
                        <Field>
                          {() => (
                            <Select
                              showSearch
                              name='companyType'
                              style={{ width: '100%' }}
                              value={values.companyType}
                              onChange={(value) => {
                                setFieldValue('companyType', value);
                              }}
                            >
                              <Option key='1' value='Production Company'>
                                Production Company
                              </Option>
                              <Option key='2' value='Agency' disabled>
                                Agency
                              </Option>
                              <Option key='3' value='Brand' disabled>
                                Brand
                              </Option>
                            </Select>
                          )}
                        </Field>
                        {touched.companyType && errors.companyType && (
                          <div className='helper-text lowercase'>
                            {errors.companyType}
                          </div>
                        )}
                      </Col>
                    </Row>
                    <Row style={rowStyle} gutter={gutter} justify='center'>
                      <Col md={16} sm={16} xs={24} className='text-center'>
                        <span className='field-label required'>
                          Are you the band account owner?
                        </span>
                        <Field name='companyRelationship'>
                          {() => (
                            <RadioGroup
                              value={values.companyRelationship}
                              onChange={handleCompanyRelationshipChange}
                            >
                              <Radio value='OWNER'>Yes</Radio>
                              <Radio value='PRIVILEGED STAFF'>No</Radio>
                            </RadioGroup>
                          )}
                        </Field>
                      </Col>
                    </Row>
                    <Row style={rowStyle} gutter={gutter} justify='center'>
                      <Col md={12} sm={12} xs={24} className='text-center'>
                        <span className='field-label required'>
                          Bandleader Email
                        </span>
                        <Input
                          value={values.ownerEmail}
                          onChange={(e) =>
                            setFieldValue('ownerEmail', e.target.value)
                          }
                          onPressEnter={(e) => {
                            e.preventDefault();
                            handleFetchCompanyByEmail(e.target.value);
                          }}
                          onBlur={(e) =>
                            handleFetchCompanyByEmail(e.target.value)
                          }
                          disabled={values.companyRelationship === 'OWNER'}
                        />
                      </Col>
                    </Row>

                    <Spin spinning={fetchCompanyDetailLoading}>
                      <div
                        className={`companyFields ${
                          locked ? 'no-pointer-events' : ''
                        }`}
                      >
                        <Row style={rowStyle} gutter={gutter} justify='start'>
                          <Col span={24}>
                            <ImageUpload
                              image={profileImage}
                              originImage={originProfileImage}
                              maxSize={maxFileUploadSize}
                              onChange={handleProfileImage}
                              onOriginChange={handleOriginProfileImage}
                              helperText='Upload your company logo'
                            />
                            {isImageUploadFailed && (
                              <div className='helper-text lowercase'>
                                Uploading Image Failed
                              </div>
                            )}
                          </Col>
                        </Row>
                        <Row style={rowStyle} gutter={gutter} justify='start'>
                          <Col md={12} sm={12} xs={24}>
                            <span className='field-label required'>
                              Band Name
                            </span>
                            <Field
                              component={InputField}
                              name='title'
                              type='text'
                            />
                          </Col>
                          <Col md={12} sm={12} xs={24}>
                            <span className='field-label required'>
                              Owner Gig Title
                            </span>
                            <Field
                              component={InputField}
                              name='jobTitle'
                              type='text'
                            />
                          </Col>
                        </Row>
                        <Row style={rowStyle} gutter={gutter} justify='start'>
                          <Col md={12} sm={12} xs={24}>
                            <span className='field-label required'>
                              Owner First Name
                            </span>
                            <Field
                              component={InputField}
                              name='firstName'
                              type='text'
                            />
                          </Col>
                          <Col md={12} sm={12} xs={24}>
                            <span className='field-label required'>
                              Owner Last Name
                            </span>
                            <Field
                              component={InputField}
                              name='lastName'
                              type='text'
                            />
                          </Col>
                        </Row>
                        <Row style={rowStyle} gutter={gutter} justify='start'>
                          <Col md={12} sm={12} xs={24}>
                            <span className='field-label required'>
                              Band Email
                            </span>
                            <Field
                              component={InputField}
                              name='email'
                              type='text'
                              onChange={(e) =>
                                setFieldValue(
                                  'email',
                                  e.target.value.replace(/\s/g, '')
                                )
                              }
                            />
                          </Col>
                          <Col md={12} sm={12} xs={24}>
                            <span className='field-label required'>
                              Band Phone
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
                            {touched.phone && errors.phone && (
                              <div className='helper-text lowercase'>
                                {errors.phone}
                              </div>
                            )}
                          </Col>
                        </Row>
                        <Row style={rowStyle} gutter={gutter} justify='start'>
                          <Col md={24} sm={24} xs={24}>
                            <span className='field-label required'>
                              Band Address
                            </span>
                            <Field
                              component={InputField}
                              name='street'
                              type='text'
                            />
                          </Col>
                        </Row>
                        <Row style={rowStyle} gutter={gutter} justify='start'>
                          <Col md={12} sm={12} xs={24}>
                            <span className='field-label required'>City</span>
                            <Field name='city'>
                              {() => (
                                <LocationField
                                  value={values.city}
                                  locations={locations.city}
                                  onChange={(city) =>
                                    setFieldValue('city', city)
                                  }
                                />
                              )}
                            </Field>
                            {touched.city && errors.city && (
                              <div className='helper-text lowercase'>
                                {errors.city}
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
                            {touched.state && errors.state && (
                              <div className='helper-text lowercase'>
                                {errors.state}
                              </div>
                            )}
                          </Col>
                          <Col md={4} sm={4} xs={24}>
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
                            {touched.zipCode && errors.zipCode && (
                              <div className='helper-text lowercase'>
                                {errors.zipCode}
                              </div>
                            )}
                          </Col>
                        </Row>
                        <Row style={rowStyle} gutter={gutter} justify='start'>
                          <Col md={12} sm={12} xs={24}>
                            <span className='field-label'>Vimeo</span>
                            <Field
                              component={InputField}
                              name='vimeo'
                              type='text'
                            />
                          </Col>
                          <Col md={12} sm={12} xs={24}>
                            <span className='field-label'>Website</span>
                            <Field
                              component={InputField}
                              name='website'
                              type='text'
                            />
                          </Col>
                        </Row>
                      </div>
                    </Spin>

                    <Row style={rowStyle} gutter={gutter} justify='start'>
                      <Col md={24} sm={24} xs={24}>
                        <div className='form-group form-check'>
                          <Field
                            type='checkbox'
                            name='acceptTerms'
                            className={
                              'form-check-input ' +
                              (errors.acceptTerms && touched.acceptTerms
                                ? ' is-invalid'
                                : '')
                            }
                          />
                          <label
                            htmlFor='acceptTerms'
                            className='form-check-label'
                          >
                            &nbsp;&nbsp;I agree to the Buddi&nbsp;
                            <Link
                              to='/term-of-service'
                              className='isoTosButton'
                            >
                              <IntlMessages id='page.termOfService' />
                            </Link>
                            &nbsp;and&nbsp;
                            <Link
                              to='/privacy-policy'
                              className='isoPrivacyButton'
                            >
                              <IntlMessages id='page.privacyPolicy' />
                            </Link>
                          </label>
                          <ErrorMessage
                            name='acceptTerms'
                            component='div'
                            className='helper-text'
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        {!loader && registerCompanyError && (
                          <ErrorComponent error={registerCompanyError} />
                        )}
                        <Button
                          htmlType='submit'
                          type='primary'
                          loading={loader}
                        >
                          {!fetchCompanyDetailLoading &&
                          company &&
                          values.companyRelationship === 'PRIVILEGED STAFF'
                            ? 'Send Request'
                            : 'Confirm'}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};
