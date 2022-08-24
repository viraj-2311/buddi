import React, {useEffect, useRef, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SaveTemplateModalWrapper from './SaveTemplate.style';
import { Field, Form, Formik } from 'formik';
import Button from '@iso/components/uielements/button';
import Modal from '@iso/components/Modal';
import InputField from '@iso/components/shared/InputField';
import { ProfileFilled } from '@ant-design/icons';
import { createCrewTemplateRequest } from '@iso/redux/producerJob/actions';
import validationSchema from './schema';
import notify from '@iso/lib/helpers/notify';


export default function ({visible, templates, setModalData}) {
  const dispatch = useDispatch();
  const { job, createTemplate } = useSelector(state => state.ProducerJob);
  const [action, setAction] = useState('');
  const formData = {name: ''};

  const handleCancel = () => {
    setModalData('close');
  };

  useEffect(() => {
    if (!createTemplate.loading && !createTemplate.error && action === 'save') {
      notify('success', 'Template created successfully')
      setModalData('close');
    }

    if (!createTemplate.loading && action === 'save') {
      setAction('');
    }
  }, [createTemplate]);


  const handleSubmit = (values) => {
    let payload = {...values};
    setAction('save');
    dispatch(createCrewTemplateRequest(job.id, payload));
  };

  return (
    <Modal
      visible={visible}
      title="Save as Template"
      width={950}
      bodyStyle={{padding: '40px 30px 35px'}}
      wrapClassName="hCentered"
      footer={null}
      onCancel={handleCancel}
    >
      <SaveTemplateModalWrapper>
        <Formik
          enableReinitialize
          initialValues={formData}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({values, touched, errors, setFieldValue}) => (
            <Form>
              <div className="topFieldWrapper">
                <div className="formGroup">
                  <label className="fieldLabel">Template Name</label>
                  <Field component={InputField} name="name" type="text" />
                </div>
              </div>
              <div className="divider" />
              <div className="bottomFieldWrapper">
                <h3 className="title">Templates</h3>
                <div className="templateList">
                  {templates.map(template => (
                    <div className="templateItem">
                      <ProfileFilled />
                      <span className="templateName">{template.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="actionBtnWrapper">
                <Button shape="round" onClick={handleCancel}>Cancel</Button>
                <Button
                  htmlType="submit"
                  type="primary"
                  shape="round"
                  className="wizardBtn"
                  loading={action === 'save'}
                >
                  Save
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </SaveTemplateModalWrapper>
    </Modal>
  );
}