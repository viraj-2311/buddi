import React from 'react';
import RequestClarificationWrapper from './RequestClarification.style';
import { Formik, Form, Field } from 'formik';
import Input from '@iso/components/uielements/input';
import InputField from '@iso/components/shared/InputField';
import Modal from '@iso/components/Modal';
import Button from '@iso/components/uielements/button';
import validationSchema from './schema';

const RequestClarification = ({ visible, setModalData }) => {
  const formData = {
    notes: ''
  };

  const handleCancel = () => {
    setModalData('close');
  };

  const handleSubmit = (values) => {

  };

  return (
    <Modal
      visible={visible}
      title="Request Clarification"
      footer={null}
      onCancel={handleCancel}
    >
      <RequestClarificationWrapper>
        <Formik
          enableReinitialize
          initialValues={formData}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form>
              <Field name="notes" component={InputField} multiline rows={3} />
              <div className="actions">
                <Button shape="round" type="primary" htmlType="submit">Send</Button>
              </div>
            </Form>
          )}
        </Formik>
      </RequestClarificationWrapper>
    </Modal>
  );
};

export default RequestClarification;
