import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CompanyOwnerWrapper, {MessageDiv} from './CompanyOwner.style';
import { Row, Col } from 'antd';
import { Formik, Field, Form } from 'formik';
import { InfoCircleFilled } from '@ant-design/icons';
import Radio, { RadioGroup } from '@iso/components/uielements/radio';
import Select, { SelectOption } from '@iso/components/uielements/select';
import Input from '@iso/components/uielements/input';
import Button from '@iso/components/uielements/button';
import InputField from '@iso/components/shared/InputField';
import {
  fetchCompanyDetailByEmailRequest,
  createWizardCompanyRequest,
  updateWizardCompanyRequest,
  prevWizardStep
} from '@iso/redux/accountWizard/actions';
import { fetchCompanyTypeRequest } from '@iso/redux/company/actions';

import validationSchema from './schema';
import basicStyle from '@iso/assets/styles/constants';
import notify from '@iso/lib/helpers/notify';
import { showServerError } from '@iso/lib/helpers/utility';

const { rowStyle, gutter } = basicStyle;
const Option = SelectOption;

const CompanyOwner = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { view } = useSelector((state) => state.App);

  const { user: authUser } = useSelector((state) => state.Auth);
  const { company, wizard } = useSelector((state) => state.AccountWizard);
  const { companyType, companyTypeList } = useSelector(
    (state) => state.Company
  );

  const [isOwner, setIsOwner] = useState(true);
  const [action, setAction] = useState('');
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    isOwner: true,
    ownerEmail: ''
  });

  const formikRef = useRef();

  useEffect(() => {
    if (company && company.id) {
      setFormData({
        ...formikRef.current.values,
        type: company.type,
        title: company.title
      });
    }
  }, [company]);

  useEffect(() => {
    if (!formData.type && companyTypeList.length) {
      setFormData({
        ...formData,
        type: companyTypeList[0].companyTypeValue
      });
    }
  }, [companyTypeList]);

  useEffect(() => {
    dispatch(fetchCompanyTypeRequest());
  }, [dispatch]);

  useEffect(() => {
    if (isOwner) {
      dispatch(fetchCompanyDetailByEmailRequest(authUser.email));
    }
  }, [isOwner]);

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

  const handleCompanyOwnerEmailChange = (email) => {
    if (!email) return;
    dispatch(fetchCompanyDetailByEmailRequest(email));
  };

  const handleSubmit = (values) => {
    let payload = { ...values, creatorEmail: authUser.email , type : 'Musical Groups and Artists' };
    if (values.isOwner) {
      payload.ownerEmail = values.ownerEmail;
    }

    setAction('save');
    if (company && company.id) {
      dispatch(updateWizardCompanyRequest(company.id, payload));
    } else {
      dispatch(createWizardCompanyRequest(payload));
    }
  };
  return (
    <CompanyOwnerWrapper>
      <h1>Are you the band account owner?</h1>
      <div className='white-box'>
        <Formik
          enableReinitialize
          innerRef={formikRef}
          initialValues={formData}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ values, touched, errors, setFieldValue }) => (
            <Form>
              <div className='topFieldWrapper'>
                {view !== 'MobileView' ? (
                  <Row gutter={20} justify='start'>
                    <Col flex={5}>
                      <RadioGroup
                        name='isOwner'
                        value={values.isOwner}
                        onChange={(e) => {
                          setFieldValue('isOwner', e.target.value);
                          setIsOwner(e.target.value);
                        }}
                      >
                        <Radio value={true}>Yes</Radio>
                      </RadioGroup>

                      <div className='formGroup'>
                        <label className='fieldLabel'>Email</label>
                        <Input
                          value={isOwner ? authUser.email : ''}
                          disabled={true}
                        />
                      </div>
                    </Col>
                    <Col flex='45px'>
                      <div className='dividerWrapper'>
                        <div className='divider vertical' />
                        <span>or</span>
                        <div className='divider vertical' />
                      </div>
                    </Col>
                    <Col flex={5}>
                      <RadioGroup
                        name='isOwner'
                        value={values.isOwner}
                        onChange={(e) => {
                          setFieldValue('isOwner', e.target.value);
                          setIsOwner(e.target.value);
                        }}
                      >
                        <Radio value={false} disabled={authUser.type}>
                          No
                        </Radio>
                      </RadioGroup>

                      <div className='formGroup'>
                        <label className='fieldLabel'>
                          Bandleader Email
                        </label>
                        <Field name='email'>
                          {() => (
                            <Input
                              disabled={isOwner}
                              value={values.ownerEmail}
                              onChange={(e) =>
                                setFieldValue('ownerEmail', e.target.value)
                              }
                              onBlur={(e) =>
                                handleCompanyOwnerEmailChange(e.target.value)
                              }
                              onPressEnter={(e) =>
                                handleCompanyOwnerEmailChange(e.target.value)
                              }
                            />
                          )}
                        </Field>
                        {touched.ownerEmail && errors.ownerEmail && (
                          <div className='helper-text lowercase'>
                            {errors.ownerEmail}
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <>
                    <Row gutter={20} justify='start'>
                      <Col flex={5}>
                        <RadioGroup
                          name='isOwner'
                          value={values.isOwner}
                          onChange={(e) => {
                            setFieldValue('isOwner', e.target.value);
                            setIsOwner(e.target.value);
                          }}
                        >
                          <Radio value={true}>Yes</Radio>
                        </RadioGroup>
                      </Col>
                      <Col flex={5}>
                        <RadioGroup
                          name='isOwner'
                          value={values.isOwner}
                          onChange={(e) => {
                            setFieldValue('isOwner', e.target.value);
                            setIsOwner(e.target.value);
                          }}
                        >
                          <Radio value={false} disabled={authUser.type}>
                            No
                          </Radio>
                        </RadioGroup>
                      </Col>
                    </Row>
                    <Row gutter={20} justify='start'>
                      <Col flex={5}>
                        {isOwner ? (
                          <div className='formGroup'>
                            <label className='fieldLabel'>Email</label>
                            <Input
                              value={isOwner ? authUser.email : ''}
                              disabled={true}
                            />
                          </div>
                        ) : (
                          <div className='formGroup'>
                            <label className='fieldLabel'>
                              Bandleader Email
                            </label>
                            <Field name='email'>
                              {() => (
                                <Input
                                  value={values.ownerEmail}
                                  onChange={(e) =>
                                    setFieldValue('ownerEmail', e.target.value)
                                  }
                                  onBlur={(e) =>
                                    handleCompanyOwnerEmailChange(
                                      e.target.value
                                    )
                                  }
                                  onPressEnter={(e) =>
                                    handleCompanyOwnerEmailChange(
                                      e.target.value
                                    )
                                  }
                                />
                              )}
                            </Field>
                            {touched.ownerEmail && errors.ownerEmail && (
                              <div className='helper-text lowercase'>
                                {errors.ownerEmail}
                              </div>
                            )}
                          </div>
                        )}
                      </Col>
                    </Row>
                  </>
                )}
              </div>

              <div className='bottomFieldWrapper'>
                <Row style={rowStyle} gutter={30} justify='start'>
                  {/* <Col md={12} xs={24}>
                    <div className='formGroup'>
                      <label className='fieldLabel'>Company Type</label>
                      <Field>
                        {() => (
                          <Select
                            showSearch
                            name='type'
                            style={{ width: '100%' }}
                            value={values.type}
                            onChange={(value) => {
                              setFieldValue('type', value);
                            }}
                          >
                            {companyTypeList.map((ct) => (
                              <Option
                                value={ct.companyTypeValue}
                                key={ct.companyTypeValue}
                              >
                                {ct.companyTypeName}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </Field>
                      {touched.type && errors.type && (
                        <div className='helper-text lowercase'>
                          {errors.type}
                        </div>
                      )}
                    </div>
                  </Col> */}
                  <Col md={12} xs={24}>
                    <div className='formGroup'>
                      <label className='fieldLabel'>Band Name</label>
                      <Field component={InputField} name='title' type='text' />
                    </div>
                  </Col>
                  <Col flex='33px'>

                  </Col>
                  <Col md={12} xs={24}>
                    <MessageDiv color='#f5dbc4'>
                      <p className='modal-icon-wrapper'>
                        <InfoCircleFilled
                          style={{ color: '#f48d3a' }}
                        />
                      </p>
                      <p>
                        When you make another person the bandleader, you and that person can book a band together and would share information for that band.
                      </p>
                    </MessageDiv>
                  </Col>
                </Row>
              </div>
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
    </CompanyOwnerWrapper>
  );
};

export default CompanyOwner;
