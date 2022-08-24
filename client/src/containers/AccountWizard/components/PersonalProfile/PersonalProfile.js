import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'antd';
import ZipCode from '@iso/components/shared/ZipCode';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Button from '@iso/components/uielements/button';
import LocationField from '@iso/components/LocationField';
import { InputField } from '@iso/components';
import basicStyle from '@iso/assets/styles/constants';
import PersonalProfileStyleWrapper from './PersonalProfile.styles';
import { updateWizardUserRequest } from '@iso/redux/accountWizard/actions';
import { fetchLocationsRequest } from '@iso/redux/location/actions';
import { fetchUserDetailRequest } from '@iso/redux/user/actions';
import { talentValidationSchema, bandLeaderValidationSchema } from './schema';
import notify from '@iso/lib/helpers/notify';
import { showServerError } from '@iso/lib/helpers/utility';
const { rowStyle, gutter } = basicStyle;

export default ({
  title,
  titleDescription,
  subTitle,
  onSuccess,
  onSkip,
  isBandLeader = false,
}) => {
  const dispatch = useDispatch();
  const { locations } = useSelector((state) => state.Location);
  const { user: authUser } = useSelector((state) => state.Auth);
  const { user } = useSelector((state) => state.User);
  const { wizard } = useSelector((state) => state.AccountWizard);
  const [action, setAction] = useState('');
  const [validationSchema, setValidationSchema] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    nickname: '',
    primaryInstrument: '',
    city: '',
    state: '',
    zipCode: '',
    linkToWork: '',
    website: '',
    union: '',
  });
  const formikRef = useRef();

  useEffect(() => {
    setValidationSchema(
      isBandLeader ? bandLeaderValidationSchema : talentValidationSchema
    );
  }, [isBandLeader]);

  useEffect(() => {
    dispatch(fetchUserDetailRequest(authUser.id));
    dispatch(fetchLocationsRequest());
  }, [dispatch]);

  useEffect(() => {
    if (!wizard.loading && !wizard.error && action === 'talent_update') {
      onSuccess();
    }

    if (wizard.error && action === 'talent_update') {
      notify('error', showServerError(wizard.error));
    }

    if (!wizard.loading && action === 'talent_update') {
      setAction('');
    }
  }, [wizard]);

  useEffect(() => {
    if (user && user.id) {
      setFormData({
        companyName: user.companyName || '',
        nickname: user.nickname || '',
        primaryInstrument: user.primaryInstrument || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        union: user.union || '',
        linkToWork: user.linkToWork || '',
        website: user.website || '',
      });
    }
  }, [user]);

  const handleProfileFill = (values) => {
    const payload = { ...values };
    setAction('talent_update');
    dispatch(updateWizardUserRequest(authUser.id, payload));
  };
  return (
    <PersonalProfileStyleWrapper>
      <h1>{title}</h1>
      <p className='titleDescription'>{titleDescription}</p>
      <div className='white-box'>
        <h2>{subTitle}</h2>
        <Formik
          innerRef={formikRef}
          enableReinitialize
          initialValues={formData}
          onSubmit={handleProfileFill}
          validationSchema={validationSchema}
        >
          {({ values, touched, errors, setFieldValue }) => (
            <Form>
              <Row style={rowStyle} gutter={gutter} justify='start'>
                <Col md={12} sm={12} xs={24}>
                  <label className='fieldLabel'>
                    Stage Name - <i>Optional</i>
                  </label>
                  <Field component={InputField} name='nickname' type='text' />
                </Col>
                <Col md={12} sm={12} xs={24}>
                  <label className='fieldLabel'>Primary Instrument</label>
                  <Field
                    component={InputField}
                    name='primaryInstrument'
                    type='text'
                  />
                </Col>
              </Row>
              {!isBandLeader && (
                <Row style={rowStyle} gutter={gutter} justify='start'>
                  <Col md={24} sm={24} xs={24}>
                    <label className='fieldLabel'>
                      Band Name - <i>Optional</i>
                    </label>
                    <Field component={InputField} name='companyName' type='text' />
                  </Col>
                  {/* <Col md={12} sm={12} xs={24}>
                    <label className='fieldLabel'>Union Number</label>
                    <Field component={InputField} name='union' type='text' />
                  </Col> */}
                </Row>
              )}
              <Row style={rowStyle} gutter={gutter} justify='start'>
                <Col md={12} sm={12} xs={24}>
                  <label className='fieldLabel required'>City</label>
                  <Field name='city'>
                    {() => (
                      <LocationField
                        value={values.city}
                        locations={locations.city}
                        onChange={(city) => setFieldValue('city', city)}
                      />
                    )}
                  </Field>
                  {touched.city && errors.city && (
                    <div className='helper-text lowercase'>{errors.city}</div>
                  )}
                </Col>
                <Col md={6} sm={6} xs={24}>
                  <label className='fieldLabel required'>State</label>
                  <Field>
                    {() => (
                      <LocationField
                        value={values.state}
                        locations={locations.state}
                        onChange={(state) => setFieldValue('state', state)}
                      />
                    )}
                  </Field>
                  {touched.state && errors.state && (
                    <div className='helper-text lowercase'>{errors.state}</div>
                  )}
                </Col>
                <Col md={6} sm={6} xs={24}>
                  <label className='fieldLabel'>Zip</label>
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
                  <label className='fieldLabel'>
                    Links to your work - <i>Optional</i>
                  </label>
                  <Field component={InputField} name='linkToWork' type='text' />
                </Col>
                <Col md={12} sm={12} xs={24}>
                  <label className='fieldLabel'>
                    Website - <i>Optional</i>
                  </label>
                  <Field component={InputField} name='website' type='text' />
                </Col>
              </Row>
              {isBandLeader && (
                <Row style={rowStyle} gutter={gutter} justify='start'>
                  <Col md={12} sm={12} xs={24}>
                    <label className='fieldLabel'>
                      Union Number - <i>Optional</i>
                    </label>
                    <Field component={InputField} name='union' type='text' />
                  </Col>
                </Row>
              )}
              <div className='actionBtnWrapper'>
                {onSkip && (
                  <Button className='wizardBtn' shape='round' onClick={onSkip}>
                    Skip
                  </Button>
                )}

                <Button
                  className='wizardBtn'
                  shape='round'
                  htmlType='submit'
                  type='primary'
                >
                  Next
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </PersonalProfileStyleWrapper>
  );
};
