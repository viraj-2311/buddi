import React, { createRef } from 'react';
import ConnectUserModal, {
  ActionWrapper,
  FooterWrapper,
} from './ConnectUser.style';
import { Field, Form, Formik } from 'formik';
import Button from '@iso/components/uielements/button';
import TagAutoComplete from '@iso/components/TagAutoComplete';
import {
  generateInvitationList,
  isValidEmail,
  tagFormattedEmails,
} from '@iso/lib/helpers/utility';

export default ({
  visible,
  confirm,
  handleCancel,
  showPopupMoreConnect,
  handleInvitePerson,
}) => {
  const handleConfirm = (values) => {
    confirm({ confirm: true });
  };

  const emailRef = createRef();

  const formData = {
    emails: [],
  };

  const onKeyDown = (keyEvent) => {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  };

  const handleFormSubmit = () => {
    const latestQuery = emailRef.current.input.current.props.query;
    handleInvitePerson(formData.emails, latestQuery);
    formData.emails = [];
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
          enableReinitialize={true}
          initialValues={formData}
          onSubmit={handleFormSubmit}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form onKeyDown={onKeyDown}>
              <h3>Directly invite your email contacts to connect on Buddi</h3>
              <div className='formGroup'>
                <label>Enter email addresses here, separated by comma</label>
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
                        const names = validEmails.map((email) => email.name);
                        formData.emails = names;
                        setFieldValue('emails', names);
                      }}
                    />
                  )}
                </Field>
              </div>
              <FooterWrapper>
                <Button
                  onClick={() => showPopupMoreConnect()}
                  type='link'
                  className='titleButton'
                >
                  More options
                </Button>
                <ActionWrapper>
                  <Button
                    htmlType='submit'
                    type='primary'
                    shape='round'
                    className='buttonWrap'
                  >
                    Send
                  </Button>
                  <Button
                    htmlType='button'
                    shape='round'
                    onClick={() => handleCancel()}
                    className='buttonWrap'
                  >
                    Cancel
                  </Button>
                </ActionWrapper>
              </FooterWrapper>
            </Form>
          )}
        </Formik>
      </div>
    </ConnectUserModal>
  );
};
