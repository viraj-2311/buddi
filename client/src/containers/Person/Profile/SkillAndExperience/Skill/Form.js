import React, {createRef, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Field, Form, Formik} from 'formik';
import Button from '@iso/components/uielements/button';
import EditStyledModal from '../EditModal';
import MultiplyIcon from '@iso/components/icons/Multiply';
import validationSchema from './schema';
import ProfileTagAutocomplete from '../ProfileTagAutocomplete';
import { fetchUserSkillsRequest, updateUserExpertiseRequest } from '@iso/redux/user/actions';
import _ from 'lodash';

const tagFormattedSkills = (skills) => {
  if (!skills) return [];
  return skills.map(skill => ({id: skill, name: skill}));
};

const SkillForm = ({visible, skills, setModalData}) => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector(state => state.Auth);
  const { profile: {loading, error}, skills: suggestionSkills } = useSelector(state => state.User);
  const [action, setAction] = useState('');
  const formData = {...skills};
  const primaryRef = createRef();
  const secondaryRef = createRef();

  useEffect(() => {
    if (visible) {
      dispatch(fetchUserSkillsRequest());
    }
  }, [visible]);

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
    const primaryInput = primaryRef.current.state.query;
    const secondaryInput = secondaryRef.current.state.query;
    if (primaryInput) {
      const exists = values.primarySkills.find(ps => ps === primaryInput);
      if (!exists) {
        values.primarySkills = [...values.primarySkills, primaryInput];
        primaryRef.current.clearInput();
      }
    }
    if (secondaryInput) {
      const exists = values.secondarySkills.find(sk => sk === secondaryInput);
      if (!exists) {
        values.secondarySkills = [...values.secondarySkills, secondaryInput];
        secondaryRef.current.clearInput();
      }
    }
    setAction('save');
    const payload = _.cloneDeep({skills: values});
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
        <h3 className="title">Skills</h3>
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
                <label>Primary Skills</label>
                <Field>
                  {() => (
                    <>
                      <ProfileTagAutocomplete
                        ref={primaryRef}
                        tags={tagFormattedSkills(values.primarySkills)}
                        suggestions={tagFormattedSkills(suggestionSkills)}
                        placeholder="Enter your area of Expertise/Specialization"
                        maxLength={3}
                        onChange={(skills) => {
                          const names = skills.map(skill => skill.name);
                          setFieldValue('primarySkills', names)
                        }}
                      />
                      <div className="muted align-right">Maximum 3 skills</div>
                    </>
                  )}
                </Field>
                {touched.primary && errors.primary && (
                  <div className="helper-text">{errors.primary}</div>
                )}
              </div>
              <div className="formGroup">
                <label>Secondary Skills</label>
                <Field>
                  {() => (
                    <>
                      <ProfileTagAutocomplete
                        ref={secondaryRef}
                        tags={tagFormattedSkills(values.secondarySkills)}
                        suggestions={tagFormattedSkills(suggestionSkills)}
                        placeholder="Enter your area of Expertise/Specialization"
                        maxLength={15}
                        onChange={(skills) => {
                          const names = skills.map(skill => skill.name);
                          setFieldValue('secondarySkills', names)
                        }}
                      />
                      <div className="muted align-right">Maximum 15 skills</div>
                    </>
                  )}
                </Field>
                {touched.secondary && errors.secondary && (
                  <div className="helper-text">{errors.secondary}</div>
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

SkillForm.defaultProps = {
  skills: {
    primarySkills: [],
    secondarySkills: []
  }
};

export default SkillForm;
