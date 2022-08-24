import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SignInToCompanyWrapper from './SignInToCompany.styles';
import { Field, Form, Formik } from 'formik';
import { Col, Row } from 'antd';
import Input from '@iso/components/uielements/input';
import Button from '@iso/components/uielements/button';
import Modal from '@iso/components/Modal';
import {
  // fetchCompanyDetailByEmailRequest,
  createWizardCompanyRequest,
  updateWizardCompanyRequest,
} from '@iso/redux/accountWizard/actions';
import { fetchCompaniesRequest } from '@iso/redux/company/actions';
import {
  signIntoCompanyBySelectionSchema,
  singIntoCompanyByEmailSchema,
} from './schema';
import CompanyAutocomplete from '../CompanyAutocomplete/CompanyAutocomplete';

export default function ({ visible, setModalData }) {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.Auth);
  const { company, wizard } = useSelector((state) => state.AccountWizard);
  const { companies } = useSelector((state) => state.Company);
  const [action, setAction] = useState('');
  const [companySelectionFormData, setCompanySelectionFormData] = useState({
    companyId: '',
  });

  const [emailFormData, setEmailFormData] = useState({
    ownerEmail: '',
  });

  const companySelectionFormikRef = useRef();
  const emailFormikRef = useRef();

  useEffect(() => {
    dispatch(fetchCompaniesRequest());
  }, [dispatch]);

  const handleCancel = () => {
    setModalData('close');
  };

  useEffect(() => {
    if (!wizard.loading && !wizard.error && action === 'save') {
      setModalData('success');
    }

    if (!wizard.loading && action === 'save') {
      setAction('');
    }
  }, [wizard]);

  // const handleCompanyOwnerEmailChange = (email) => {
  //   if (!email) return;
  //   dispatch(fetchCompanyDetailByEmailRequest(email));
  // };

  const handleSubmitCompanySelect = (values) => {
    const { companyId } = values;
    console.log({ companyId });
    // setAction('save');
    // if (company && company.id) {
    //   dispatch(updateWizardCompanyRequest(company.id, payload));
    // } else {
    //   dispatch(createWizardCompanyRequest(payload));
    // }
  };

  const handleSubmitEmailForm = (values) => {
    const company = companies.find((c) => c.ownerEmail === values.ownerEmail);
    const { id: companyId } = company;
    console.log({ companyId });
    // let payload = { ...values, creatorEmail: authUser.email };
    // if (values.isOwner) {
    //   payload.ownerEmail = authUser.email;
    // }

    // setAction('save');
    // if (company && company.id) {
    //   dispatch(updateWizardCompanyRequest(company.id, payload));
    // } else {
    //   dispatch(createWizardCompanyRequest(payload));
    // }
  };

  return (
    <Modal
      visible={visible}
      width={565}
      footer={null}
      onCancel={handleCancel}
      keyboard={false}
    >
      <SignInToCompanyWrapper>
        <Formik
          enableReinitialize
          innerRef={companySelectionFormikRef}
          initialValues={companySelectionFormData}
          onSubmit={handleSubmitCompanySelect}
          validationSchema={signIntoCompanyBySelectionSchema}
        >
          {({ values, touched, errors, setFieldValue }) => (
            <Form>
              <div className='companySelectionTopFieldWrapper'>
                <h1>Sign in to another company</h1>

                <Row gutter={20} className='customRow'>
                  <Col span={24}>
                    <h3>Find the company you want to be part of</h3>
                    <div className='formGroup'>
                      <label className='fieldLabel'>Search Company Name</label>
                      <Field name='companyId'>
                        {() => (
                          <CompanyAutocomplete
                            companies={companies}
                            onSelect={(value) => {
                              setFieldValue('companyId', value);
                            }}
                          />
                        )}
                      </Field>
                      {/* touched.companyId && */}
                      {errors.companyId && (
                        <div className='helper-text lowercase'>
                          {errors.companyId}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col span={24} className='actionBtn'>
                    <Button type='primary' htmlType='submit' shape='round'>
                      Request Access
                    </Button>
                  </Col>
                  <Col span={24}>
                    <div className='dividerWrapper'>
                      <div className='divider' />
                      <span>OR</span>
                      <div className='divider' />
                    </div>
                  </Col>
                </Row>
              </div>
            </Form>
          )}
        </Formik>

        <Formik
          enableReinitialize
          innerRef={emailFormikRef}
          initialValues={emailFormData}
          onSubmit={handleSubmitEmailForm}
          validationSchema={singIntoCompanyByEmailSchema}
        >
          {({ values, touched, errors, setFieldValue }) => (
            <Form>
              <div className='emailTopFieldWrapper'>
                <Row gutter={20}>
                  <Col span={24}>
                    <h3>Enter the Bandleader Owner's Email</h3>
                    <div className='formGroup'>
                      <label className='fieldLabel'>
                        Bandleader Owner Email
                      </label>
                      <Field name='ownerEmail'>
                        {() => (
                          <Input
                            value={values.ownerEmail}
                            onChange={(e) =>
                              setFieldValue('ownerEmail', e.target.value)
                            }
                            // onBlur={(e) =>
                            //   handleCompanyOwnerEmailChange(e.target.value)
                            // }
                            // onPressEnter={(e) =>
                            //   handleCompanyOwnerEmailChange(e.target.value)
                            // }
                          />
                        )}
                      </Field>
                      {/* touched.ownerEmail &&  */}
                      {errors.ownerEmail && (
                        <div className='helper-text lowercase'>
                          {errors.ownerEmail}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col span={24} className='actionBtn'>
                    <Button
                      type='primary'
                      shape='round'
                      htmlType='submit'
                      className='wizardBtn'
                    >
                      Request Access
                    </Button>
                  </Col>
                </Row>
              </div>
            </Form>
          )}
        </Formik>
      </SignInToCompanyWrapper>
    </Modal>
  );
}
