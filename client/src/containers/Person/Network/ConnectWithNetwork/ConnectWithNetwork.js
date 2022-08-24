import React from 'react';
import ConnectWithNetworkModal, {
  FooterWrapper,
} from './ConnectWithNetwork.style';
import { Field, Form, Formik } from 'formik';
import Button from '@iso/components/uielements/button';
import { InputField } from '@iso/components';
import { Col, Row } from 'antd';

import AppleIcon from '@iso/assets/images/Apple-small.png';
import GmailIcon from '@iso/assets/images/Gmail-small.png';
import YahooIcon from '@iso/assets/images/Yahoo-small.png';
import OutlookIcon from '@iso/assets/images/Outlook-small.png';

import MailIcon from '@iso/components/icons/Mail';
import CloudIcon from '@iso/components/icons/Cloud';

export default ({ visible, handleCancel }) => {
  const formData = { productionCompanies: [] };

  return (
    <ConnectWithNetworkModal
      title='Connect with your Network on Buddi'
      visible={visible}
      width={758}
      onCancel={handleCancel}
      footer={null}
    >
      <div className="content">
        <Formik enableReinitialize initialValues={formData} onSubmit={() => {}}>
          {({ values, errors, touched, setFieldValue }) => (
            <Form className="connectForm">
              <h3>Connect with your contacts on Buddi</h3>
              <p>
                The fastest way to grow your network is to import your contacts
              </p>
              <div className="formGroup">
                <span className="fieldLabel required">Your Email Address</span>
                <Row>
                  <Col span={18}>
                    <Field
                      component={InputField}
                      name="email"
                      type="text"
                      onChange={(e) =>
                        setFieldValue(
                          'email',
                          e.target.value.replace(/\s/g, '')
                        )
                      }
                    />
                  </Col>
                  <Col span={6} className="continueBtn">
                    <Button type="primary" shape="round">
                      Continue
                    </Button>
                  </Col>
                </Row>
              </div>
              <FooterWrapper>
                <span>Or use one of these:</span>
                <div className="network-icons">
                  {/* <a href="#">
                    <img src={AppleIcon} alt="Apple" />
                  </a> */}
                  <a href="#">
                    <img src={GmailIcon} alt="Gmail" />
                  </a>
                  <a href="#">
                    <img src={YahooIcon} alt="Yahoo" />
                  </a>
                  <a href="#">
                    <img src={OutlookIcon} alt="Outlook" />
                  </a>
                  <a href="#" className="icon-box">
                    <MailIcon width={20} height={16} fill="#2f2e50" />
                  </a>
                  {/* <a href="#" className="icon-box">
                    <CloudIcon width={20} height={16} fill="#2f2e50" />
                  </a> */}
                </div>
              </FooterWrapper>
            </Form>
          )}
        </Formik>
      </div>
    </ConnectWithNetworkModal>
  );
};
