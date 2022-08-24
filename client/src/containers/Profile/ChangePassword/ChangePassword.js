import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Field, Form, Formik} from 'formik';
import { Row, Col } from 'antd';
import InputField from '@iso/components/shared/InputField/InputField';
import Button from '@iso/components/uielements/button';
import basicStyle from '@iso/assets/styles/constants';
import { changePasswordRequest } from '@iso/redux/user/actions';
import ErrorComponent from '@iso/components/ErrorComponent';
import schema from './schema';

const ChangePassword = ({user}) => {
  const {rowStyle, colStyle, gutter} = basicStyle;
  const dispatch = useDispatch();
  const { error: passwordError, loading } = useSelector(state => state.User.password);

  const passwordFields = {
    password: '',
    passwordHint: '',
    confirmPassword: ''
  };

  const handleChangePassword = (values) => {
    const payload = {
      ...values,
      email: user.email
    };
    dispatch(changePasswordRequest(payload))
  };

  return (
    <Formik
      initialValues={passwordFields}
      validationSchema={schema}
      onSubmit={handleChangePassword}
    >
    {({values, isSubmitting}) => (
      <Form>
        <Row style={rowStyle} gutter={gutter} justify="start">
          <Col md={12} xs={24}>
            <label className="fieldLabel required">Password</label>
            <Field
              component={InputField}
              name="password"
              type="password"
            />
          </Col>
          <Col md={12} xs={24}>
            <label className="fieldLabel required">Password Hint</label>
            <Field
              component={InputField}
              name="passwordHint"
              type="text"
            />
          </Col>
          <Col md={12} xs={24}>
            <label className="fieldLabel required">Re-Type Password</label>
            <Field
              component={InputField}
              name="confirmPassword"
              type="password"
            />
          </Col>
        </Row>
        <Row style={rowStyle} gutter={gutter} justify="start">
          <Col span={24}>
            {isSubmitting && passwordError && <ErrorComponent error={passwordError} />}
            <Button htmlType="submit" type="primary" loading={loading}>Save</Button>
            <Button style={{marginLeft: '10px'}}>Cancel</Button>
          </Col>
        </Row>
      </Form>
    )}
    </Formik>
  );
};

export default ChangePassword;
