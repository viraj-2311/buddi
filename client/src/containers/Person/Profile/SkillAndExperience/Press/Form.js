import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Field, Form, Formik, FieldArray} from 'formik';
import InputField from '@iso/components/shared/InputField';
import Button from '@iso/components/uielements/button';
import PressFormWrapper from './Form.style';
import EditStyledModal from '../EditModal';
import MultiplyIcon from '@iso/components/icons/Multiply';
import { updateUserExpertiseRequest } from '@iso/redux/user/actions';
import validationSchema from './schema';

const PressForm = ({visible, presses, setModalData}) => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector(state => state.Auth);
  const { profile: {loading, error} } = useSelector(state => state.User);
  const [action, setAction] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (presses.length) {
      setFormData({presses: presses});
    } else {
      setFormData({presses: ['']});
    }
  }, [presses]);

  useEffect(() => {
    if (!loading && !error && action === 'save') {
      setModalData('close');
      setAction('');
    }
  }, [loading, error]);

  const handleCancel = () => {
    setModalData('close');
  };

  const handleSubmit = (values) => {
    setAction('save');
    dispatch(updateUserExpertiseRequest(authUser.id, values));
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
        <h3 className="title">Press</h3>
        <Button type="link" onClick={handleCancel}><MultiplyIcon width={18} height={18} fill="#eb5757" /></Button>
      </div>
      <div className="content">
        <PressFormWrapper>
          <Formik
            enableReinitialize
            initialValues={formData}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({values, errors, touched, setFieldValue}) => (
              <Form>
                <FieldArray
                  name="presses"
                >
                  {(arrayHelpers) => (
                    <>
                      { values.presses.map((press, index) => (
                        <div className="pressFieldWrapper">
                          <div className="pressLink">
                            <Field name={`presses[${index}]`} type="text" component={InputField} />
                          </div>

                          <Button type="link" onClick={() => arrayHelpers.remove(index)}>
                            <MultiplyIcon width={16} height={16} fill="#bdbdbd"/>
                          </Button>
                        </div>
                      ))}
                      <Button type="link" onClick={() => arrayHelpers.push('')}>Add Link</Button>
                    </>
                  )}
                </FieldArray>
                <div className="actions">
                  <Button onClick={handleCancel}>Cancel</Button>
                  <Button type="primary" htmlType="submit">Save</Button>
                </div>
              </Form>
            )}
          </Formik>
        </PressFormWrapper>
      </div>
    </EditStyledModal>
  );
};

PressForm.defaultProps = {
  presses: []
};

export default PressForm;
