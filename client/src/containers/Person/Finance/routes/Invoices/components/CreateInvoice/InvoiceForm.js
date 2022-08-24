import React, { useEffect } from 'react';
import { Form, Field } from 'formik';
import { Col } from 'antd';
import Button from '@iso/components/uielements/button';
import InputField from '@iso/components/InputField';
import DatePicker from '@iso/components/uielements/datePicker';
import CalendarIcon from '@iso/components/icons/Calendar';
import NumberFormat from 'react-number-format';
import Input from '@iso/components/uielements/input';
import LocationField from '@iso/components/LocationField';
import { stringToDate, formatDateString } from '@iso/lib/helpers/utility';
import { displayDateFormat } from '@iso/config/datetime.config';
import ZipCode from '@iso/components/shared/ZipCode';
import _ from 'lodash';
import { fetchLocationsRequest } from '@iso/redux/location/actions';
import { useDispatch, useSelector } from 'react-redux';
import { ActionButtons, RowTitle, InvoiceRow } from './CreateInvoice.style';

const InvoiceForm = ({
  values,
  errors,
  touched,
  setFieldValue,
  action,
  onCancel,
}) => {
  const { locations } = useSelector((state) => state.Location);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLocationsRequest());
  }, [dispatch]);
  return (
    <Form>
      <InvoiceRow gutter={30}>
        <RowTitle span={24}>
          <h3>Gig Information</h3>
        </RowTitle>
        <Col md={12} xs={24}>
          <div className='formGroup'>
            <label className='fieldLabel required'>Client</label>
            <Field
              component={InputField}
              name='clientDescription'
              type='text'
            />
          </div>
        </Col>
        <Col md={12} xs={24}>
          <div className='formGroup'>
            <label className='fieldLabel'>
              Agency - <i>Optional</i>
            </label>
            <Field
              name='agencyDescription'
              type='text'
              component={InputField}
            />
          </div>
        </Col>
        <Col md={12} xs={24}>
          <div className='formGroup'>
            <label className='fieldLabel'>Gig Name</label>
            <Field component={InputField} name='jobName' type='text' />
          </div>
        </Col>

        <Col md={6} sm={12} xs={24}>
          <div className='formGroup'>
            <label className='fieldLabel'>Invoice Date</label>
            <Field>
              {() => (
                <DatePicker
                  allowClear={false}
                  name='invoiceDate'
                  style={{ width: '100%' }}
                  value={stringToDate(values.invoiceDate)}
                  onChange={(date) =>
                    setFieldValue('invoiceDate', formatDateString(date))
                  }
                  suffixIcon={
                    <CalendarIcon width={22} height={22} fill='#bcbccb' />
                  }
                  format={displayDateFormat}
                  placeholder=''
                />
              )}
            </Field>
            {touched.invoiceDate && errors.invoiceDate && (
              <div className='helper-text lowercase'>{errors.invoiceDate}</div>
            )}
          </div>
        </Col>

        <Col md={6} sm={12} xs={24}>
          <div className='formGroup'>
            <label className='fieldLabel'>Payment Due</label>
            <Field>
              {() => (
                <DatePicker
                  allowClear={false}
                  style={{ width: '100%' }}
                  name='paymentDue'
                  value={stringToDate(values.paymentDue)}
                  onChange={(date) =>
                    setFieldValue('paymentDue', formatDateString(date))
                  }
                  suffixIcon={
                    <CalendarIcon width={22} height={22} fill='#bcbccb' />
                  }
                  format={displayDateFormat}
                  placeholder=''
                />
              )}
            </Field>
            {touched.paymentDue && errors.paymentDue && (
              <div className='helper-text lowercase'>{errors.paymentDue}</div>
            )}
          </div>
        </Col>

        <Col md={12} xs={24}>
          <div className='formGroup'>
            <label className='fieldLabel'>
              Gig Number - <i>Optional</i>
            </label>
            <Field component={InputField} name='jobNumber' type='text' />
          </div>
        </Col>
        <Col md={12} xs={24}>
          <div className='formGroup'>
            <label className='fieldLabel'>
              Invoice Number - <i>Optional</i>
            </label>
            <Field component={InputField} name='invoiceNumber' type='text' />
          </div>
        </Col>
        <hr />
      </InvoiceRow>

      <InvoiceRow gutter={30}>
        <RowTitle span={24}>
          <h3>Bill From Information</h3>
        </RowTitle>
        <Col md={12} xs={24}>
          <div className='formGroup'>
            <label className='fieldLabel'>Full Name</label>
            <Field name='bill_from.name' component={InputField} />
          </div>
        </Col>
        <Col md={12} xs={24}>
          <div className='formGroup'>
            <label className='fieldLabel'>Email</label>
            <Field name='bill_from.email' component={InputField} />
          </div>
        </Col>

        <Col md={12} xs={24}>
          <div className='formGroup'>
            <label className='fieldLabel'>Address</label>
            <Field name='bill_from.address' component={InputField} />
          </div>
        </Col>
        <Col md={6} sm={12} xs={24}>
          <div className='formGroup'>
            <label className='fieldLabel'>City</label>
            <Field name='bill_from.city'>
              {() => (
                <LocationField
                  value={values.bill_from.city}
                  locations={locations.city}
                  onChange={(city) => setFieldValue('bill_from.city', city)}
                  onSelect={(city) => {
                    setFieldValue('bill_from.city', city);
                  }}
                />
              )}
            </Field>
            {touched.bill_from?.city && errors.bill_from?.city && (
              <div className='helper-text lowercase'>
                {errors.bill_from?.city}
              </div>
            )}
          </div>
        </Col>

        <Col md={2} sm={4} xs={24} className='stateColumn'>
          <div className='formGroup'>
            <label className='fieldLabel'>State</label>
            <Field>
              {() => (
                <LocationField
                  value={values.bill_from.state}
                  locations={locations.state}
                  onChange={(state) => setFieldValue('bill_from.state', state)}
                  onSelect={(state) => {
                    setFieldValue('bill_from.state', state);
                  }}
                />
              )}
            </Field>
            {touched.bill_from?.state && errors.bill_from?.state && (
              <div className='helper-text lowercase'>
                {errors.bill_from?.state}
              </div>
            )}
          </div>
        </Col>
        <Col md={4} sm={8} xs={24}>
          <div className='formGroup'>
            <label className='fieldLabel'>Zip</label>
            <Field name='bill_from.zipCode'>
              {() => (
                <ZipCode
                  value={values.bill_from.zipCode}
                  onChange={(zipCode) =>
                    setFieldValue('bill_from.zipCode', zipCode)
                  }
                />
              )}
            </Field>
            {touched.bill_from?.zipCode && errors.bill_from?.zipCode && (
              <div className='helper-text lowercase'>
                {errors.bill_from?.zipCode}
              </div>
            )}
          </div>
        </Col>
        <Col md={12} xs={24}>
          <div className='formGroup'>
            <label className='fieldLabel'>Phone Number</label>
            <NumberFormat
              format='+1 (###) ###-####'
              mask='_'
              customInput={Input}
              value={values.bill_from.phone}
              onValueChange={(phone) =>
                setFieldValue('bill_from.phone', phone.value)
              }
              name='phone'
            />
            {touched.bill_from?.phone && errors.bill_from?.phone && (
              <div className='helper-text lowercase'>
                {errors.bill_from?.phone}
              </div>
            )}
          </div>
        </Col>
        <hr />
      </InvoiceRow>

      <InvoiceRow gutter={30}>
        <RowTitle span={24}>
          <h3>Bill To Information</h3>
        </RowTitle>
        <Col md={12} xs={24}>
          <div className='formGroup'>
            <label className='fieldLabel'>Bill To Client</label>
            <Field name='bill_to.name' component={InputField} />
          </div>
        </Col>
        <Col md={12} xs={24}>
          <div className='formGroup'>
            <label className='fieldLabel'>Email</label>
            <Field name='bill_to.email' component={InputField} />
          </div>
        </Col>

        <Col md={12} xs={24}>
          <div className='formGroup'>
            <label className='fieldLabel'>Address</label>
            <Field name='bill_to.address' component={InputField} />
          </div>
        </Col>
        <Col md={6} sm={12} xs={24}>
          <div className='formGroup'>
            <label className='fieldLabel'>City</label>
            <Field name='bill_to.city'>
              {() => (
                <LocationField
                  value={values.bill_to.city}
                  locations={locations.city}
                  onChange={(city) => setFieldValue('bill_to.city', city)}
                  onSelect={(city) => {
                    setFieldValue('bill_to.city', city);
                  }}
                />
              )}
            </Field>
            {touched.bill_to?.city && errors.bill_to?.city && (
              <div className='helper-text lowercase'>
                {errors.bill_to?.city}
              </div>
            )}
          </div>
        </Col>
        <Col md={2} sm={4} xs={24} className='stateColumn'>
          <div className='formGroup'>
            <label className='fieldLabel'>State</label>
            <Field>
              {() => (
                <LocationField
                  value={values.bill_to.state}
                  locations={locations.state}
                  onChange={(state) => setFieldValue('bill_to.state', state)}
                  onSelect={(state) => {
                    setFieldValue('bill_to.state', state);
                  }}
                />
              )}
            </Field>
            {touched.bill_to?.state && errors.bill_to?.state && (
              <div className='helper-text lowercase'>
                {errors.bill_to?.state}
              </div>
            )}
          </div>
        </Col>

        <Col md={4} sm={8} xs={24}>
          <div className='formGroup'>
            <label className='fieldLabel'>Zip</label>
            <Field name='bill_to.zipCode'>
              {() => (
                <ZipCode
                  value={values.bill_to.zipCode}
                  onChange={(zipCode) =>
                    setFieldValue('bill_to.zipCode', zipCode)
                  }
                />
              )}
            </Field>
            {touched.bill_to?.zipCode && errors.bill_to?.zipCode && (
              <div className='helper-text lowercase'>
                {errors.bill_to?.zipCode}
              </div>
            )}
          </div>
        </Col>
        <Col md={12} xs={24}>
          <div className='formGroup'>
            <label className='fieldLabel'>Phone Number</label>
            <NumberFormat
              format='+1 (###) ###-####'
              mask='_'
              customInput={Input}
              value={values.bill_to.phone}
              onValueChange={(phone) =>
                setFieldValue('bill_to.phone', phone.value)
              }
              name='bill_to.phone'
            />
            {touched.bill_to?.phone && errors.bill_to?.phone && (
              <div className='helper-text lowercase'>
                {errors.bill_to?.phone}
              </div>
            )}
          </div>
        </Col>
      </InvoiceRow>

      <ActionButtons>
        <Button
          type='default'
          shape='round'
          onClick={onCancel}
          className='cancelBtn'
        >
          Cancel
        </Button>

        <Button
          type='primary'
          htmlType='submit'
          shape='round'
          loading={action === 'invoice_create'}
          className='createBtn'
        >
          Create Invoice
        </Button>
      </ActionButtons>
    </Form>
  );
};

export default InvoiceForm;
