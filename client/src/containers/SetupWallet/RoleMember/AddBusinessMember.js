import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import { Row, Col } from 'antd';
import basicStyle from '@iso/assets/styles/constants';
import { InputField } from '@iso/components';
import AddBusinessMemberWrapper from './AddBusinessMember.style';
import Button from '@iso/components/uielements/button';
import validationSchema from './schemaAddRoleMember';
import { ListRoleMembers } from '@iso/enums/wallet_status';
import Select, { SelectOption } from '@iso/components/uielements/select';
const Option = SelectOption;
const { rowStyle, gutter } = basicStyle;

const AddBusinessMember = ({
  hasEditMember,
  onClose,
  addNewMember,
  updateMember,
  dataMember,
}) => {
  const { roleMember } = useSelector((state) => state.User);
  const [loading, setLoading] = useState(false);
  const formikRef = useRef();
  const formData = {
    role: hasEditMember ? dataMember.role : ListRoleMembers[0].value,
    fullName: hasEditMember ? dataMember.title : '',
    email: hasEditMember ? dataMember.sila_user.email : '',
    id: hasEditMember ? dataMember.id : '',
  };

  const handleMember = (data) => {
    setLoading(true);
    if (hasEditMember) {
      updateMember(data);
    } else {
      addNewMember(data);
    }
  };

  useEffect(() => {
    if (!roleMember.loading && roleMember.success) {
      setLoading(false);
      formikRef.current.resetForm();
    } else if (!roleMember.loading && roleMember.error) {
      setLoading(false);
      formikRef.current.resetForm();
    }
  }, [roleMember]);

  return (
    <AddBusinessMemberWrapper>
      <div className='header'>
        <p className='header-text'>
          {hasEditMember ? 'Edit Wallet Access' : 'Add Wallet Access'}
        </p>
      </div>
      <div className='content'>
        <Formik
          innerRef={formikRef}
          enableReinitialize
          initialValues={formData}
          onSubmit={handleMember}
          validationSchema={validationSchema}
        >
          {({ values, errors, touched, setFieldValue, resetForm }) => (
            <Form>
              <Row style={rowStyle} gutter={gutter} justify='start'>
                <Col md={24} sm={24} xs={24}>
                  <span className='field-label required'>Position Title</span>
                  <Select
                    style={{ width: '100%' }}
                    name='role'
                    value={values.role}
                    onChange={(value) => setFieldValue('role', value)}
                  >
                    {ListRoleMembers.map((item, index) => (
                      <Option value={item.value} key={index}>
                        {item.title}
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>
              <Row style={rowStyle} gutter={gutter} justify='start'>
                <Col md={24} sm={24} xs={24}>
                  <span className='field-label required'>Full name</span>
                  <Field component={InputField} name='fullName' type='text' />
                </Col>
              </Row>
              <Row style={rowStyle} gutter={gutter} justify='start'>
                <Col md={24} sm={24} xs={24}>
                  <span className='field-label required'>Email</span>
                  <Field
                    component={InputField}
                    name='email'
                    type='text'
                    onChange={(e) =>
                      setFieldValue('email', e.target.value.replace(/\s/g, ''))
                    }
                    disabled={hasEditMember}
                  />
                </Col>
              </Row>
              <Row style={rowStyle} gutter={gutter} justify='end'>
                <Button shape='round' onClick={onClose} className='button-add'>
                  Cancel
                </Button>
                <Button
                  htmlType='submit'
                  shape='round'
                  type='primary'
                  className='button-add'
                  loading={loading}
                >
                  {hasEditMember ? 'Update' : 'Add'}
                </Button>
              </Row>
            </Form>
          )}
        </Formik>
      </div>
    </AddBusinessMemberWrapper>
  );
};

export default AddBusinessMember;
