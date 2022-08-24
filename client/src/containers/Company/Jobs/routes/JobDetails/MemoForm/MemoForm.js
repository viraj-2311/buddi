import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import { Formik, Field, Form, useFormikContext, FieldArray } from 'formik';
import _ from 'lodash';
import EditIcon from '@iso/components/icons/Edit';
import filesize from 'filesize.js';
import { PlusCircleOutlined, PaperClipOutlined } from '@ant-design/icons';
import MultiplyIcon from '@iso/components/icons/Multiply';
import MemoPreview from './MemoPreview';
import CalendarIcon from '@iso/components/icons/Calendar';
import Button from '@iso/components/uielements/button';
import InputField from '@iso/components/shared/InputField';
import Input, { InputGroup } from '@iso/components/uielements/input';
import NumberFormat from 'react-number-format';
import Select, { SelectOption } from '@iso/components/uielements/select';
import LocationField from '@iso/components/LocationField';
import Radio, { RadioGroup } from '@iso/components/uielements/radio';
import DayPicker from '@iso/components/shared/DayPicker';
import Timepicker from '@iso/components/uielements/timePicker';
import { Row, Col } from 'antd';
import { fetchLocationsRequest } from '@iso/redux/location/actions';
import {
  staffMemoValidationSchema,
  hourlyContractorMemoValidationSchema,
  fixedContractorMemoValidationSchema,
} from './schema';
import {
  MemoFormWrapper,
  MemoFormButtonsWrapper,
  MemoAttachmentWrapper,
  TotalAmountContainer,
} from './MemoForm.style';
import {
  stringToDate,
  formatDateString,
  showServerError,
  getMemoPriceWithAddRateExtraField,
  stringToTime,
  formatTimeString
} from '@iso/lib/helpers/utility';
import { dateFormat } from '@iso/config/datetime.config';
import MemoTypes from '@iso/enums/memo_types';
import MemoCrewTypes from '@iso/enums/memo_crew_types';
import MemoPriceTypes from '@iso/enums/memo_price_types';
import UserTypes from '@iso/enums/user_types';
import notify from '@iso/lib/helpers/notify';
import Editor from '@iso/components/uielements/editor';
import { ProducerJobAttachments } from "../../../../../Person/Jobs/routes/JobDetails/JobAttachments";
import NoAttachmentImg from '@iso/assets/images/no-memo-attachment.svg';
import Icon from '@iso/components/icons/Icon';
import { deleteContractorAttachmentRequest } from '@iso/redux/producerJob/actions';

const Option = SelectOption;

const DaySelector = ({ value, minDay = 1, maxDay = 60, onSelect, ...rest }) => {
  return (
    <Select value={value} onSelect={onSelect} placeholder='0' {...rest}>
      {_.range(minDay, maxDay + 1).map((day) => (
        <Option key={day} value={day}>
          {day}
        </Option>
      ))}
    </Select>
  );
};

const FormAttachment = ({ attachments, onDelete }) => {
  return (
    <MemoAttachmentWrapper>
      {attachments.map((attachment, index) => (
        <div className='attachment' key={`attachment-${index}`}>
          <div className='nameAndSize'>
            <a
              href={attachment.path}
              target='_blank'
              className='name'
              title={attachment.name}
            >
              {attachment.name}
            </a>
            <span>({filesize(attachment.size)})</span>
          </div>
          <Button
            type='link'
            icon={<MultiplyIcon width={14} height={14} />}
            onClick={() => onDelete(index)}
          />
        </div>
      ))}
    </MemoAttachmentWrapper>
  );
};

const defaultHeadline = (name) =>
  '<p>Hi&nbsp;<strong>' +
  name +
  '</strong>,</p>' +
  '<p><br></p>' +
  '<p>Please respond promptly to this memo so the bandleader knows your status with this gig.</p>';

const initialMemo = {
  agencyFullName: '',
  agencyEmail: '',
  fullName: '',
  position: '',
  email: '',
  shootDates: [],
  city: '',
  state: '',
  memoStaff: MemoCrewTypes.CONTRACTOR_W9,
  priceType: MemoPriceTypes.HOURLY,
  payTerms: 0,
  dailyHours: 0,
  workingDays: 0,
  workingRate: 0,
  kitFee: 0,
  projectRate: 0,
  rates: [],
  attachments: [],
  headline: '',
};

const MemoForm = ({
  job,
  memoType,
  contractor,
  defaultValues,
  onSubmit,
  onCancel,
  onClose,
  readOnly=false,
  onReadOnlyCallBack=()=>{}
}) => {
  const dispatch = useDispatch();
  const formContainerRef = useRef();
  const attachFormContainerRef = useRef();
  const attachmentContainerRef = useRef();
  const { locations } = useSelector((state) => state.Location);
  const { error: memoCreateError, loading: memoCreateLoading } = useSelector(
    (state) => state.ProducerJob.memoCreate
  );
  const { error: memoUpdateError, loading: memoUpdateLoading } = useSelector(
    (state) => state.ProducerJob.memoUpdate
  );
  const { contractorAttachmentDeleted } = useSelector((state) => state.ProducerJob);

  const [action, setAction] = useState('');
  const [memoData, setMemoData] = useState(initialMemo);
  const [locked, setLocked] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [crewType, setCrewType] = useState(null);
  const [priceType, setPriceType] = useState(null);
  const [memoPreview, setMemoPreview] = useState({
    visible: false,
    memo: null,
  });
  const [innerAttachments, setInnerAttachments] = useState([]);
  const [validationSchema, setValidationSchema] = useState(null);
  const iconColor = '#2f2e50';
  const [totalAmount, setTotalAmount] = useState(0);
  const Edit = () => <EditIcon width={18} height={18} fill={iconColor} />;

  const filePicker = useRef(null);
  const formikRef = useRef(null);
  const onReadOnly = ()=>{
    if(readOnly){
      onReadOnlyCallBack();
    }
  }
  const isNew = useMemo(() => {
    return contractor.memoId === 'new';
  }, [contractor]);

  const isBooked = useMemo(() => {
    return contractor.booked;
  }, [contractor]);

  const isDeclined = useMemo(() => {
    return contractor.decline;
  }, [contractor]);
  
  const isNoRelationship = useMemo(() => {
    return (
      !contractor.companyRelationship ||
      contractor.companyRelationship === 'NO RELATION'
    );
  }, [contractor]);

  const isContractorRelationship = useMemo(() => {
    return UserTypes.CONTRACTOR.includes(contractor.companyRelationship);
  }, [contractor]);

  const unAnsweredMemo = useMemo(() => {
    return (
      memoType === MemoTypes.DEAL && contractor.memoType === MemoTypes.HOLD
    );
  }, [contractor]);

  const canCancel = useMemo(() => {
    return !isNew && !unAnsweredMemo;
  }, [contractor]);

  const memoRequestLoading = useMemo(() => {
    return memoCreateLoading || memoUpdateLoading;
  }, [memoCreateLoading, memoUpdateLoading]);

  const memoRequestError = useMemo(() => {
    return memoCreateError || memoUpdateError;
  }, [memoCreateError, memoUpdateError]);

  useEffect(() => {
    dispatch(fetchLocationsRequest());
  }, [dispatch]);

  useEffect(() => {
    setLocked(false);
    let memoInfo = { ...initialMemo };
    if (isNew) {
      memoInfo = {
        ...memoInfo,
        ...defaultValues,
        fullName: contractor.fullName,
        position: contractor.jobRole?.jobRoleType?.title,
        email: contractor.email,
        headline: memoInfo.headline || defaultHeadline(contractor.fullName),
      };

      if (memoInfo.shootDates && memoInfo.shootDates.length) {
        memoInfo = { ...memoInfo, workingDays: memoInfo.shootDates.length };
      }

      if (UserTypes.PRODUCER.includes(contractor.companyRelationship)) {
        memoInfo = { ...memoInfo, memoStaff: MemoCrewTypes.EMPLOYEE };
      } else if (
        UserTypes.CONTRACTOR.includes(contractor.companyRelationship)
      ) {
        memoInfo = {
          ...memoInfo,
          memoStaff: MemoCrewTypes.CONTRACTOR_W9,
          priceType: MemoPriceTypes.HOURLY,
        };
      }
    } else {
      memoInfo = {
        ...memoInfo,
        ...contractor,
        position: contractor.jobRole?.jobRoleType?.title,
      };

      // if (contractor.accepted) {
      //   setLocked(true);
      // }
    }

    setMemoData(memoInfo);

    setCrewType(memoInfo.memoStaff);
    setPriceType(memoInfo.priceType);
    setInnerAttachments(memoInfo.attachments || []);
  }, [contractor]);

  useEffect(() => {
    if (isEmployeeMemo(crewType)) {
      setValidationSchema(staffMemoValidationSchema);
    } else {
      setValidationSchema(hourlyContractorMemoValidationSchema);

      if (priceType === MemoPriceTypes.HOURLY) {
        setValidationSchema(hourlyContractorMemoValidationSchema);
      } else if (priceType === MemoPriceTypes.FIXED) {
        setValidationSchema(fixedContractorMemoValidationSchema);
      }
    }
  }, [crewType, priceType]);

  useEffect(() => {
    if (unAnsweredMemo) {
      setLocked(true);
      if (contractor.memoStaff === MemoCrewTypes.EMPLOYEE) {
        setFormTitle('Band Staff Hold Memo (Unanswered)');
      } else {
        setFormTitle('Hold Memo (Unanswered)');
      }

      return;
    }

    if (memoType === MemoTypes.DEAL) {
      if (crewType === MemoCrewTypes.EMPLOYEE) {
        setFormTitle('Band Staff Booking Memo');
      } else {
        setFormTitle('Talent Booking Memo');
      }
    } else {
      if (crewType === MemoCrewTypes.EMPLOYEE) {
        setFormTitle('Band Staff Hold Memo');
      } else {
        setFormTitle('Hold Memo');
      }
    }
  }, [contractor, memoType, crewType]);

  useEffect(() => {
    if (!memoRequestLoading && !memoRequestError && action === 'save') {
      setMemoData(initialMemo);
      setMemoPreview({ visible: false, memo: null });
      onClose();
    }

    if (memoRequestError && action === 'save') {
      notify('error', showServerError(memoRequestError));
    }

    if (!memoRequestLoading && action === 'save') {
      setAction('');
    }
  }, [memoRequestLoading, memoRequestError]);

  useEffect(() => {
    if (contractorAttachmentDeleted.error) {
      notify('error', 'Failed to delete attachment');
    } else if (contractorAttachmentDeleted.success) {
      const attachmentIndex = innerAttachments.findIndex((item) => {
        return item.id === contractorAttachmentDeleted.attachmentId;
      });
      onAttachmentDelete(attachmentIndex);
    }
  }, [contractorAttachmentDeleted])

  const isEmployeeMemo = (crewType) => {
    return crewType === MemoCrewTypes.EMPLOYEE;
  };

  const handleSubmit = (values) => {
    if(readOnly) return;
    const newValues = cloneDeep(values);
    // let positionRole = '';
    // if(newValues['position'] == '3rd Band Leader'){
    //   positionRole = 'Line Producer';
    // } else if(newValues['position'] == '2nd Band Leader'){
    //   positionRole = 'Director';
    // } else {
    //   positionRole = 'Exec Producer';
    // }

    newValues.rates.forEach((e) => {
      delete e.isEdit;
      if (e.priceType === MemoPriceTypes.FIXED) {
        delete e.numberOfDays;
        delete e.dayRate;
      } else if (e.priceType === MemoPriceTypes.HOURLY) {
        delete e.projectRate;
      }
    });
    setAction('save');
    newValues['memoType'] = memoType;
    newValues['attachments'] = [...innerAttachments];
    // newValues['position'] = positionRole;

    if (crewType === MemoCrewTypes.AGENCY) {
      delete newValues.email;
    }

    if(!!newValues?.accepted && newValues?.memoType === MemoTypes.DEAL && !!isBooked){
      newValues['booked'] = false;
    }
    onSubmit(newValues);
  };

  const handleClose = () => {
    onClose();
  };

  const handleCancel = () => {
    onCancel(contractor);
  };

  const formatShootDates = (dateStrings = []) => {
    return dateStrings.map((date) => stringToDate(date).toDate());
  };
  const client = job?.client;
  const soundCheckTime = job?.soundCheckTime
  const setTime = job?.setTime;
  const onMemoPreviewClick = () => {
    setMemoPreview({
      visible: true,
      memo: {
        ...formikRef.current.values,
        memoType,
        client,
        setTime,
        soundCheckTime,
        isUnAnswered: unAnsweredMemo,
      },
    });
  };

  const handleMemoPreview = (type, data) => {
    if (type === 'close') {
      setMemoPreview({ visible: false, memo: null });
    }

    if (type === 'update') {
      setMemoData({ ...memoData, headline: data });
      setMemoPreview({ visible: false, memo: null });
    }

    if (type === 'send') {
      setMemoData({ ...memoData, headline: data });
      setMemoPreview({ visible: false, memo: null });
      formikRef.current.handleSubmit();
    }
  };

  const openFilePicker = () => {
    filePicker.current.click();
  };

  const onAttachmentLoad = (attachments) => {
    setInnerAttachments([...innerAttachments, ...Array.from(attachments)]);
  };

  const onAttachmentDelete = (index) => {
    const cloned = [...innerAttachments];
    cloned.splice(index, 1);
    setInnerAttachments(cloned);
  };

  const onContractorAttachmentDelete = (attachment) => {
    dispatch(deleteContractorAttachmentRequest(job.id, contractor.memoId, attachment.id));
  };

  const FormButtons = () => {
    const { dirty } = useFormikContext();

    return (
      <MemoFormButtonsWrapper>
        <Row gutter={30} style={{ alignItems: 'center' }}>
          <Col md={8} sm={24} xs={24} style={{ textAlign: 'left' }}>
          <TotalAmountContainer className='total-amount'>
                  <div>Total:&nbsp;</div>
                  <div>${totalAmount}</div>
                </TotalAmountContainer>
          </Col>
          <Col md={16} sm={24} xs={24} className='action-view' style={{ textAlign: 'right' }}>
            {memoType === MemoTypes.HOLD && (
              <>
                {!isBooked && (
                  <Button shape='round' onClick={handleClose}>
                    Cancel
                  </Button>
                )}
                {canCancel && (
                  <Button
                    type='danger'
                    shape='round'
                    disabled={action === 'save'}
                    onClick={handleCancel}
                  >
                    Cancel Memo
                  </Button>
                )}
                {!locked && (
                  <Button
                    type='primary'
                    htmlType='submit'
                    shape='round'
                    disabled={!isNew && !dirty}
                    loading={action === 'save'}
                  >
                    {isNew ? 'Send' : 'Update/Resend'}
                  </Button>
                )}
              </>
            )}

            {memoType === MemoTypes.DEAL && (
              <>
                {isNew && (
                  <Button shape='round' onClick={handleClose}>
                    Cancel
                  </Button>
                )}
                {canCancel && (
                  <Button
                    type='danger'
                    shape='round'
                    disabled={action === 'save'}
                    onClick={handleCancel}
                  >
                    Cancel Memo
                  </Button>
                )}
                {!locked && (
                  <Button
                    type='primary'
                    shape='round'
                    htmlType='submit'
                    disabled={!isNew && !dirty}
                    loading={action === 'save'}
                  >
                    {isNew
                      ? 'Save'
                      : isBooked || isDeclined
                      ? 'Update/Resend'
                      : 'Send to Book Talent Page'}
                  </Button>
                )}
              </>
            )}
          </Col>
        </Row>
      </MemoFormButtonsWrapper>
    );
  };
  const setEditData = (key, val) => {
    const { setFieldValue } = formikRef.current;
    if(setFieldValue)
    setFieldValue(key, val);
  }

  const AgencyFields = () => {
    const { setFieldValue } = useFormikContext();

    return (
      <>
        <Col md={12} sm={24} xs={24}>
          <label className='fieldLabel'>Agent Full Name</label>
          <Field component={InputField} name='agencyFullName' type='text' />
        </Col>
        <Col md={12} sm={24} xs={24}>
          <label className='fieldLabel'>Email</label>
          <Field
            component={InputField}
            name='agencyEmail'
            type='text'
            onChange={(e) =>
              setFieldValue('agencyEmail', e.target.value.replace(/\s/g, ''))
            }
          />
        </Col>
        <Col md={12} sm={24} xs={24}>
          <label className='fieldLabel'>Talent Full Name</label>
          <Field component={InputField} name='fullName' type='text' />
        </Col>
        <Col md={12} sm={24} xs={24}>
          {/* <label className='fieldLabel'>Email</label>
          <Field
            component={InputField}
            name='email'
            type='text'
            onChange={(e) =>
              setFieldValue('email', e.target.value.replace(/\s/g, ''))
            }
          /> */}
        </Col>
      </>
    );
  };

  const NoAgencyFields = () => {
    const { setFieldValue } = useFormikContext();

    return (
      <>
        <Col md={12} sm={24} xs={24}>
          <label className='fieldLabel'>Full Name</label>
          <Field component={InputField} name='fullName' type='text' />
        </Col>
        <Col md={12} sm={24} xs={24}>
          <label className='fieldLabel'>Email</label>
          <Field
            component={InputField}
            name='email'
            type='text'
            onChange={(e) =>
              setFieldValue('email', e.target.value.replace(/\s/g, ''))
            }
          />
        </Col>
      </>
    );
  };

  const getInitialRateFields = () => {
    return {
      title: '',
      isEdit: true,
      priceType: MemoPriceTypes.HOURLY,
      dayRate: '',
      projectRate: '',
      numberOfDays: (memoData.shootDates && memoData.shootDates.length) || 1,
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
      memoData.workingDays ||
        (memoData.shootDates && memoData.shootDates.length) ||
        1
    );
    setFieldValue('dailyHours', 0);
  };

  const validateFunc = useCallback((value) => {
    setTotalAmount(getMemoPriceWithAddRateExtraField(value));
  }, []);

  useEffect(() => {
    if (formikRef.current && formikRef.current.values) {
      setTotalAmount(
        getMemoPriceWithAddRateExtraField(formikRef.current.values)
      );
    }
  }, [formikRef.current]);

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

  const contractorAttachments = useMemo(() => {
    return innerAttachments.filter((attachment) => {
      return attachment.uploadedBy === contractor.fullName
    })
  },[innerAttachments, contractor]);

  const ownerAttachments = useMemo(() => {
    return innerAttachments.filter((attachment) => {
      return attachment.uploadedBy !== contractor.fullName
    })
  },[innerAttachments, contractor]);
    useEffect(() => {
      let interval = null;
      if(readOnly){
        interval = setInterval(() => {
          if(formContainerRef.current)
            formContainerRef.current.style.pointerEvents = "none";
          if(attachFormContainerRef.current)
            attachFormContainerRef.current.style.pointerEvents = "none";
          if(attachmentContainerRef.current)
            attachmentContainerRef.current.style.pointerEvents = "none";       
        }, 1000);
      }else{
        if(formContainerRef.current)
            formContainerRef.current.style.pointerEvents = "auto";
          if(attachFormContainerRef.current)
            attachFormContainerRef.current.style.pointerEvents = "auto";
          if(attachmentContainerRef.current)
            attachmentContainerRef.current.style.pointerEvents = "none";       
      }
    return () => {
      if(interval)
        window.clearInterval(interval);
    };
  }, [])
  return (
    <>
    <MemoFormWrapper>
      <div className='MemoHeader'>
        <h3 className='title'>{formTitle}</h3>
        <Button type='link' onClick={handleClose}>
          <MultiplyIcon width={16} height={16} />
        </Button>
      </div>
      <div className='MemoBody'>
        <Formik
          enableReinitialize
          innerRef={formikRef}
          initialValues={memoData}
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
              <div onClick={()=>{
                onReadOnly();
              }}>
              <div ref={formContainerRef}>
                <div className='topField'>
                <Row gutter={[20, 20]}>
                  {crewType === MemoCrewTypes.AGENCY ? (
                    <AgencyFields />
                  ) : (
                    <NoAgencyFields />
                  )}
                  <Col md={12} sm={24} xs={24}>
                    <label className='fieldLabel'>Position</label>
                    <Field
                      component={InputField}
                      name='position'
                      type='text'
                      disabled={true}
                    />
                  </Col>
                  <Col md={12} sm={24} xs={24}>
                    <label className='fieldLabel'>Dates</label>
                    <Field>
                      {() => (
                        <DayPicker
                          className='fieldControl w-180'
                          placeholder='Select date'
                          suffixIcon={
                            <CalendarIcon
                              width={20}
                              height={18}
                              fill='#bcbccb'
                            />
                          }
                          showDaysCount={true}
                          values={formatShootDates(values.shootDates)}
                          onChange={(dates) => {
                            const dateStrings = dates.map((date) =>
                              formatDateString(date, dateFormat)
                            );
                            setFieldValue('shootDates', dateStrings);
                            setFieldValue('workingDays', dates.length);
                          }}
                        />
                      )}
                    </Field>
                    {touched.shootDates && errors.shootDates && (
                      <div className='helper-text lowercase'>
                        {errors.shootDates}
                      </div>
                    )}
                  </Col>
                  <Col md={8} sm={12} xs={24}>
                    <label className='fieldLabel'>Gig Location - City</label>
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
                  <Col md={8} sm={12} xs={24}>
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
                      <div className='helper-text lowercase'>
                        {errors.state}
                      </div>
                    )}
                  </Col>
                </Row>
              </div>
              <div className='middleField'>
                <Row gutter={[20, 20]} className={locked ? 'locked' : ''}>
                  <Col md={12} sm={24} xs={24} className='hourlyFieldWrapper'>
                    <Row gutter={30}>
                      <Col md={12} sm={12} xs={24}>
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
                            <span className='radioLabel'>Gig Rate Per Day</span>
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

                      <Col md={12} sm={12} xs={24}>
                        <label className='fieldLabel mb-8'>Set Length</label>
                          <Field>
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
                  <Col md={6} sm={12} xs={24} className='fixedFieldWrapper'>
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
                                          name={`rates[${index}].projectRate`}
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

              <div className='headlineField'>
                <label className='fieldLabel'>
                  Write your Email to the freelancer Talent here
                </label>
                <Field name='content'>
                  {({ field }) => (
                    <Editor
                      onChange={(html) => {
                        setFieldValue('headline', html);
                      }}
                      value={values.headline}
                      modules={{
                        toolbar: [
                          ['bold', 'italic', 'underline', 'strike'],
                          [
                            { list: 'ordered' },
                            { list: 'bullet' },
                            { indent: '-1' },
                            { indent: '+1' },
                          ],
                          ['link', 'image', 'video'],
                          ['clean'],
                        ],
                      }}
                    />
                  )}
                </Field>
              </div>
              </div>
              </div>
              {
               <MemoFormButtonsWrapper className='b-0'>
                <Button
                shape='circle'
                type='secondary'
                icon={<PaperClipOutlined />}
                onClick={openFilePicker}
                disabled={readOnly}
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
              </MemoFormButtonsWrapper>
              }
              <FormButtons />
              <div onClick={onReadOnly}>
                <div ref={attachFormContainerRef}>
                  {ownerAttachments.length > 0 && (
                    <FormAttachment
                      attachments={ownerAttachments}
                      onDelete={onAttachmentDelete}
                    />
                  )}
                </div>
              </div>
            </Form>
          )}
        </Formik>
        {
          contractor.memoId !== 'new' &&
          <div onClick={onReadOnly}>
            <div className={'contractorAttachments'} ref={attachmentContainerRef}>
              <p className={'contractorAttachmentsTitle'}>Attachments from {contractor.fullName}</p>
              {
                contractorAttachments.length > 0 ?
                    <ProducerJobAttachments attachments={contractorAttachments} onDelete={onContractorAttachmentDelete} /> :
                    <div className={'noAttachment'}>
                      <Icon image={NoAttachmentImg} width={28} height={35} color={'#bcbccb'} />
                      <p className={'noAttachmentTitle'}>No Attachments</p>
                    </div>
              }
            </div>
          </div>
        }
      </div>
      </MemoFormWrapper>
      <MemoPreview
        visible={memoPreview.visible}
        job={job}
        memo={memoPreview.memo}
        setModalData={handleMemoPreview}
        setEditData={setEditData}
      />
    </>
  );
};

export default MemoForm;
