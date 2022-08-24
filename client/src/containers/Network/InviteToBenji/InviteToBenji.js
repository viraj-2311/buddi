import React, { createRef } from 'react';
import InviteToBenjiModal, {
  ActionWrapper,
  FooterWrapper,
} from './InviteToBenji.style';
import { Field, Form, Formik } from 'formik';
import Button from '@iso/components/uielements/button';
import { tagFormattedEmails } from '@iso/lib/helpers/utility';
import TagAutocomplete from '../TagAutocomplete';

export default ({ visible, confirm }) => {
  const handleConfirm = (values) => {
    confirm({ confirm: true });
  };

  const handleCancel = () => {
    // confirm({ cancel: true });
  };
  const emailRef = createRef();

  const formData = {
    emails: [
      'paulamorese@gmail.com',
      'pgraf321@gmail.com',
      'lihuasang777@outlook.com',
      'tiejun.zheng57@yandex.com',
      'wangway127@gmail.com',
    ],
  };

  return (
    <InviteToBenjiModal
      title='Invite to Buddi'
      visible={visible}
      width={758}
      footer={null}
    >
      <div className='content'>
        <Formik enableReinitialize initialValues={formData} onSubmit={() => {}}>
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <h3>Directly invite your email contacts to connect on Buddi</h3>
              <div className='formGroup'>
                <label>Enter email addresses here, separated by comma</label>
                <Field>
                  {() => (
                    <TagAutocomplete
                      ref={emailRef}
                      tags={tagFormattedEmails(values.emails)}
                      placeholder=''
                      onChange={(emails) => {
                        const names = emails.map((email) => email.name);
                        setFieldValue('emails', names);
                      }}
                    />
                  )}
                </Field>
              </div>
              <FooterWrapper>
                <p>More options</p>
                <ActionWrapper>
                  <Button htmlType='submit' type='primary' shape='round'>
                    Send
                  </Button>
                  <Button
                    htmlType='button'
                    shape='round'
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </ActionWrapper>
              </FooterWrapper>
            </Form>
          )}
        </Formik>
      </div>
    </InviteToBenjiModal>
  );
};
