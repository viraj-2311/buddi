import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import WalletCompanyBussinessType from './WalletCompanyBussinessType.style';
import { Row, Col } from 'antd';
import Select, { SelectOption } from '@iso/components/uielements/select';
import { Field, Form, Formik } from 'formik';
import Button from '@iso/components/uielements/button';
import basicStyle from '@iso/assets/styles/constants';
import { InputField } from '@iso/components';
import CheckIcon from '@iso/components/icons/Check';

const { rowStyle, gutter } = basicStyle;
const Option = SelectOption;
export default forwardRef(
  ({ company, companyTypeList, businessTypeList, goToNextStep }, ref) => {
    const formikRef = useRef(null);
    const formData = {
      type: company.type,
      businessType: company.businessType,
      company: company,
      companyTypeList: companyTypeList,
      businessTypeList: businessTypeList,
    };

    if (formData.company && !formData.company.type) {
      formData.company.type = '';
    }

    if (formData.company && !formData.company.businessType) {
      formData.company.businessType = '';
    }

    const handleRegisterWallet = (companyInfo) => {
      let dataUpdate = {
        businessType: companyInfo.businessType,
        type: companyInfo.type,
      };
      goToNextStep(dataUpdate);
    };

    useImperativeHandle(ref, () => ({
      getInfoBusinessType() {
        formikRef.current.handleSubmit();
      },
    }));

    return (
      <WalletCompanyBussinessType>
        <div className='content'>
          <Formik
            innerRef={formikRef}
            enableReinitialize
            initialValues={formData}
            onSubmit={handleRegisterWallet}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <Form>
                <div>
                  <p className='register-title'>Business Type and Category</p>
                  <span className='descRegister'>
                    Please choose your business type and category. This will
                    determine the information we need to collect from you moving
                    forward.
                  </span>
                </div>
                <div className='content-view'>
                  <Row style={rowStyle} gutter={gutter} justify='start'>
                    <Col md={24} sm={24} xs={24}>
                      <span className='field-label required'>
                        Business Type
                      </span>
                      <Select
                        style={{ width: '100%' }}
                        name='businessType'
                        value={values.businessType}
                        onChange={(value) =>
                          setFieldValue('businessType', value)
                        }
                      >
                        {values.businessTypeList.map((bt) => (
                          <Option
                            value={bt.businessTypeValue}
                            key={bt.businessTypeValue}
                          >
                            {bt.businessTypeName}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                  </Row>
                  {/* <Row style={rowStyle} gutter={gutter} justify='start'>
                    <Col md={24} sm={24} xs={24}>
                      <span className='field-label required'>
                        NAICS Category
                      </span>
                      <Select
                        style={{ width: '100%' }}
                        name='type'
                        value={values.type}
                        onChange={(value) => setFieldValue('type', value)}
                      >
                        {values.companyTypeList.map((ct) => (
                          <Option
                            value={ct.companyTypeValue}
                            key={ct.companyTypeValue}
                          >
                            {ct.companyTypeName}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                  </Row>
                  <Row style={rowStyle} gutter={gutter} justify='start'>
                    <Col md={24} sm={24} xs={24}>
                      <span className='field-label required'>
                        NAICS Sub-Category
                      </span>
                      <Select
                        style={{ width: '100%' }}
                        name='sub-type'
                        value={values.type}
                        onChange={(value) => setFieldValue('sub-type', value)}
                      >
                        {values.companyTypeList.map((ct) => (
                          <Option
                            value={ct.companyTypeValue}
                            key={ct.companyTypeValue}
                          >
                            {ct.companyTypeName}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                  </Row> */}
                  <Row style={rowStyle} gutter={gutter} justify='center'>
                    <Button
                      htmlType='submit'
                      type='primary'
                      shape='round'
                      className='buttonWrap'
                    >
                      Next
                    </Button>
                  </Row>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </WalletCompanyBussinessType>
    );
  }
);
