import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Field, Form, Formik} from 'formik';
import { Row, Col } from 'antd';
import Select, { SelectOption } from '@iso/components/uielements/select';
import InputField from '@iso/components/shared/InputField';
import Button from '@iso/components/uielements/button';
import EditStyledModal from '../EditModal';
import MultiplyIcon from '@iso/components/icons/Multiply';
import { updateUserExpertiseRequest } from '@iso/redux/user/actions';
import validationSchema from './schema';
import _ from 'lodash';

const Option = SelectOption;
const YEARS = () => {
  const currentYear = (new Date()).getFullYear();
  return _.range(currentYear, 1990, -1);
};

const EducationForm = ({visible, educations, education, setModalData}) => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector(state => state.Auth);
  const { profile: {loading, error} } = useSelector(state => state.User);

  const [action, setAction] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!education) {
      setFormData({});
      return
    }

    if (education && education.id) {
      setFormData({...education});
    } else {
      setFormData({
        university: '',
        degree: '',
        studyField: '',
        startYear: null,
        endYear: null
      });
    }
  }, [education]);

  const isEdit = useMemo(() => {
    return education && education.id
  }, [education]);

  useEffect(() => {
    if (!loading && !error && action === 'save') {
      setModalData('close');
      setAction('');
    }
  }, [loading, error]);

  const handleCancel = () => {
    setModalData('close');
  };

  const handleEducationDelete = () => {
    const educationId = education.id;
    const newEducations = educations.filter(education => education.id !== educationId);
    setAction('save');
    const payload = _.cloneDeep({educations: newEducations});
    dispatch(updateUserExpertiseRequest(authUser.id, payload));
  };

  const handleSubmit = (values) => {
    setAction('save');
    let newEducations = [];
    if (values.id) {
      newEducations = educations.map(education => education.id === values.id ? values : education)
    } else {
      newEducations = [...educations, values]
    }
    const payload = _.cloneDeep({educations: newEducations});
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
        <h3 className="title">Education</h3>
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
                <label className="formLabel required">School/University</label>
                <Field name="university" type="text" component={InputField}></Field>
              </div>
              <div className="formGroup">
                <label className="formLabel required">Degree</label>
                <Field name="degree" type="text" component={InputField}></Field>
              </div>
              <div className="formGroup">
                <label className="formLabel required">Field of study</label>
                <Field name="studyField" type="text" component={InputField}></Field>
              </div>
              <div className="formGroup">
                <Row gutter={20}>
                  <Col span={12}>
                    <label className="formLabel required">Start Year</label>
                    <Select
                      style={{width: '100%'}}
                      value={values.startYear}
                      placeholder="Year"
                      onChange={value => setFieldValue('startYear', value)}
                    >
                      {YEARS().map(year => (
                        <Option value={year} key={`start-${year}`}>{year}</Option>
                      ))}
                    </Select>
                    {touched.startYear && errors.startYear && (
                      <div className="helper-text">{errors.startYear}</div>
                    )}
                  </Col>
                  <Col span={12}>
                    <label className="formLabel required">End Year (or expected)</label>
                    <Select
                      style={{width: '100%'}}
                      value={values.endYear}
                      placeholder="Year"
                      onChange={value => setFieldValue('endYear', value)}
                    >
                      {YEARS().map(year => (
                        <Option value={year} key={`end-${year}`}>{year}</Option>
                      ))}
                    </Select>
                    {touched.endYear && errors.endYear && (
                      <div className="helper-text">{errors.endYear}</div>
                    )}
                  </Col>
                </Row>
              </div>
              <div className="actions">
                {isEdit && <Button onClick={handleEducationDelete} type="danger" style={{float: 'left', marginLeft: 0}}>Delete</Button>}
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

export default EducationForm;
