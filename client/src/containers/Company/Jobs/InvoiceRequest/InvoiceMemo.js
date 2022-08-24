import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InvoiceMemoWrapper, {
  InvoiceMemoSectionTitle,
  TotalAmountContainer,
} from './InvoiceMemo.style';
import EditIcon from '@iso/components/icons/Edit';
import MemoPreview from '../routes/JobDetails/MemoForm/MemoPreview';
import MemoAttachments from './MemoAttachments';
import Modal from '@iso/components/Modal';
import { Formik, Field, Form, FieldArray } from 'formik';
import InputField from '@iso/components/shared/InputField';
import { getMemoPriceWithAddRateExtraField, stringToTime, formatTimeString } from '@iso/lib/helpers/utility';
import { Collapse, Col, Row } from 'antd';
import Input, { InputGroup, Textarea } from '@iso/components/uielements/input';
import Select, { SelectOption } from '@iso/components/uielements/select';
import Button from '@iso/components/uielements/button';
import NumberFormat from 'react-number-format';
import Radio, { RadioGroup } from '@iso/components/uielements/radio';
import Timepicker from '@iso/components/uielements/timePicker';
// import LocationField from '@iso/components/LocationField';
import { PlusCircleOutlined, PaperClipOutlined } from '@ant-design/icons';
import MemoPriceTypes from '@iso/enums/memo_price_types';
import MemoCrewTypes from '@iso/enums/memo_crew_types';
import {
  hourlyMemoValidationSchema,
  fixedMemoValidationSchema,
} from './schema';
import { updateInvoiceMemoRequest } from '@iso/redux/jobInvoice/actions';
import { fetchLocationsRequest } from '@iso/redux/location/actions';
import { uploadFile } from '@iso/lib/helpers/s3';
import notify from '@iso/lib/helpers/notify';
import _ from 'lodash';
import CurrencyText from '@iso/components/utility/currencyText';

const { Panel } = Collapse;
const Option = SelectOption;

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

const InvoiceMemo = ({ job, memo, setModalData }) => {
  const dispatch = useDispatch();
  const { locations } = useSelector((state) => state.Location);
  const { updateInvoiceMemo } = useSelector((state) => state.JobInvoice);
  const [formData, setFormData] = useState({
    city: '',
    state: '',
    priceType: MemoPriceTypes.HOURLY,
    dailyHours: 0,
    workingDays: 0,
    workingRate: 0,
    travelDays: 0,
    travelRate: 0,
    kitFee: 0,
    projectRate: 0,
    rates: [],
    notes: '',
  });
  const [crewType, setCrewType] = useState(null);
  const [validationSchema, setValidationSchema] = useState(null);
  const [priceType, setPriceType] = useState('');
  const [headline, setHeadline] = useState('');
  const [action, setAction] = useState('');
  const [memoOriginalAmount, setMemoOriginalAmount] = useState(0);
  const [newTotalAmount, setNewTotalAmount] = useState(0);
  const { invoiceMemo } = memo;

  const [memoPreview, setMemoPreview] = useState({
    visible: false,
    memo: null,
  });
  const [innerAttachments, setInnerAttachments] = useState([]);
  const iconColor = '#2f2e50';
  const Edit = () => <EditIcon width={18} height={18} fill={iconColor} />;

  const filePicker = useRef(null);
  const formikRef = useRef(null);

  useEffect(() => {
    dispatch(fetchLocationsRequest());
  }, [dispatch]);

  useEffect(() => {
    if (memo) {
      setMemoOriginalAmount(memo.invoiceMemo.totalPrice);
    }
    if (memo.invoiceMemo) {
      setFormData(memo.invoiceMemo);
      setPriceType(memo.invoiceMemo.priceType);
      setInnerAttachments(memo.attachments);
      setHeadline(memo.headline);
      setCrewType(memo.memoStaff);
    }
  }, [memo]);

  useEffect(() => {
    if (
      !updateInvoiceMemo.loading &&
      !updateInvoiceMemo.error &&
      action === 'update_invoice_memo'
    ) {
      notify('success', 'Memo updated successfully');
      setModalData('close');
    }

    if (!updateInvoiceMemo.loading && action === 'update_invoice_memo') {
      setAction('');
    }
  }, [updateInvoiceMemo]);

  useEffect(() => {
    if (priceType === MemoPriceTypes.HOURLY) {
      setValidationSchema(hourlyMemoValidationSchema);
    } else {
      setValidationSchema(fixedMemoValidationSchema);
    }
  }, [priceType]);

  const openFilePicker = () => {
    filePicker.current.click();
  };
  const isEmployeeMemo = (crewType) => {
    return crewType === MemoCrewTypes.EMPLOYEE;
  };
  const onAttachmentLoad = (attachments) => {
    setInnerAttachments([...innerAttachments, ...Array.from(attachments)]);
  };

  const onAttachmentDelete = (index) => {
    const cloned = [...innerAttachments];
    cloned.splice(index, 1);
    setInnerAttachments(cloned);
  };

  const onMemoPreviewClick = () => {
    memo = { ...memo, client: job?.client,setTime: job?.setTime,soundCheckTime:job?.soundCheckTime };
    setMemoPreview({
      visible: true,
      memo: {
        ...memo,
        ...formikRef.current.values,
        headline: headline,
      },
    });
  };

  const handleMemoPreview = (type, data) => {
    if (type === 'close') {
      setMemoPreview({ visible: false, memo: null });
    }

    if (type === 'update') {
      setHeadline(data);
      setMemoPreview({ visible: false, memo: null });
    }

    if (type === 'send') {
      setHeadline(data);
      setMemoPreview({ visible: false, memo: null });
      formikRef.current.handleSubmit();
    }
  };

  const handleCancel = () => {
    setModalData('close');
  };

  const handleSubmit = async (values) => {
    setAction('update_invoice_memo');
    const attachments = [...innerAttachments];
    if (attachments && attachments.length > 0) {
      const queue = [];
      attachments.map((attachment, index) => {
        if (attachment instanceof File) {
          const memoAttachmentDirName =
            process.env.REACT_APP_S3_BUCKET_MEMO_ATTACHMENT_DIRNAME;
          queue.push(
            uploadFile(attachment, memoAttachmentDirName).then((document) => {
              if (document.location) {
                attachments[index] = {
                  name: attachment.name,
                  size: attachment.size,
                  type: attachment.type,
                  path: document.location,
                };
              }
            })
          );
        }
      });

      await Promise.all(queue)
        .then(() => console.log('upload success'))
        .catch((err) => notify('error', err.message));
    }
    const payload = _.cloneDeep({
      ...values,
      attachments: attachments,
      headline: headline,
    });
    payload.rates.forEach((e) => {
      delete e.isEdit;
      if (e.priceType === MemoPriceTypes.FIXED) {
        delete e.numberOfDays;
        delete e.dayRate;
      } else if (e.priceType === MemoPriceTypes.HOURLY) {
        delete e.projectRate;
      }
    });
    dispatch(updateInvoiceMemoRequest(values.id, payload));
  };

  const validateFunc = useCallback((value) => {
    setNewTotalAmount(getMemoPriceWithAddRateExtraField(value));
  }, []);

  useEffect(() => {
    if (formikRef.current && formikRef.current.values) {
      setNewTotalAmount(
        getMemoPriceWithAddRateExtraField(formikRef.current.values)
      );
    }
  }, [formikRef.current]);

  const getInitialRateFields = () => {
    return {
      title: '',
      isEdit: true,
      priceType: MemoPriceTypes.HOURLY,
      dayRate: '',
      projectRate: '',
      numberOfDays: (memo.shootDates && memo.shootDates.length) || 1,
    };
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
      memo.workingDays || (memo.shootDates && memo.shootDates.length) || 1
    );
    setFieldValue('dailyHours', 0);
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
    <Modal
      visible={true}
      width={950}
      title='Booking Memo'
      bodyStyle={{ padding: 0 }}
      footer={null}
      onCancel={handleCancel}
    >
      <InvoiceMemoWrapper>
        <div className='jobMemoWrapper'>
          <Collapse
            ghost
            defaultActiveKey={['job-memo']}
            expandIconPosition='right'
            className='jobMemoCollapse'
          >
            <Panel
              header={
                <InvoiceMemoSectionTitle>Booking Memo</InvoiceMemoSectionTitle>
              }
              key='job-memo'
            >
              <div className='topField'>
                <div className='formGroup'>
                  <RadioGroup disabled value={memo.memoStaff}>
                    {/* <Radio value={MemoCrewTypes.CONTRACTOR_W2}>
                      Contractor W2
                    </Radio> */}
                    <Radio value={MemoCrewTypes.CONTRACTOR_W9}>
                      Freelance Talent
                    </Radio>
                    <Radio value={MemoCrewTypes.EMPLOYEE}>Band Staff</Radio>
                    <Radio value={MemoCrewTypes.AGENCY}>Talent Agent</Radio>
                  </RadioGroup>
                </div>
                <Row gutter={[20, 20]}>
                  <Col span={12}>
                    <label className='fieldLabel'>Full Name</label>
                    <Input value={invoiceMemo?.fullName} disabled={true} />
                  </Col>
                  <Col span={12}>
                    <label className='fieldLabel'>Email</label>
                    <Input value={invoiceMemo?.email} disabled={true} />
                  </Col>
                  <Col span={12}>
                    <label className='fieldLabel'>Position</label>
                    <Input value={invoiceMemo?.position} disabled={true} />
                  </Col>
                  <Col span={12}>
                    <label className='fieldLabel'>Dates</label>
                    <Input
                      value={`${invoiceMemo?.shootDates.length} days | ${invoiceMemo?.dates}`}
                      disabled={true}
                    />
                  </Col>
                  <Col span={12}>
                    <label className='fieldLabel'>Show Location - City</label>
                    <Input value={invoiceMemo?.city} disabled={true} />
                  </Col>
                  <Col span={6}>
                    <label className='fieldLabel'>State</label>
                    <Input value={invoiceMemo?.state} disabled={true} />
                  </Col>
                  <Col span={6}>
                    <label className='fieldLabel'>Pay Terms</label>

                    <div className='payTermsField'>
                      <span className='disable'>NET</span>
                      <NumberFormat
                        disabled
                        allowNegative={false}
                        style={{ width: '70%' }}
                        thousandSeparator={true}
                        allowEmptyFormatting={true}
                        customInput={Input}
                        format='###'
                        defaultValue={invoiceMemo?.payTerms || ''}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
              <div className='divider' />
              <div className='rateSection'>
                <Row gutter={[20, 20]}>
                  <Col span={6}>
                    <RadioGroup
                      className='priceTypeOption'
                      value={invoiceMemo?.priceType}
                      disabled={true}
                    >
                      <Radio value={MemoPriceTypes.HOURLY} disabled={true}>
                        <span className='radioLabel'>Day Rate</span>
                      </Radio>
                    </RadioGroup>
                    <InputGroup compact>
                      <DaySelector
                        style={{ width: '40%' }}
                        disabled={true}
                        value={invoiceMemo?.workingDays || null}
                      />
                      <NumberFormat
                        style={{ width: '60%' }}
                        disabled={true}
                        value={invoiceMemo?.workingRate || ''}
                        thousandSeparator={true}
                        prefix='$'
                        customInput={Input}
                      />
                    </InputGroup>
                  </Col>
                  <Col span={6}>
                    <label className='fieldLabel'>Set Length</label>
                    <Input
                      value={invoiceMemo?.dailyHours || ''}
                      disabled={true}
                    />
                  </Col>
                  <Col span={6}>
                    <label className='fieldLabel'>Kit Fee</label>
                    <NumberFormat
                      disabled={true}
                      value={invoiceMemo?.kitFee || ''}
                      thousandSeparator={true}
                      prefix='$'
                      customInput={Input}
                    />
                  </Col>
                  <Col span={6}>
                    <RadioGroup
                      className='priceTypeOption'
                      name='priceType'
                      value={invoiceMemo?.priceType}
                    >
                      <Radio value={MemoPriceTypes.FIXED} disabled={true}>
                        <span className='radioLabel'>Project Rate</span>
                      </Radio>
                    </RadioGroup>
                    <NumberFormat
                      disabled={true}
                      value={invoiceMemo?.projectRate || ''}
                      thousandSeparator={true}
                      prefix='$'
                      customInput={Input}
                    />
                  </Col>
                </Row>
              </div>

              {/* <div className="dealRateList"> */}
              <Row gutter={[20, 20]} className='dealViewRate'>
                {invoiceMemo?.rates.map(
                  (rate, index) =>
                    !rate.isEdit &&
                    (rate.priceType === MemoPriceTypes.HOURLY ? (
                      <Col span={6} key={index}>
                        <label className='fieldLabel'>{rate.title}</label>
                        <InputGroup compact className='hourlyRate'>
                          <DaySelector
                            style={{ width: '40%' }}
                            disabled
                            value={rate.numberOfDays}
                          />
                          <div className='dayRate rateUpdate'>
                            <NumberFormat
                              // style={{ width: '60%' }}
                              name={`rates[${index}].dayRate`}
                              allowEmptyFormatting={true}
                              thousandSeparator={true}
                              prefix='$'
                              value={rate.dayRate}
                              disabled
                              customInput={Input}
                            />
                          </div>
                        </InputGroup>
                      </Col>
                    ) : (
                      rate.priceType === MemoPriceTypes.FIXED && (
                        <Col span={6} key={index}>
                          <label className='fieldLabel'>{rate.title}</label>

                          <div className='rateUpdate'>
                            <NumberFormat
                              name={`rates[${index}].projectRate`}
                              thousandSeparator={true}
                              allowEmptyFormatting={true}
                              prefix='$'
                              customInput={Input}
                              disabled
                              value={rate.projectRate}
                            />
                          </div>
                        </Col>
                      )
                    ))
                )}
              </Row>
              {/* </div> */}
              {
                <TotalAmountContainer>
                  <div>Total:&nbsp;</div>
                  <div>
                    <CurrencyText value={memoOriginalAmount} />
                  </div>
                </TotalAmountContainer>
              }
            </Panel>
          </Collapse>
        </div>

        <div className='invoiceMemoWrapper'>
          <InvoiceMemoSectionTitle className='title'>
            Edit Booking Memo
          </InvoiceMemoSectionTitle>
          <Formik
            enableReinitialize
            innerRef={formikRef}
            initialValues={formData}
            onSubmit={handleSubmit}
            validate={validateFunc}
            validationSchema={validationSchema}
          >
            {({
              values,
              setFieldValue,
              touched,
              validateForm,
              errors,
              setTouched,
            }) => (
              <Form>
                <div>
                  <Row gutter={[20, 20]}>
                    <Col span={12} className='hourlyFieldWrapper'>
                      <Row gutter={30}>
                        <Col span={14}>
                          <RadioGroup
                            className='priceTypeOption'
                            name='priceType'
                            value={values.priceType}
                            onChange={(e) => {
                              dayRateHandleChange(e, setFieldValue);
                            }}
                          >
                            <Radio
                              value={MemoPriceTypes.HOURLY}
                              disabled={isEmployeeMemo(crewType)}
                            >
                              <span className='radioLabel'>Day Rate</span>
                            </Radio>
                          </RadioGroup>
                          <InputGroup compact>
                            <DaySelector
                              style={{ width: '30%' }}
                              disabled={
                                values.priceType === MemoPriceTypes.FIXED ||
                                isEmployeeMemo(crewType)
                              }
                              value={values.workingDays || null}
                              onSelect={(value) =>
                                setFieldValue('workingDays', value)
                              }
                            />
                            <NumberFormat
                              style={{ width: '70%' }}
                              disabled={
                                values.priceType === MemoPriceTypes.FIXED ||
                                isEmployeeMemo(crewType)
                              }
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

                        <Col span={10}>
                          <label className='fieldLabel'>Set Length</label>
                          <Field name='dailyHours'>
                            {() => (
                              <Timepicker
                                format="HH:mm"
                                className="w-100 memo-time-picker"
                                name="dailyHours"
                                Timepicker='fieldControl w-180'
                                allowClear={false}
                                value={stringToTime(values.dailyHours, 'HH:mm')}
                                style={{ width: '100%' }}
                                onChange={(time) =>
                                  setFieldValue('dailyHours', formatTimeString(time, 'HH:mm'))
                                }
                                disabled={
                                  values.priceType === MemoPriceTypes.FIXED ||
                                  isEmployeeMemo(crewType)
                                }
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
                        </Col>
                      </Row>
                    </Col>
                    <Col span={6} className='fixedFieldWrapper'>
                      <RadioGroup
                        className='priceTypeOption'
                        name='priceType'
                        value={values.priceType}
                        onChange={(e) => {
                          projectRateHandleChange(e, setFieldValue);
                        }}
                      >
                        <Radio
                          value={MemoPriceTypes.FIXED}
                          disabled={isEmployeeMemo(crewType)}
                        >
                          <span className='radioLabel'>Project Rate</span>
                        </Radio>
                      </RadioGroup>
                      <NumberFormat
                        disabled={
                          values.priceType === MemoPriceTypes.HOURLY ||
                          isEmployeeMemo(crewType)
                        }
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
                    <Col span={6}>
                      <label className='fieldLabel'>
                        Kit Fee - <i>Optional</i>
                      </label>
                      <NumberFormat
                        disabled={isEmployeeMemo(crewType)}
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
                  </Row>
                </div>
                <div className='rateFields'>
                  <FieldArray name='rates'>
                    {(arrayHelpers) => (
                      <>
                        {values.rates && values.rates.length > -1 && (
                          <div className='rateList'>
                            {values.rates.findIndex((e) => !e.isEdit) > -1 && (
                              <Row gutter={[20, 20]} className='viewRate'>
                                {values.rates.map(
                                  (rate, index) =>
                                    !rate.isEdit &&
                                    (rate.priceType ===
                                    MemoPriceTypes.HOURLY ? (
                                      <Col span={6} key={index}>
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
                                      </Col>
                                    ) : (
                                      rate.priceType ===
                                        MemoPriceTypes.FIXED && (
                                        <Col span={6} key={index}>
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
                                        </Col>
                                      )
                                    ))
                                )}
                              </Row>
                            )}
                            {values.rates.findIndex((e) => e.isEdit) > -1 && (
                              <div className='editRate'>
                                {values.rates.map(
                                  (rate, index) =>
                                    rate.isEdit && (
                                      <Row gutter={30} key={index}>
                                        <Col flex='auto'>
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
                                            <Radio
                                              value={MemoPriceTypes.FIXED}
                                            />
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
                          className='addRateFieldBtn'
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
                {
                  <TotalAmountContainer className={'newTotalAmount'}>
                    <div>Total:&nbsp;</div>
                    <div>${newTotalAmount}</div>
                  </TotalAmountContainer>
                }
                <div className='actions'>
                  <div className='leftButtons'>
                    <Button
                      shape='circle'
                      type='secondary'
                      icon={<PaperClipOutlined />}
                      onClick={openFilePicker}
                    >
                      <input
                        ref={filePicker}
                        type='file'
                        onChange={(e) => onAttachmentLoad(e.target.files)}
                        multiple
                      />
                    </Button>
                    <Button shape='round' onClick={onMemoPreviewClick}>
                      Preview
                    </Button>
                  </div>
                  <div className='rightButtons'>
                    <Button shape='round' onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button
                      shape='round'
                      type='primary'
                      loading={updateInvoiceMemo.loading}
                      htmlType='submit'
                    >
                      Save
                    </Button>
                  </div>
                </div>
                {innerAttachments.length > 0 && (
                  <MemoAttachments
                    attachments={innerAttachments}
                    onDelete={onAttachmentDelete}
                  />
                )}
              </Form>
            )}
          </Formik>
        </div>
        <MemoPreview
          visible={memoPreview.visible}
          job={job}
          memo={memoPreview.memo}
          setModalData={handleMemoPreview}
        />
      </InvoiceMemoWrapper>
    </Modal>
  );
};

export default InvoiceMemo;
