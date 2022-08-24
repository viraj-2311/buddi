import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CreateCompanyModalWrapper, { MessageDiv } from './CreateCompany.styles';
import { Field, Form, Formik } from 'formik';
import { Col, Row } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import Radio, { RadioGroup } from '@iso/components/uielements/radio';
import Select, { SelectOption } from '@iso/components/uielements/select';
import Input from '@iso/components/uielements/input';
import Button from '@iso/components/uielements/button';
import Modal from '@iso/components/Modal';
import { useHistory, useLocation } from 'react-router';
import InputField from '@iso/components/shared/InputField';
import {
  fetchCompanyDetailByEmailRequest,
  createWizardCompanyRequest,
  updateWizardCompanyRequest,
} from '@iso/redux/accountWizard/actions';
import { fetchCompanyTypeRequest } from '@iso/redux/company/actions';
import validationSchema, { validationSchemaOwner } from './schema';
import basicStyle from '@iso/assets/styles/constants';
import { syncAuthUserRequest } from '@iso/redux/auth/actions';
import { setWorkspaceCompany } from '@iso/redux/accountBoard/actions';
import notify from '@iso/lib/helpers/notify';

const { rowStyle } = basicStyle;
const Option = SelectOption;

export default function ({ visible, setModalData }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { user: authUser, syncUser } = useSelector((state) => state.Auth);
  const { companies } = useSelector((state) => state.User);
  const { company, wizard } = useSelector((state) => state.AccountWizard);
  const { companyType, companyTypeList } = useSelector(
    (state) => state.Company
  );
  const [isOwner, setIsOwner] = useState(company && company.id ? false : true);
  const [action, setAction] = useState('');
  const [isOwnerValidation, setIsOwnerValidation] = useState(null);
  const [shouldRedirectToCompany, setShouldRedirectToCompany] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    isOwner: company && company.id ? false : true,
    ownerEmail: '',
  });

  const formikRef = useRef();

  useEffect(() => {
    if (!formikRef.current) return;

    if (company && company.id) {
      setFormData({
        ...formikRef.current.values,
        type: company.type,
        title: company.title,
      });
    }
  }, [company]);

  useEffect(() => {
    dispatch(fetchCompanyTypeRequest());
  }, [dispatch]);

  useEffect(() => {
    if (!formData.type && companyTypeList.length) {
      setFormData({
        ...formData,
        type: companyTypeList[0].companyTypeValue,
      });
    }
  }, [companyTypeList]);

  const handleCancel = () => {
    setModalData('close');
  };

  useEffect(() => {
    if (visible && isOwner) {
      dispatch(fetchCompanyDetailByEmailRequest(authUser.email));
    }
  }, [visible, isOwner]);

  useEffect(() => {
    if (visible && !wizard.loading && !wizard.error && action === 'save') {
      dispatch(syncAuthUserRequest());
    }
    if (!wizard.loading && action === 'save') {
      setAction('');
    }
  }, [wizard]);

  useEffect(() => {
    if (
      visible &&
      !wizard.loading &&
      !wizard.error &&
      !syncUser.loading &&
      !syncUser.error
    ) {
      if(shouldRedirectToCompany){
        dispatch(setWorkspaceCompany(company.id));
        history.push(`/companies/${company.id}/jobs`);
      }
      notify('success', `Band ${company.title} has been created`);
      setModalData('success');
    }
  }, [syncUser]);

  const hasOwnCompany = () => {
    if (authUser.companies.length == 0) {
      setIsOwnerValidation(false);
      return false;
    } else if (authUser.companies.length > 0) {
      const companies = authUser.companies;
      for (let i = 0; i < companies.length; i++) {
        if (companies[i].relationship === 'OWNER') {
          setIsOwnerValidation(true);
          return true;
        }
      }
      return false;
    }
  };

  const handleCompanyOwnerEmailChange = (email) => {
    if (!email) return;
    dispatch(fetchCompanyDetailByEmailRequest(email));
  };

  const handleSubmit = (values) => {
    let payload = { ...values, creatorEmail: authUser.email , type : 'Musical Groups and Artists' };
    if (values.isOwner) {
      payload.ownerEmail = values.ownerEmail
        ? values.ownerEmail
        : values.creatorEmail;
    }
    payload.isOwner = values.ownerEmail ? false : values.isOwner;

    setShouldRedirectToCompany(payload.isOwner);
    setAction('save');
    if (company && company.id) {
      dispatch(updateWizardCompanyRequest(company.id, payload));
    } else {
      dispatch(createWizardCompanyRequest(payload));
    }
  };

  return (
    <Modal
      visible={visible}
      title='Are you the Bandleader for this band?'
      width={950}
      footer={null}
      onCancel={handleCancel}
    >
      <CreateCompanyModalWrapper>
        <Formik
          enableReinitialize
          innerRef={formikRef}
          initialValues={formData}
          onSubmit={handleSubmit}
          validationSchema={ (isOwnerValidation) ? validationSchemaOwner : validationSchema }
        >
          {({ values, touched, errors, setFieldValue }) => (
            <Form>
              <div className='topFieldWrapper'>
                <Row gutter={20} justify='start'>
                  <Col flex={5}>
                    <RadioGroup
                      name='isOwner'
                      value={isOwner}
                      onChange={(e) => {
                        setFieldValue('isOwner', e.target.value);
                        setIsOwner(e.target.value);
                      }}
                      disabled={hasOwnCompany()}
                    >
                      <Radio value={hasOwnCompany() ? false : true}>Yes</Radio>
                    </RadioGroup>

                    <div className='formGroup'>
                      <label className='fieldLabel'>Email</label>
                      <Input
                        value={isOwner ? authUser.email : ''}
                        disabled={true}
                      />
                      {hasOwnCompany() && (
                        <div className='alert-message'>
                          <label>
                            {`You can only create 1 band per account`}
                          </label>
                        </div>
                      )}
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
                      value={isOwner}
                      onChange={(e) => {
                        setFieldValue('isOwner', e.target.value);
                        setIsOwner(e.target.value);
                      }}
                    >
                      <Radio value={hasOwnCompany() ? true : false}>No</Radio>
                    </RadioGroup>

                    <div className='formGroup'>
                      <label className='fieldLabel'>
                        Bandleader Email
                      </label>
                      <Field name='email'>
                        {() => (
                          <Input
                            disabled={hasOwnCompany() ? false : isOwner}
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
                    {hasOwnCompany() && (
                      <div className='hidden-message'>
                        <label>
                          {`You can only create 1 band per account`}
                        </label>
                      </div>
                    )}
                  </Col>
                </Row>
              </div>

              <div className='bottomFieldWrapper'>
                <Row style={rowStyle} gutter={20} justify='start'>
                  {/* <Col md={12} xs={24}>
                    <div className='formGroup'>
                      <label className='fieldLabel'>Band Type</label>
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
                  <Col flex='38px'>

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
                  Create Band
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CreateCompanyModalWrapper>
    </Modal>
  );
}
