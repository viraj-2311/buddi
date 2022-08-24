import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'antd';
import NumberFormat from 'react-number-format';
import Select, { SelectOption } from '@iso/components/uielements/select';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Button from '@iso/components/uielements/button';
import Input from '@iso/components/uielements/input';
import LocationField from '@iso/components/LocationField';
import { InputField } from '@iso/components';
import BandProfileStyleWrapper from './BandProfile.styles';
import ZipCode from '@iso/components/shared/ZipCode';
import { fetchLocationsRequest } from '@iso/redux/location/actions';
import {
  createWizardCompanyRequest,
  updateWizardCompanyRequest,
} from '@iso/redux/accountWizard/actions';
import basicStyle from '@iso/assets/styles/constants';
import notify from '@iso/lib/helpers/notify';
import { showServerError } from '@iso/lib/helpers/utility';
import validationSchema from './schema';

const { rowStyle, gutter } = basicStyle;

export default ({ title, subTitle, onSuccess }) => {
  const dispatch = useDispatch();
  const { locations } = useSelector((state) => state.Location);
  const { company, wizard } = useSelector((state) => state.AccountWizard);
  const { user: authUser } = useSelector((state) => state.Auth);
  const [formData, setFormData] = useState({
    type: '',
    // bandName: '',
    title: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    ein: '',
  });
  const [action, setAction] = useState('');
  const formikRef = useRef();

  useEffect(() => {
    dispatch(fetchLocationsRequest());
  }, [dispatch]);

  useEffect(() => {
    if (company && company.id) {
      setFormData({
        ...formData,
        id: company.id || '',
        type: company.type || '',
        // bandName: company.title || '',
        title: company.title || '',
        address: company.address || '',
        city: company.city || '',
        state: company.state || '',
        zipCode: company.zipCode || '',
        phone: company.phone || '',
        ein: company.ein || '',
      });
    }
  }, [company]);

  useEffect(() => {
    if (!wizard.loading && !wizard.error && action === 'save') {
      onSuccess();
    }

    if (wizard.error && action === 'save') {
      notify('error', showServerError(wizard.error));
    }

    if (!wizard.loading && action === 'save') {
      setAction('');
    }
  }, [wizard]);

  const handleCompanyFill = (values) => {
    const payload = { ...values, creatorEmail: authUser.email, is_owner: true, type:"Musical Groups and Artists" };
    
    setAction('save');
    if (payload.id) {
      dispatch(updateWizardCompanyRequest(payload.id, payload));
    } else {
      dispatch(createWizardCompanyRequest(payload));
    }
    // TO DO: remove that onSuccess() call when actual api implementation
    // onSuccess();
  };

  return (
    <BandProfileStyleWrapper>
      <h1>{title}</h1>
      <div className='white-box'>
        <h2>{subTitle}</h2>
        <Formik
          innerRef={formikRef}
          enableReinitialize
          initialValues={formData}
          onSubmit={handleCompanyFill}
          validationSchema={validationSchema}
        >
          {({ values, touched, errors, setFieldValue }) => (
            <Form>
              <Row style={rowStyle} gutter={[30, 30]} justify='start'>
                <Col md={12} sm={12} xs={24}>
                  <label className='fieldLabel'>Band Name</label>
                  <Field component={InputField} name='title' type='text' />
                </Col>
                <Col md={12} sm={12} xs={24}>
                  <label className='fieldLabel'>
                    Phone - <i>Optional</i>
                  </label>
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
                    <div className='helper-text lowercase'>{errors.phone}</div>
                  )}
                </Col>

                <Col md={24} sm={24} xs={24}>
                  <label className='fieldLabel'>Address</label>
                  <Field component={InputField} name='address' type='text' />
                </Col>

                <Col md={12} sm={12} xs={24}>
                  <label className='fieldLabel'>City</label>
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
                  <label className='fieldLabel'>State</label>
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

              <div className='actionBtnWrapper'>
                <Button
                  htmlType='submit'
                  type='primary'
                  shape='round'
                  className='wizardBtn'
                  loading={action === 'save'}
                >
                  Next
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </BandProfileStyleWrapper>
  );
};
