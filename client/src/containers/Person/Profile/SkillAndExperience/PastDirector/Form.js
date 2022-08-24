import React, {createRef, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Field, Form, Formik} from 'formik';
import Button from '@iso/components/uielements/button';
import EditStyledModal from '../EditModal';
import MultiplyIcon from '@iso/components/icons/Multiply';
import validationSchema from './schema';
import ProfileTagAutocomplete from '../ProfileTagAutocomplete';
import { updateUserExpertiseRequest } from '@iso/redux/user/actions';
import _ from 'lodash';

const tagFormattedDirectors = (directors) => {
  if (!directors) return [];
  return directors.map(director => ({id: director, name: director}));
};

const PastDirectorForm = ({visible, directorsGroup, setModalData}) => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector(state => state.Auth);
  const { profile: {loading, error} } = useSelector(state => state.User);
  const [action, setAction] = useState('');
  const formData = {...directorsGroup};
  const directorRef = createRef();
  const directorPhotographyRef = createRef();

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
    const directorInput = directorRef.current.state.query;
    const directorPhotographyInput = directorPhotographyRef.current.state.query;
    if (directorInput) {
      const exists = values.directors.find(d => d === directorInput);
      if (!exists) {
        values.directors = [...values.directors, directorInput];
        directorRef.current.clearInput();
      }
    }
    if (directorPhotographyInput) {
      const exists = values.directorsPhotography.find(dp => dp === directorPhotographyInput);
      if (!exists) {
        values.directorsPhotography = [...values.directorsPhotography, directorPhotographyInput];
        directorPhotographyRef.current.clearInput();
      }
    }
    setAction('save');
    const payload = _.cloneDeep({directors: values});
    dispatch(updateUserExpertiseRequest(authUser.id, payload));
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
        <h3 className="title">Directors Worked With</h3>
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
                <label>Directors</label>
                <Field>
                  {() => (
                    <ProfileTagAutocomplete
                      ref={directorRef}
                      tags={tagFormattedDirectors(values.directors)}
                      placeholder="Enter Directors you have worked with in past"
                      onChange={(directors) => {
                        const names = directors.map(director => director.name);
                        setFieldValue('directors', names);
                      }}
                    />
                  )}
                </Field>
              </div>
              <div className="formGroup">
                <label>Directors of Photography</label>
                <Field>
                  {() => (
                    <ProfileTagAutocomplete
                      ref={directorPhotographyRef}
                      tags={tagFormattedDirectors(values.directorsPhotography)}
                      placeholder="Enter Directors you have worked with in past"
                      onChange={(pDirectors) => {
                        const names = pDirectors.map(director => director.name);
                        setFieldValue('directorsPhotography', names);
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

PastDirectorForm.defaultProps = {
  directorsGroup: {
    directors: [],
    photographyDirectors: []
  }
};

export default PastDirectorForm;
