import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import { Card, Col, Row } from 'antd';
import InputField from '@iso/components/InputField';
import Button from '@iso/components/uielements/button';
import TextArea from 'antd/lib/input/TextArea';
import PhoneIcon from '@iso/components/icons/Phone';
import MailIcon from '@iso/components/icons/Mail';
import { HelpFormValidation } from './schema';
import LocationIcon from '@iso/components/icons/Location';
import HelpChatIcon from '@iso/components/icons/HelpChat';
import { HelpWrapper, HelpFormWrapper, HelpDetailWrapper } from './Help.style';
import { sendNeedHelp } from '@iso/redux/wallet/actions';
import notify from '@iso/lib/helpers/notify';

const HelpComponent = () => {
  const dispatch = useDispatch();
  const { needHelp } = useSelector((state) => state.Wallet);
  const { companyId } = useSelector((state) => state.AccountBoard);
  const [loading, setLoading] = useState(false);
  const helpFormFields = {
    subject: '',
    helpMessage: '',
  };
  const iconFileColor = '#fff';
  const formikRef = useRef();

  useEffect(() => {
    if (!needHelp.loading && needHelp.success) {
      setLoading(false);
      notify(
        'success',
        'Thank you for your submission, a representative from our team will review your message and reach out shortly.'
      );
    } else if (!needHelp.loading && needHelp.error) {
      setLoading(false);
      notify('error', `Sorry, we can't send your request at this moment`);
    }
  }, [needHelp]);

  const handleSubmit = (data) => {
    setLoading(true);
    const payload = {
      subject: data.subject,
      message: data.helpMessage,
    };
    if (companyId) {
      payload.companyId = companyId;
    }
    dispatch(sendNeedHelp(payload));
  };

  const HelpForm = ({ values, touched, errors, setFieldValue }) => {
    return (
      <Row>
        <Col sm={24} md={24} lg={12}>
          <HelpFormWrapper>
            <Card className='helpForm'>
              <Form>
                <div className='helpFormTitle'>
                  <HelpChatIcon width={25} height={29} fill={'#3b86ff'} />
                  <h2>How can we help you?</h2>
                </div>
                <p>Our team will get back to you within 24 hours.</p>
                <Row>
                  <Col span={24}>
                    <div className='formGroup'>
                      <label className='fieldLabel'>Subject</label>
                      <Field component={InputField} name='subject' />
                    </div>
                  </Col>

                  <Col span={24}>
                    <div className='formGroup'>
                      <label className='fieldLabel'>Message</label>
                      <Row>
                        <Col span={24}>
                          <Field>
                            {() => (
                              <TextArea
                                rows={5}
                                className='disableResize'
                                value={values.helpMessage}
                                onChange={(e) => {
                                  setFieldValue('helpMessage', e.target.value);
                                }}
                              />
                            )}
                          </Field>
                          {touched.helpMessage && errors.helpMessage && (
                            <div className='helper-text'>
                              {errors.helpMessage}
                            </div>
                          )}
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
                <Row className='actionRow'>
                  <Col span={24}>
                     <Button
                      htmlType='submit'
                      type='primary'
                      shape='round'
                      loading={loading}
                    >
                      Send Message
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          </HelpFormWrapper>
        </Col>
        <Col sm={24} md={24} lg={12}>
          <HelpDetailWrapper>
            <Card className='helpDetail'>
              <div className='title'>
                <h2>Contact Information</h2>
              </div>
              <div className='contactInformationList'>
                <div className='contactInformation'>
                  <div className='contactIcon'>
                    <MailIcon width={20} height={16} fill={iconFileColor} />
                  </div>
                  <div className='contactInformationInfo'>
                    <p>support@buddipro.com</p>
                  </div>
                </div>
              </div>
            </Card>
          </HelpDetailWrapper>
        </Col>
      </Row>
    );
  };

  return (
    <HelpWrapper>
      <Formik
        innerRef={formikRef}
        initialValues={helpFormFields}
        validationSchema={HelpFormValidation}
        component={HelpForm}
        onSubmit={handleSubmit}
      ></Formik>
    </HelpWrapper>
  );
};

export default HelpComponent;
