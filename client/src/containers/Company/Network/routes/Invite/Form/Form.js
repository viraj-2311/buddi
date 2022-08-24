import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import CompanyNetworkInviteFormWrapper from './Form.style';
import {Col, Row} from 'antd';
import { Formik, Field, FieldArray, Form } from 'formik';
import { InputField } from '@iso/components';
import Button from '@iso/components/uielements/button';
import Multiply from '@iso/components/icons/Multiply';
import schema from './schema';
import { inviteCompanyNetworkUserRequest } from '@iso/redux/companyNetwork/actions';
import _ from 'lodash';

const CompanyNetworkInviteForm = () => {
  const dispatch = useDispatch();
  const { companyId } = useSelector(state => state.ProducerJob);
  const { loading, professionals } = useSelector(state => state.CompanyNetwork.invite);

  const formData = {
    professionals: [{fullName: '', email: ''}]
  };

  const handleInvitePerson = (values) => {
    const payload = _.cloneDeep((values));
    dispatch(inviteCompanyNetworkUserRequest(companyId, payload));
  };

  const ServerMessage = ({professional, messages}) => {
    return (
      messages.map((message) => {
        if (professional.email !== message.email) return;

        if (message.error) {
          return (<div className="server-message error">{message.error}</div>);
        } else {
          return (<div className="server-message success">{message.success}</div>);
        }
      })
    );
  };

  return (
    <CompanyNetworkInviteFormWrapper>
      <div className="formHeader">
        <h3 className="title">Invite <strong>Professionals</strong></h3>
        <p className="subTitle">Send invites to join your private network.</p>
      </div>
      <Formik
        enableReinitialize
        initialValues={formData}
        validationSchema={schema}
        onSubmit={handleInvitePerson}
      >
        { ({values, isSubmitting}) => (
          <Form>
            <FieldArray
              name="professionals"
            >
              {(arrayHelpers) => (
                <>
                  { values.professionals.map((professional, index) => (
                    <div key={`professional-${index}`}>
                      <Row gutter={[15, 0]} align="top" justify="space-between" key={index}>
                        <Col flex="auto">
                          <div className="formGroup">
                            <label className="fieldLabel required">Full Name</label>
                            <Field
                              component={InputField}
                              name={`professionals[${index}].fullName`}
                              type="text"
                            />
                          </div>
                        </Col>
                        <Col flex="auto">
                          <div className="formGroup">
                            <label className="fieldLabel required">Email</label>
                            <Field
                              component={InputField}
                              name={`professionals[${index}].email`}
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
                      { isSubmitting && <ServerMessage messages={professionals} professional={professional} />}
                    </div>
                  ))}
                  <Button type="link" onClick={() => arrayHelpers.push({fullName: '', email: ''})}>Add another</Button>
                </>
              )}
            </FieldArray>

            <Row justify="start" style={{marginTop: '15px'}}>
              <Col span={24}>
                <Button htmlType="submit" type="primary" loading={loading} block>Send Invite</Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </CompanyNetworkInviteFormWrapper>
  )
};

export default CompanyNetworkInviteForm;
