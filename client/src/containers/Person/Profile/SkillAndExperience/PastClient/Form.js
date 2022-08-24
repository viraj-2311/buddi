import React, {createRef, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Field, Form, Formik} from 'formik';
import Button from '@iso/components/uielements/button';
import EditStyledModal from '../EditModal';
import MultiplyIcon from '@iso/components/icons/Multiply';
import validationSchema from './schema';
import ProfileTagAutocomplete from '../ProfileTagAutocomplete';
import { updateUserExpertiseRequest } from '@iso/redux/user/actions';

const tagFormattedClients = (clients) => {
  if (!clients) return [];
  return clients.map(client => ({id: client, name: client}));
};

const ClientForm = ({visible, clients, setModalData}) => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector(state => state.Auth);
  const { profile: {loading, error} } = useSelector(state => state.User);
  const [action, setAction] = useState('');
  const formData = {pastClients: clients};
  const clientRef = createRef();

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
    const clientInput = clientRef.current.state.query;
    if (clientInput) {
      const exists = values.pastClients.find(c => c === clientInput);
      if (!exists) {
        values.pastClients = [...values.pastClients, clientInput];
        clientRef.current.clearInput();
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
        <h3 className="title">Past Clients</h3>
        <Button type="link" onClick={handleCancel}><MultiplyIcon width={18} height={18} fill="#eb5757" /></Button>
      </div>
      <div className="subtitle">Add the Clients you have worked for in the past.</div>

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
                <label>Clients</label>
                <Field>
                  {() => (
                    <ProfileTagAutocomplete
                      ref={clientRef}
                      tags={tagFormattedClients(values.pastClients)}
                      placeholder="Enter Clients you have worked with in past"
                      onChange={(clients) => {
                        const names = clients.map(client => client.name);
                        setFieldValue('pastClients', names);
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

ClientForm.defaultProps = {
  clients: [],
};

export default ClientForm;
