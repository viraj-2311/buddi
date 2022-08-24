import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Field, Form, Formik} from 'formik';
import { Textarea } from '@iso/components/uielements/input';
import Button from '@iso/components/uielements/button';
import EditStyledModal from '../EditModal';
import MultiplyIcon from '@iso/components/icons/Multiply';
import validationSchema from './schema';
import { updateUserExpertiseRequest } from '@iso/redux/user/actions';

const HeadlineForm = ({visible, headline, setModalData}) => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector(state => state.Auth);
  const { profile: {loading, error} } = useSelector(state => state.User);

  const [action, setAction] = useState('');

  useEffect(() => {
    if (!loading && !error && action === 'save') {
      setAction('');
      setModalData('close');
    }
  }, [loading, error]);

  const formData = {
    headline: headline
  };

  const handleCancel = () => {
    setModalData('close');
  };

  const handleSubmit = (values) => {
    setAction('save');
    dispatch(updateUserExpertiseRequest(authUser.id, values))
  };

  const countText = (text, maxLength) => {
    const count = text ? text.length : 0;
    return `${maxLength - count} Character(s) Left`;
  };

  return (
    <EditStyledModal
      visible={visible}
      closable={false}
      footer={null}
      width={630}
      maskClos
      onCancel={handleCancel}
    >
      <div className="header">
        <h3 className="title">Create Headline</h3>
        <Button type="link" onClick={handleCancel}><MultiplyIcon width={18} height={18} fill="#eb5757" /></Button>
      </div>
      <div className="content">
        <Formik
          enableReinitialize
          initialValues={formData}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({values, errors, touched, setFieldValue}) => (
            <Form>
              <div className="formGroup">
                <Field>
                  {() => (
                    <>
                      <Textarea
                        rows={6}
                        value={values.headline}
                        maxLength={140}
                        onChange={e => setFieldValue('headline', e.target.value)}
                      />
                      <div className="muted align-right">{countText(values.headline, 140)}</div>
                    </>
                  )}
                </Field>
                {touched.headline && errors.headline && (
                  <div className="helper-text">{errors.headline}</div>
                )}
              </div>
              <div className="actions">
                <Button onClick={handleCancel}>Cancel</Button>
                <Button type="primary" htmlType="submit">Save</Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </EditStyledModal>
  );
};

export default HeadlineForm;
