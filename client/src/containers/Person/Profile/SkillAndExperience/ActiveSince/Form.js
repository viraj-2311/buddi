import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Field, Form, Formik} from 'formik';
import Select, { SelectOption } from '@iso/components/uielements/select';
import Button from '@iso/components/uielements/button';
import { Row, Col } from 'antd';
import EditStyledModal from '../EditModal';
import MultiplyIcon from '@iso/components/icons/Multiply';
import { updateUserExpertiseRequest } from '@iso/redux/user/actions';
import validationSchema from './schema';
import _ from 'lodash'

const Option = SelectOption;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const YEARS = () => {
  const currentYear = (new Date()).getFullYear();
  return _.range(currentYear, 1990, -1);
};

const ActiveSinceForm = ({visible, year, month, setModalData}) => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector(state => state.Auth);
  const { profile: {loading, error} } = useSelector(state => state.User);
  const [action, setAction] = useState('');

  const formData = {
    year: year,
    month: month
  };

  useEffect(() => {
    if (!loading && !error && action === 'save') {
      setAction('');
      setModalData('close');
    }
  }, [loading, error]);

  const handleCancel = () => {
    setModalData('close');
  };

  const handleSubmit = (values) => {
    setAction('save');
    const payload = {
      activeSince: values
    };
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
        <h3 className="title">Active Since</h3>
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
                <label>First Paid Gig:</label>
                <Row gutter={20}>
                  <Col span={12}>
                    <Field>
                      {() => (
                        <Select
                          style={{width: '100%'}}
                          placeholder="Year"
                          value={values.year}
                          onChange={(value) => setFieldValue('year', value)}
                        >
                          {YEARS().map(year => (
                            <Option value={year} key={`year-${year}`}>{year}</Option>
                          ))}
                        </Select>
                      )}
                    </Field>
                    {touched.year && errors.year && (
                      <div className="helper-text">{errors.year}</div>
                    )}
                  </Col>
                  <Col span={12}>
                    <Field>
                      {() => (
                        <Select
                          style={{width: '100%'}}
                          placeholder="Month"
                          value={values.month}
                          onChange={(value) => setFieldValue('month', value)}
                        >
                          {MONTHS.map((month, index) => (
                            <Option value={index + 1} key={`month-${index + 1}`}>{month}</Option>
                          ))}
                        </Select>
                      )}
                    </Field>
                    {touched.month && errors.month && (
                      <div className="helper-text">{errors.month}</div>
                    )}
                  </Col>
                </Row>
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

export default ActiveSinceForm;
