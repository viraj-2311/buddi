import React, {createRef, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Field, Form, Formik} from 'formik';
import Button from '@iso/components/uielements/button';
import EditStyledModal from '../EditModal';
import MultiplyIcon from '@iso/components/icons/Multiply';
import validationSchema from './schema';
import ProfileTagAutocomplete from '../ProfileTagAutocomplete';
import { updateUserExpertiseRequest } from '@iso/redux/user/actions';

const tagFormattedAgencies = (agencies) => {
  if (!agencies) return [];
  return agencies.map(agency => ({id: agency, name: agency}));
};

const ADAgencyForm = ({visible, agencies, setModalData}) => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector(state => state.Auth);
  const { profile: {loading, error} } = useSelector(state => state.User);
  const [action, setAction] = useState('');
  const formData = {advertisingAgencies: agencies};
  const adAgencyRef = createRef();

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
    const agencyInput = adAgencyRef.current.state.query;
    if (agencyInput) {
      const exists = values.advertisingAgencies.find(a => a === agencyInput);
      if (!exists) {
        values.advertisingAgencies = [...values.advertisingAgencies, agencyInput];
        adAgencyRef.current.clearInput();
      }
    }
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
        <h3 className="title">Advertising Agencies</h3>
        <Button type="link" onClick={handleCancel}><MultiplyIcon width={18} height={18} fill="#eb5757" /></Button>
      </div>
      <div className="subtitle">Add Advertising Agencies you have worked for in the past.</div>

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
                <label>Advertising Agencies</label>
                <Field>
                  {() => (
                    <ProfileTagAutocomplete
                      ref={adAgencyRef}
                      tags={tagFormattedAgencies(values.advertisingAgencies)}
                      placeholder="Enter Advertising Agencies you have worked with in past"
                      onChange={(agencies) => {
                        const names = agencies.map(agency => agency.name);
                        setFieldValue('advertisingAgencies', names)
                      }}
                    />
                  )}
                </Field>
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

ADAgencyForm.defaultProps = {
  agencies: [],
};

export default ADAgencyForm;
