import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import WalletCompanyRegister from './WalletCompanyRegister.style';
import { Row, Col } from 'antd';
import Select, { SelectOption } from '@iso/components/uielements/select';
import { Field, Form, Formik } from 'formik';
import basicStyle from '@iso/assets/styles/constants';
import { InputField } from '@iso/components';
import { Link, useHistory, useLocation } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import DateInput from '@iso/components/DateInput';
import Input from '@iso/components/uielements/input';
import LocationField from '@iso/components/LocationField';
import ZipCode from '@iso/components/shared/ZipCode';
import _ from 'lodash';
import Spin from '@iso/components/uielements/spin';
import schemaValidateRegisterWallet from './schemaCompany';
import {
  registerSilaCompany,
  updateSilaCompany,
  postCompanyRequestKYB,
  getCorporateSilaCompany,
} from '@iso/redux/company/actions';
import notify from '@iso/lib/helpers/notify';
import Button from '@iso/components/uielements/button';
import PopupRegisterSuccess from './PopupRegisterSuccess';
import { getCompanySilaKYB } from '@iso/redux/company/actions';

const { rowStyle, gutter } = basicStyle;
const Option = SelectOption;
export default forwardRef(
  ({ firstStepInfo, company, goToSecondStep, allowDisplayPopup }, ref) => {
    const dispatch = useDispatch();
    const formikRef = useRef(null);
    const { locations } = useSelector((state) => state.Location);
    const { companyWallet, silaKYB, silaCompany } = useSelector(
      (state) => state.Company
    );
    const [showPopupSuccess, displayPopupRegisterSuccess] = useState(false);
    const [allowRequestKYB, setAllowRequestKYB] = useState(false);
    const [loading, setLoading] = useState(false);
    const [displayUpdateMode, setDisplayUpdateMode] = useState(false);
    const [companyInfo, setCompanyInfo] = useState({});

    useEffect(() => {
      if (company) {
        let companyInfo = initData(company);
        setCompanyInfo(companyInfo);
        if (!silaKYB.silaKYB.id) {
          dispatch(getCorporateSilaCompany(company.id));
        }
      }
    }, []);

    useEffect(() => {
      if (
        company &&
        silaCompany &&
        silaCompany.companyInfo &&
        silaCompany.companyInfo.id &&
        !allowDisplayPopup
      ) {
        setDisplayUpdateMode(true);
        let companyInfo = silaCompany.companyInfo;
        let formData = {};
        formData.title = companyInfo.legalCompanyName || '';
        formData.address = companyInfo.businessAddress || '';
        formData.city = companyInfo.city || '';
        formData.state = companyInfo.state || '';
        formData.zipCode = companyInfo.zip || '';
        formData.phone = companyInfo.phoneNumber || '';
        formData.employerNumber = companyInfo.employerIdNumber || '';
        formData.email = companyInfo.businessEmail || '';
        formData.type = companyInfo.category || '';
        formData.businessType = companyInfo.businessType || '';
        setCompanyInfo(formData);
      }
    }, [silaCompany]);

    useEffect(() => {
      if (silaKYB.silaKYB.id && allowDisplayPopup) {
        setLoading(false);
        displayPopupRegisterSuccess(true);
      } else if (!silaKYB.loading && silaKYB.error) {
        setLoading(false);
        setAllowRequestKYB(false);
        if (silaKYB.error.error) {
          notify('error', silaKYB.error.error);
        } else {
          notify('error', JSON.stringify(silaKYB.error));
        }
      }
    }, [silaKYB]);

    useEffect(() => {
      if (
        !silaCompany.loading &&
        silaCompany.companyInfo &&
        !silaKYB.silaKYB.id &&
        allowRequestKYB
      ) {
        dispatch(postCompanyRequestKYB(company.id));
      } else if (!silaCompany.loading && silaCompany.error) {
        setAllowRequestKYB(false);
        setLoading(false);
        if (silaCompany.error.error) {
          notify('error', silaCompany.error.error);
        } else {
          notify('error', JSON.stringify(silaCompany.error));
        }
      }
    }, [silaCompany]);

    const initData = (company) => {
      var formData = {};
      formData.title = company.title || '';
      formData.address = company.address || '';
      formData.city = company.city || '';
      formData.state = company.state || '';
      formData.zipCode = company.zipCode || '';
      formData.phone = company.phone || '';
      formData.employerNumber = company.employerNumber || '';
      formData.email = company.email || '';
      return formData;
    };

    const handleRegisterWallet = (companyInfo) => {
      let data = {
        legal_company_name: companyInfo.title,
        city: companyInfo.city,
        state: companyInfo.state,
        zip: companyInfo.zipCode,
        employer_id_number: companyInfo.employerNumber,
        phone_number: companyInfo.phone,
        business_address: companyInfo.address,
        business_email: companyInfo.email,
        category: company.type,
        business_type: company.businessType,
      };
      const payload = _.cloneDeep(data);
      if (
        silaCompany.companyInfo &&
        silaCompany.companyInfo.id &&
        !allowRequestKYB
      ) {
        dispatch(updateSilaCompany({ id: company.id, payload: payload }));
        setAllowRequestKYB(true);
        setLoading(true);
      } else {
        dispatch(registerSilaCompany({ id: company.id, payload: payload }));
        setAllowRequestKYB(true);
        setLoading(true);
      }
    };

    useImperativeHandle(ref, () => ({
      getInfoRegister() {
        formikRef.current.handleSubmit();
      },
    }));

    const navigateToVerification = () => {
      setTimeout(() => {
        dispatch(getCompanySilaKYB(company.id));
      }, 1000);
      displayPopupRegisterSuccess(false);
      goToSecondStep(companyWallet.wallet);
    };

    return (
      <WalletCompanyRegister>
        <PopupRegisterSuccess
          visible={showPopupSuccess}
          action={navigateToVerification}
          title={'Success!'}
          description={
            'You are now registered. Please Click Next to verify your identity.'
          }
          titleButton={'Next'}
        />
        <Spin spinning={loading}>
          <div className='content'>
            <Formik
              innerRef={formikRef}
              enableReinitialize={true}
              initialValues={companyInfo}
              validationSchema={schemaValidateRegisterWallet}
              onSubmit={handleRegisterWallet}
            >
              {({ values, errors, touched, setFieldValue }) => (
                <Form>
                  <div>
                    <p className='register-title'>Business Information</p>
                    <span className='descRegister'>
                      We need to gather some information to see if this business
                      meets our guidelines.
                    </span>
                    <span className='descRegister'>
                      To register a new end-user as a business instead of an
                      individual, the following must be sent in the request:
                    </span>
                  </div>
                  <div className='content-view'>
                    <Row style={rowStyle} gutter={gutter} justify='start'>
                      <Col md={24} sm={24} xs={24}>
                        <span className='field-label required'>
                          Legal Band Name
                        </span>
                        <Field
                          component={InputField}
                          name='title'
                          type='text'
                        />
                      </Col>
                    </Row>
                    <Row style={rowStyle} gutter={gutter} justify='start'>
                      <Col md={24} sm={24} xs={24}>
                        <span className='field-label required'>
                          Business Address
                        </span>
                        <Field
                          component={InputField}
                          name='address'
                          type='text'
                        />
                      </Col>
                    </Row>
                    <Row style={rowStyle} gutter={gutter} justify='start'>
                      <Col md={8} sm={8} xs={24}>
                        <span className='field-label required'>City</span>
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
                      <Col md={8} sm={8} xs={24}>
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
                      <Col md={8} sm={8} xs={24}>
                        <span className='field-label required'>
                          Phone Number
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
                      <Col md={8} sm={8} xs={24}>
                        <span className='field-label required'>
                          Employer ID Number (EIN)
                        </span>
                        <Field
                          component={InputField}
                          name='employerNumber'
                          type='text'
                        />
                      </Col>
                      <Col md={8} sm={8} xs={24}>
                        <span className='field-label required'>
                          Business Email - Optional
                        </span>
                        <Field
                          component={InputField}
                          name='email'
                          type='text'
                        />
                      </Col>
                    </Row>
                    <Row style={rowStyle} gutter={gutter} justify='center'>
                      <Button
                        htmlType='submit'
                        type='primary'
                        shape='round'
                        className='buttonWrap'
                      >
                        {displayUpdateMode
                          ? 'Update Business'
                          : 'Register Business'}
                      </Button>
                    </Row>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Spin>
      </WalletCompanyRegister>
    );
  }
);
