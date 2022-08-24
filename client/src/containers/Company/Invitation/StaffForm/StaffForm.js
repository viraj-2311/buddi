import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Row, Col } from 'antd';
import { Formik, Field, FieldArray, Form } from 'formik';
import { InputField } from '@iso/components';
import Select, { SelectOption } from '@iso/components/uielements/select';
import Button from '@iso/components/uielements/button';
import Multiply from '@iso/components/icons/Multiply';
import schema from './schema';
import { inviteStaffRequest, fetchUserCompaniesRequest } from '@iso/redux/user/actions';
import StaffInvitationFormWrapper from './StaffForm.style';

const Option = SelectOption;

const StaffInvitationForm = ({company, staffs, onSubmit, cancelButton}) => {
  const dispatch = useDispatch();
  const {user: authUser} = useSelector(state => state.Auth);
  const { loading, invitees } = useSelector(state => state.User.invite);
  const { companies } = useSelector(state => state.User.company);
  const formData = {
    companyId: company ? company : '',
    staffs
  };

  useEffect(() => {
    dispatch(fetchUserCompaniesRequest(authUser.id));
  }, [authUser]);

  const ServerMessage = ({staff, messages}) => {
    return (
      messages.map((message) => {
        if (staff.email !== message.email) return;

        if (message.error) {
          return (<div className="server-message error">{message.error}</div>);
        } else {
          return (<div className="server-message success">{message.success}</div>);
        }
      })
    );
  };

  const handleInviteProducer = (values) => {
    dispatch(inviteStaffRequest(values));
    onSubmit();
  };

  return (
    <StaffInvitationFormWrapper>
      <Formik
        enableReinitialize
        initialValues={formData}
        validationSchema={schema}
        onSubmit={handleInviteProducer}
      >
        { ({values, touched, errors, setFieldValue, isSubmitting}) => (
          <Form>
            {!company && (
              <Row gutter={[15, 0]}>
                <Col flex="auto">
                  <div className="formGroup">
                    <label className="fieldLabel required">Production Company</label>
                    <Field>
                      {() => (
                        <Select
                          showSearch
                          style={{width: '100%'}}
                          value={values.companyId}
                          onChange={(value) => setFieldValue('companyId', value)}
                        >
                          {companies && companies.map(company => (
                            <Option key={company.id} value={company.id}>{company.title}</Option>
                          ))}
                        </Select>
                      )}
                    </Field>
                    {touched.companyId && errors.companyId && (
                      <div className="helper-text">{errors.companyId}</div>
                    )}
                  </div>
                </Col>
                <Col flex="30px"></Col>
              </Row>
            )}

            <FieldArray
              name="staffs"
            >
              {(arrayHelpers) => (
                <>
                  { values.staffs.map((staff, index) => (
                    <div>
                      <Row gutter={[15, 0]} align="top" justify="space-between" key={index}>
                        <Col flex="auto">
                          <div className="formGroup">
                            <label className="fieldLabel required">Full Name</label>
                            <Field
                              component={InputField}
                              name={`staffs[${index}].fullName`}
                              type="text"
                            />
                          </div>
                        </Col>
                        <Col flex="auto">
                          <div className="formGroup">
                            <label className="fieldLabel required">Email</label>
                            <Field
                              component={InputField}
                              name={`staffs[${index}].email`}
                              type="text"
                            />
                          </div>
                        </Col>
                        <Col flex="30px">
                          <label>&nbsp;</label>
                          {index > 0 && (
                            <Button type="link" onClick={() => arrayHelpers.remove(index)} style={{marginTop: '10px'}}>
                              <Multiply width={16} height={16} fill="#bdbdbd"/>
                            </Button>
                          )}
                        </Col>
                      </Row>
                      { isSubmitting && <ServerMessage messages={invitees} staff={staff} />}
                    </div>
                  ))}
                  <Button type="link" onClick={() => arrayHelpers.push({fullName: '', email: ''})}>Add More Staff</Button>
                </>
              )}
            </FieldArray>

            <Row justify="start" style={{marginTop: '15px'}}>
              <Col md={12} sm={12} xs={24}>
                <Button htmlType="submit" type="primary" loading={loading}>Send Invite</Button>
                {cancelButton}
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </StaffInvitationFormWrapper>
  )
};

StaffInvitationForm.defaultProps = {
  staffs: [{fullName: '', email: ''}]
};

export default StaffInvitationForm;
