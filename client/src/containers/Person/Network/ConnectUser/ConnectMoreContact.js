import React, { createRef, useRef } from 'react';
import ConnectUserModal, {
  ActionWrapper,
  FooterWrapper,
  InputView,
  StylesLayout,
} from './ConnectUser.style';
import { Field, Form, Formik } from 'formik';
import Button from '@iso/components/uielements/button';
import TagAutoComplete from '@iso/components/TagAutoComplete';
import GmailIcon from '@iso/assets/images/Gmail-small.png';
import YahooIcon from '@iso/assets/images/Yahoo-small.png';
import OutlookIcon from '@iso/assets/images/Outlook-small.png';
import MailIcon from '@iso/components/icons/Mail';
import CSVUpload from '@iso/components/CSVUpload';
import { isValidEmail, tagFormattedEmails } from '@iso/lib/helpers/utility';

export default ({ visible, confirm, handleCancel, handleInvitePerson }) => {
  const emailRef = createRef();
  const formikRef = useRef();

  const formData = {
    emails: [],
  };
  const handleConfirm = (values) => {
    confirm({ confirm: true });
  };

  const onKeyDown = (keyEvent) => {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  };

  const handleFormSubmit = (e) => {
    const latestQuery = emailRef.current.input.current.props.query;
    handleInvitePerson(formData.emails, latestQuery);
    formData.emails = [];
    formikRef.current.resetForm();
  };

  return (
    <ConnectUserModal
      title='Connect with your Network on Buddi'
      visible={visible}
      width={700}
      footer={null}
      onCancel={handleCancel}
    >
      <div className='content'>
        <Formik
          innerRef={formikRef}
          enableReinitialize={true}
          initialValues={formData}
          onSubmit={handleFormSubmit}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form onKeyDown={onKeyDown}>
              <h3>Directly invite your email contacts to connect on Buddi</h3>
              <div className='formGroup'>
                <p className='descNetwork'>
                  The fastest way to grow your network is to import your
                  contacts
                </p>
                <label>Enter email addresses here, separated by comma</label>
                <InputView>
                  <div className='inputEmail'>
                    <Field>
                      {() => (
                        <TagAutoComplete
                          ref={emailRef}
                          tags={tagFormattedEmails(values.emails)}
                          placeholder=''
                          onChange={(emails) => {
                            const validEmails = emails.filter(
                              (email) => email && isValidEmail(email.name)
                            );
                            const names = validEmails.map(
                              (email) => email.name
                            );
                            formData.emails = names;
                            setFieldValue('emails', names);
                          }}
                        />
                      )}
                    </Field>
                  </div>
                  <div className='viewButton'>
                    <Button
                      htmlType='submit'
                      type='primary'
                      shape='round'
                      className='continueBtn'
                    >
                      Continue
                    </Button>
                  </div>
                </InputView>
              </div>
              <FooterWrapper className='more-user'>
                <span>Or use one of these:</span>
                <div className='network-icons'>
                  {/* <a href="#">
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
                  </a> */}
                  <CSVUpload
                    onChange={(emails) => {
                      formData.emails = emails;
                      setFieldValue('emails', emails);
                    }}
                  />
                </div>
              </FooterWrapper>
            </Form>
          )}
        </Formik>
      </div>
    </ConnectUserModal>
  );
};
