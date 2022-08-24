import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InvoiceFormWrapper from './InvoiceForm.style';
import { Formik, Field, Form, useFormikContext, FieldArray } from 'formik';
import { Col, Row } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import NumberFormat from 'react-number-format';
import BillForm from '../BillForm';
import EditIcon from '@iso/components/icons/Edit';
import Button from '@iso/components/uielements/button';
import Radio, { RadioGroup } from '@iso/components/uielements/radio';
import Input, { InputGroup, Textarea } from '@iso/components/uielements/input';
import Select, { SelectOption } from '@iso/components/uielements/select';
import MemoPriceTypes from '@iso/enums/memo_price_types';
import CalendarIcon from '@iso/components/icons/Calendar';
import DatePicker from '@iso/components/uielements/datePicker';
import PhoneText from '@iso/components/utility/phoneText';
import { displayDateFormat } from '@iso/config/datetime.config';
import { formatDateString, stringToDate } from '@iso/lib/helpers/utility';
import { updateContractorInvoiceRequest } from '@iso/redux/contractorInvoice/actions';
import InputField from '@iso/components/shared/InputField';
import _ from 'lodash';
import {
  hourlyContractorMemoValidationSchema,
  fixedContractorMemoValidationSchema,
} from './schema';
import BillTypes from '@iso/enums/bill_types';

const Option = SelectOption;

const initialMemo = {
  memoStaff: null,
  priceType: MemoPriceTypes.HOURLY,
  dailyHours: 0,
  workingDays: 0,
  workingRate: 0,
  kitFee: 0,
  projectRate: 0,
  rates: [],
};

const DaySelector = ({ value, minDay = 1, maxDay = 60, onSelect, ...rest }) => {
  return (
    <Select value={value} onSelect={onSelect} placeholder='Days' {...rest}>
      {_.range(minDay, maxDay + 1).map((day) => (
        <Option key={day} value={day}>
          {day}
        </Option>
      ))}
    </Select>
  );
};

const InvoiceForm = ({ invoice, onInvoiceDealMemoUpdate }) => {
  const iconColor = '#2f2e50';
  const Edit = () => <EditIcon width={18} height={18} fill={iconColor} />;

  const dispatch = useDispatch();
  const { contractorInvoiceMemoUpdate } = useSelector((state) => state.ContractorInvoice);
  const { user: authUser } = useSelector((state) => state.Auth);
  const { billFrom, billTo, invoiceMemo } = invoice;
  const [billingEdit, setBillingEdit] = useState({
    visible: false,
    billing: null,
  });
  const [requestClarification, setRequestClarification] = useState({
    visible: false,
  });

  const [validationSchema, setValidationSchema] = useState(null);
  const [dealMemoFormValue, setDealMemoFormValue] = useState(initialMemo);
  const [priceType, setPriceType] = useState(null);
  const dealMemoFormikRef = useRef(null);

  const validateFunc = useCallback((value) => {
    // setTotalAmount(getMemoPriceWithAddRateExtraField(value));
  }, []);

  const handleSubmit = (values) => {
    const {
      rates,
      kitFee,
      projectRate,
      priceType,
      dailyHours,
      workingDays,
      workingRate,
      notes
    } = values;

    const params = {
      ...dealMemoFormValue,
      rates,
      priceType: priceType,
      kitFee,
      notes
    };
    if (priceType === MemoPriceTypes.HOURLY) {
      params.dailyHours = dailyHours;
      params.workingDays = workingDays;
      params.workingRate = workingRate;
      params.projectRate = 0;
    } else {
      params.projectRate = projectRate;
      params.dailyHours = 0;
      params.workingRate = 0;
    }
    const payload = _.cloneDeep(params);
    payload.rates.forEach((e) => {
      delete e.isEdit;
      if (e.priceType === MemoPriceTypes.FIXED) {
        delete e.numberOfDays;
        delete e.dayRate;
      } else if (e.priceType === MemoPriceTypes.HOURLY) {
        delete e.projectRate;
      }
    });

    onInvoiceDealMemoUpdate(payload);
  };

  const handleBillingForm = (type, data) => {
    if (type === 'close') {
      setBillingEdit({ visible: false, billing: null, type: '' });
    }
  };

  const onBillingEdit = (billing, type) => {
    setBillingEdit({ visible: true, billing, type });
  };

  const handleInvoiceUpdate = (values) => {
    const payload = { ...values };
    dispatch(updateContractorInvoiceRequest(authUser.id, invoice.id, payload));
  };

  const dayRateHandleChange = (e, setFieldValue) => {
    setFieldValue('priceType', e.target.value);
    setPriceType(e.target.value);
    setFieldValue('projectRate', 0);
  };

  const projectRateHandleChange = (e, setFieldValue) => {
    setFieldValue('priceType', e.target.value);
    setPriceType(e.target.value);
    setFieldValue('workingRate', 0);
    setFieldValue(
      'workingDays',
      dealMemoFormValue.workingDays ||
        (dealMemoFormValue.shootDates && dealMemoFormValue.shootDates.length) ||
        1
    );
    setFieldValue('dailyHours', 0);
  };

  useEffect(() => {
    if (priceType === MemoPriceTypes.HOURLY) {
      setValidationSchema(hourlyContractorMemoValidationSchema);
    } else if (priceType === MemoPriceTypes.FIXED) {
      setValidationSchema(fixedContractorMemoValidationSchema);
    }
  }, [priceType]);

  useEffect(() => {
    setPriceType(invoiceMemo.priceType);
    setDealMemoFormValue(invoiceMemo);
  }, [invoiceMemo]);

  const getInitialRateFields = () => {
    return {
      title: '',
      isEdit: true,
      priceType: MemoPriceTypes.HOURLY,
      dayRate: '',
      projectRate: '',
      numberOfDays:
        (invoiceMemo.shootDates && invoiceMemo.shootDates.length) || 1,
    };
  };

  const handleAddRateBtnClick = (
    touched,
    values,
    errors,
    index,
    validateForm,
    setFieldValue,
    setTouched
  ) => {
    {
      validateForm().then((a) => {
        setTouched({
          ...touched,
          rates: values.rates.map((_, i) => {
            if (i === index) {
              const rateObj = {};
              Object.keys(_).forEach((key) => {
                rateObj[key] = rateObj[key] || i === index;
              });
              return rateObj;
            }
            return touched.rates && touched.rates[i];
          }),
        });
        if (!errors.rates || _.isEmpty(errors.rates[index])) {
          setFieldValue(`rates[${index}].isEdit`, false);
        }
      });
    }
  };

  const formFieldArrayError = (
    touched,
    errors,
    index,
    arrayField,
    objField
  ) => {
    return (
      touched[arrayField] &&
      touched[arrayField][index] &&
      touched[arrayField][index][objField] &&
      errors[arrayField] &&
      errors[arrayField][index] &&
      errors[arrayField][index][objField] && (
        <div className='helper-text lowercase'>
          {errors[arrayField][index][objField]}
        </div>
      )
    );
  };
  return (
    <InvoiceFormWrapper>
      <div className='billingWrapper'>
        <BillForm
          visible={billingEdit.visible}
          billing={billingEdit.billing}
          type={billingEdit.type}
          setModalData={handleBillingForm}
        />

        <div className='leftSideContent'>
          <div className='billFrom'>
            <h3 className='title'>Bill From</h3>
            <p>{billFrom.name}</p>
            <p>
              {billFrom?.address
                ? `${billFrom?.address.trim()}${
                    billFrom?.city.trim() ||
                    billFrom?.state.trim() ||
                    billFrom?.zipCode
                      ? ","
                      : ""
                  }`
                : ""}
              {` `}
              {billFrom?.city
                ? `${billFrom?.city.trim()}${
                    billFrom?.state.trim() || billFrom?.zipCode ? "," : ""
                  }`
                : ""}
              {` `}
              {billFrom?.state
                ? `${billFrom?.state.trim()}${billFrom?.zipCode ? "," : ""}`
                : ""}
              {` `}
              {billFrom?.zipCode ? `${billFrom?.zipCode.trim()}` : ""}
            </p>
            <p>
              <PhoneText value={billFrom.phone} />
              <br />
              {billFrom.email}
            </p>
            <p>
              <Button
                type='link'
                className='btnLink'
                onClick={() => onBillingEdit(billFrom, BillTypes.BILL_FROM)}
              >
                Edit
              </Button>
            </p>
          </div>
          <div className='billTo'>
            <h3 className='title'>Bill To</h3>
            <p>{billTo.name}</p>
            <p>
              {billTo?.address
                ? `${billTo?.address.trim()}${
                    billTo?.city.trim() ||
                    billTo?.state.trim() ||
                    billTo?.zipCode
                      ? ","
                      : ""
                  }`
                : ""}
              {` `}
              {billTo?.city
                ? `${billTo?.city.trim()}${
                    billTo?.state.trim() || billTo?.zipCode ? "," : ""
                  }`
                : ""}
              {` `}
              {billTo?.state
                ? `${billTo?.state.trim()}${billTo?.zipCode ? "," : ""}`
                : ""}
              {` `}
              {billTo?.zipCode ? `${billTo?.zipCode.trim()}` : ""}
            </p>
            <p>
              <PhoneText value={billTo.phone} />
              <br />
              {billTo.email}
            </p>
            <p>
              <Button
                type='link'
                className='btnLink'
                onClick={() => onBillingEdit(billTo, BillTypes.BILL_TO)}
              >
                Edit
              </Button>
            </p>
          </div>
        </div>
        <div className='rightSideContent'>
          <div className='formGroup'>
            <label>Invoice Date</label>
            <DatePicker
              style={{ width: '100%' }}
              format={displayDateFormat}
              value={stringToDate(invoice.invoiceDate)}
              suffixIcon={
                <CalendarIcon width={20} height={18} fill='#bcbccb' />
              }
              onChange={(date) => {
                const invoiceDate = formatDateString(date);
                handleInvoiceUpdate({ invoiceDate });
              }}
            />
          </div>
          <div className='formGroup'>
            <label>Payment Due</label>
            <DatePicker
              style={{ width: '100%' }}
              format={displayDateFormat}
              value={stringToDate(invoice.paymentDue)}
              suffixIcon={
                <CalendarIcon width={20} height={18} fill='#bcbccb' />
              }
              onChange={(date) => {
                const paymentDue = formatDateString(date);
                handleInvoiceUpdate({ paymentDue });
              }}
            />
          </div>
        </div>
      </div>
      <div className='memoWrapper'>
        <h3 className='title'>Edit Booking Memo</h3>
        <Formik
          enableReinitialize
          innerRef={dealMemoFormikRef}
          initialValues={dealMemoFormValue}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validate={validateFunc}
        >
          {({
            values,
            touched,
            errors,
            setFieldValue,
            validateForm,
            setTouched,
          }) => (
            <Form className='MemoForm'>
              <div className='invoiceMemoInfo'>
                <Row style={{ flexWrap: 'nowrap' }} align='start'>
                  <Col className='dealMemoColumn'>
                    <Row gutter={20} style={{ flexWrap: 'wrap' }}>
                      <Col span={5} className='date-rate'>
                        <RadioGroup
                          className='priceTypeOption'
                          name='priceType'
                          value={values.priceType}
                          onChange={(e) => {
                            dayRateHandleChange(e, setFieldValue);
                          }}
                        >
                          <Radio value={MemoPriceTypes.HOURLY}>
                            <span className='radioLabel'>Day Rate</span>
                          </Radio>
                        </RadioGroup>
                        <InputGroup compact>
                          <DaySelector
                            style={{ width: '40%' }}
                            disabled={values.priceType === MemoPriceTypes.FIXED}
                            value={values.workingDays || null}
                            onSelect={(value) =>
                              setFieldValue('workingDays', value)
                            }
                          />
                          <NumberFormat
                            style={{ width: '60%' }}
                            disabled={values.priceType === MemoPriceTypes.FIXED}
                            value={values.workingRate || ''}
                            allowEmptyFormatting={true}
                            thousandSeparator={true}
                            prefix='$'
                            customInput={Input}
                            onValueChange={(price) => {
                              setFieldValue(
                                'workingRate',
                                price.floatValue || 0
                              );
                            }}
                          />
                        </InputGroup>
                        {values.priceType === MemoPriceTypes.HOURLY &&
                          touched.workingDays &&
                          errors.workingDays && (
                            <div className='helper-text lowercase'>
                              {errors.workingDays}
                            </div>
                          )}
                        {values.priceType === MemoPriceTypes.HOURLY &&
                          touched.workingRate &&
                          errors.workingRate && (
                            <div className='helper-text lowercase'>
                              {errors.workingRate}
                            </div>
                          )}
                      </Col>
                      <Col span={3} className='hour-per-day'>
                        <div className='formGroup'>
                          <label className='fieldLabel'>Set Length</label>
                          <Field name='dailyHours'>
                            {() => (
                              <NumberFormat
                                value={values.dailyHours || ''}
                                onChange={(e) =>
                                  setFieldValue('dailyHours', e.target.value)
                                }
                                disabled={
                                  values.priceType === MemoPriceTypes.FIXED
                                }
                                format='##'
                                customInput={Input}
                              />
                            )}
                          </Field>
                          {values.priceType === MemoPriceTypes.HOURLY &&
                            touched.dailyHours &&
                            errors.dailyHours && (
                              <div className='helper-text lowercase'>
                                {errors.dailyHours}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col span={3} className='project-rate'>
                        <RadioGroup
                          className='priceTypeOption'
                          name='priceType'
                          value={values.priceType}
                          onChange={(e) => {
                            projectRateHandleChange(e, setFieldValue);
                          }}
                        >
                          <Radio value={MemoPriceTypes.FIXED}>
                            <span className='radioLabel'>Project Rate</span>
                          </Radio>
                        </RadioGroup>
                        <NumberFormat
                          disabled={values.priceType === MemoPriceTypes.HOURLY}
                          value={values.projectRate || ''}
                          thousandSeparator={true}
                          allowEmptyFormatting={true}
                          prefix='$'
                          customInput={Input}
                          onValueChange={(price) => {
                            setFieldValue('projectRate', price.floatValue || 0);
                          }}
                        />
                        {values.priceType === MemoPriceTypes.FIXED &&
                          touched.projectRate &&
                          errors.projectRate && (
                            <div className='helper-text lowercase'>
                              {errors.projectRate}
                            </div>
                          )}
                      </Col>
                      <Col span={3} className='kit-fee'>
                        <label className='fieldLabel'>
                          Kit Fee - <i>Optional</i>
                        </label>
                        <NumberFormat
                          value={values.kitFee || ''}
                          thousandSeparator={true}
                          allowEmptyFormatting={true}
                          prefix='$'
                          customInput={Input}
                          onValueChange={(price) => {
                            setFieldValue('kitFee', price.floatValue || 0);
                          }}
                        />
                      </Col>
                      <Col span={10} className='notes'>
                        <label className='fieldLabel'>Notes</label>
                        <Input
                          name='notes'
                          value={values.notes}
                          onChange={(e) => {
                            setFieldValue('notes', e.target.value);
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div className='rateFields'>
                <FieldArray name='rates'>
                  {(arrayHelpers) => (
                    <>
                      {values.rates && values.rates.length > -1 && (
                        <div className='rateList'>
                          {values.rates.findIndex((e) => !e.isEdit) > -1 && (
                            <div className='viewRate'>
                              {values.rates.map(
                                (rate, index) =>
                                  !rate.isEdit &&
                                  (rate.priceType === MemoPriceTypes.HOURLY ? (
                                    <div className='viewRateCol' key={index}>
                                      <label className='fieldLabel'>
                                        {rate.title}
                                      </label>
                                      <InputGroup
                                        compact
                                        className='hourlyRate'
                                      >
                                        <DaySelector
                                          style={{ width: '30%' }}
                                          disabled
                                          value={rate.numberOfDays}
                                        />
                                        <Field
                                          name={`rates[${index}].dayRate`}
                                          component={(inputProps) => {
                                            return (
                                              <div className='dayRate rateUpdate'>
                                                <NumberFormat
                                                  {...inputProps}
                                                  allowEmptyFormatting={true}
                                                  thousandSeparator={true}
                                                  prefix='$'
                                                  value={rate.dayRate}
                                                  disabled
                                                  customInput={InputField}
                                                />
                                                <Button
                                                  type='link'
                                                  onClick={() => {
                                                    setFieldValue(
                                                      `rates[${index}].isEdit`,
                                                      true
                                                    );
                                                  }}
                                                >
                                                  <Edit />
                                                </Button>
                                              </div>
                                            );
                                          }}
                                        />
                                      </InputGroup>
                                    </div>
                                  ) : (
                                    rate.priceType === MemoPriceTypes.FIXED && (
                                      <div className='viewRateCol' key={index}>
                                        <label className='fieldLabel'>
                                          {rate.title}
                                        </label>

                                        <Field
                                          name={`rates[${index}].dayRate`}
                                          component={(inputProps) => {
                                            return (
                                              <div className='rateUpdate'>
                                                <NumberFormat
                                                  {...inputProps}
                                                  thousandSeparator={true}
                                                  allowEmptyFormatting={true}
                                                  prefix='$'
                                                  customInput={InputField}
                                                  disabled
                                                  value={rate.projectRate}
                                                />
                                                <Button
                                                  type='link'
                                                  onClick={() => {
                                                    setFieldValue(
                                                      `rates[${index}].isEdit`,
                                                      true
                                                    );
                                                  }}
                                                >
                                                  <Edit />
                                                </Button>
                                              </div>
                                            );
                                          }}
                                        />
                                      </div>
                                    )
                                  ))
                              )}
                            </div>
                          )}
                          {values.rates.findIndex((e) => e.isEdit) > -1 && (
                            <div className='editRate'>
                              {values.rates.map(
                                (rate, index) =>
                                  rate.isEdit && (
                                    <Row
                                      className='rateFieldRow'
                                      gutter={20}
                                      key={index}
                                    >
                                      <Col flex='400px'>
                                        <label className='fieldLabel'>
                                          Rate Field Title
                                        </label>

                                        <Field name={`rates[${index}].title`}>
                                          {() => (
                                            <Input
                                              value={rate.title}
                                              onChange={(event) => {
                                                setFieldValue(
                                                  `rates[${index}].title`,
                                                  event.target.value
                                                );
                                              }}
                                            />
                                          )}
                                        </Field>

                                        {formFieldArrayError(
                                          touched,
                                          errors,
                                          index,
                                          'rates',
                                          'title'
                                        )}
                                      </Col>
                                      <Col flex='210px'>
                                        <RadioGroup
                                          className='rateTypeOption'
                                          value={rate.priceType}
                                          onChange={(event) => {
                                            setFieldValue(
                                              `rates[${index}].priceType`,
                                              event.target.value
                                            );
                                          }}
                                        >
                                          <Radio
                                            value={MemoPriceTypes.HOURLY}
                                          />
                                        </RadioGroup>
                                        <InputGroup compact>
                                          <DaySelector
                                            style={{ width: '32%' }}
                                            name={`rates[${index}].numberOfDays`}
                                            value={rate.numberOfDays}
                                            onSelect={(value) => {
                                              setFieldValue(
                                                `rates[${index}].numberOfDays`,
                                                value
                                              );
                                            }}
                                            disabled={
                                              rate.priceType ===
                                              MemoPriceTypes.FIXED
                                            }
                                          />
                                          <NumberFormat
                                            style={{ width: '68%' }}
                                            allowEmptyFormatting={true}
                                            thousandSeparator={true}
                                            prefix='$'
                                            customInput={Input}
                                            name={`rates[${index}].dayRate`}
                                            disabled={
                                              rate.priceType ===
                                              MemoPriceTypes.FIXED
                                            }
                                            value={rate.dayRate}
                                            onValueChange={(value) => {
                                              setFieldValue(
                                                `rates[${index}].dayRate`,
                                                value.floatValue
                                              );
                                            }}
                                          />
                                        </InputGroup>
                                        {rate.priceType ===
                                          MemoPriceTypes.HOURLY &&
                                          formFieldArrayError(
                                            touched,
                                            errors,
                                            index,
                                            'rates',
                                            'numberOfDays'
                                          )}
                                        {rate.priceType ===
                                          MemoPriceTypes.HOURLY &&
                                          formFieldArrayError(
                                            touched,
                                            errors,
                                            index,
                                            'rates',
                                            'dayRate'
                                          )}
                                      </Col>
                                      <Col flex='160px'>
                                        <RadioGroup
                                          className='rateTypeOption'
                                          value={rate.priceType}
                                          onChange={(event) => {
                                            setFieldValue(
                                              `rates[${index}].priceType`,
                                              event.target.value
                                            );
                                          }}
                                        >
                                          <Radio value={MemoPriceTypes.FIXED} />
                                        </RadioGroup>
                                        <NumberFormat
                                          name={`rates[${index}].projectRate`}
                                          thousandSeparator={true}
                                          allowEmptyFormatting={true}
                                          prefix='$'
                                          value={rate.projectRate}
                                          customInput={Input}
                                          disabled={
                                            rate.priceType ===
                                            MemoPriceTypes.HOURLY
                                          }
                                          onValueChange={(value) => {
                                            setFieldValue(
                                              `rates[${index}].projectRate`,
                                              value.floatValue
                                            );
                                          }}
                                        />
                                        {rate.priceType ===
                                          MemoPriceTypes.FIXED &&
                                          formFieldArrayError(
                                            touched,
                                            errors,
                                            index,
                                            'rates',
                                            'projectRate'
                                          )}
                                      </Col>
                                      <Col>
                                        <Button
                                          type='primary'
                                          className='editBtn'
                                          shape='round'
                                          onClick={() =>
                                            handleAddRateBtnClick(
                                              touched,
                                              values,
                                              errors,
                                              index,
                                              validateForm,
                                              setFieldValue,
                                              setTouched
                                            )
                                          }
                                        >
                                          Add
                                        </Button>
                                        <Button
                                          type='danger'
                                          shape='round'
                                          onClick={() =>
                                            arrayHelpers.remove(index)
                                          }
                                        >
                                          Remove
                                        </Button>
                                      </Col>
                                    </Row>
                                  )
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      <Button
                        type='link'
                        className='btnLink'
                        onClick={() =>
                          arrayHelpers.push(getInitialRateFields())
                        }
                      >
                        <PlusCircleOutlined /> Add Rate Field
                      </Button>
                    </>
                  )}
                </FieldArray>
              </div>

              <div className='actions'>
                <Button
                  htmlType='submit'
                  className='saveBtn'
                  shape='round'
                  loading={contractorInvoiceMemoUpdate.loading}
                >
                  Save
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </InvoiceFormWrapper>
  );
};

export default InvoiceForm;
