import React, { useState } from 'react';
import styled from 'styled-components';
import { Form, Field } from 'formik';
import { Row, Col, Spin } from 'antd';
import AutoComplete from '@iso/components/Autocomplete';
import { PlusOutlined } from '@ant-design/icons';
import Input from '@iso/components/uielements/input';
import Button from '@iso/components/uielements/button';
import InputField from '@iso/components/InputField';
import DatePicker from '@iso/components/uielements/datePicker';
import CalendarIcon from '@iso/components/icons/Calendar';
import { stringToDate, formatDateString } from '@iso/lib/helpers/utility';
import { displayDateFormat } from '@iso/config/datetime.config';
import basicStyle from '@iso/assets/styles/constants';
import _ from 'lodash';
import moment from 'moment';

const { rowStyle } = basicStyle;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-top: 2px solid #b4b4c6;
  margin-top: 20px;
  padding-top: 40px;

  button {
    margin-left: 20px;
  }
`;

export default ({
  values,
  errors,
  touched,
  setFieldValue,
  users,
  action,
  onCancel,
  loading,
}) => {
  const isEditMode = values && values.id;
  const [isFormSaveClick, setIsFormSaveClick] = useState(false);
  const execProducerName =
    values.execProducer && values.execProducer.id
      ? values.execProducer.fullName
      : values.execProducerName;
  const lineProducerName =
    values.lineProducer && values.lineProducer.id
      ? values.lineProducer.fullName
      : values.lineProducerName;
  const directorName =
    values.director && values.director.id
      ? values.director.fullName
      : values.directorName;

  const renderItem = (user, isHighlighted) => (
    <div
      key={`user_${user.value}`}
      className={`ant-select-item ant-select-item-option userDropdownItemWithAvatar ${isHighlighted ? 'ant-select-item-option-active' : ''
        }`}
    >
      <div className='userAvatar'>
        <img src={user.avatar} alt='User' />
      </div>
      <div className='userInfo'>
        <h4>{user.label}</h4>
        {/* <div className='userStatus'>{user.isActive ? '' : 'Not Activated'}</div> */}
      </div>
    </div>
  );

  const shouldItemRender = (option, value) => {
    return (
      option.label &&
      option.label.toLowerCase().indexOf(value.toLowerCase()) >= 0
    );
  };

  return (
    <Form>
      <Spin spinning={loading}>
        <Row style={rowStyle} gutter={30}>
          <Col md={12} xs={24}>
            <div className='formGroup'>
              <label className='fieldLabel required'>Client</label>
              <Field component={InputField} name='client' type='text' />
            </div>
          </Col>
          <Col md={12} xs={24}>
            <div className='formGroup'>
              <label className='fieldLabel'>
                Agency - <i>Optional</i>
              </label>
              <Field name='agency' type='text' component={InputField} />
            </div>
          </Col>
          <Col md={12} xs={24}>
            <div className='formGroup'>
              <label className='fieldLabel'>Gig Name</label>
              <Field component={InputField} name='title' type='text' />
            </div>
          </Col>

          <Col md={6} xs={12}>
            <div className='formGroup'>
              <label className='fieldLabel'>Project Start date</label>
              <Field>
                {() => (
                  <DatePicker
                    allowClear={false}
                    name='startDate'
                    style={{ width: '100%' }}
                    value={stringToDate(values.startDate)}
                    onChange={(date) =>
                      setFieldValue('startDate', formatDateString(date))
                    }
                    disabledDate={(current) => {
                      return moment().add(-1, 'days')  >= current;
                    }}
                    suffixIcon={
                      <CalendarIcon width={22} height={22} fill='#bcbccb' />
                    }
                    format={displayDateFormat}
                    placeholder=''
                  />
                )}
              </Field>
              {touched.startDate && errors.startDate && (
                <div className='helper-text lowercase'>{errors.startDate}</div>
              )}
            </div>
          </Col>

          <Col md={6} xs={12}>
            <div className='formGroup'>
              <label className='fieldLabel'>project End date</label>
              <Field>
                {() => (
                  <DatePicker
                    allowClear={false}
                    style={{ width: '100%' }}
                    name='wrapDate'
                    value={stringToDate(values.wrapDate)}
                    onChange={(date) =>
                      setFieldValue('wrapDate', formatDateString(date))
                    }
                    disabledDate={(current) => {
                      return moment().add(-1, 'days')  >= current;
                    }}
                    suffixIcon={
                      <CalendarIcon width={22} height={22} fill='#bcbccb' />
                    }
                    format={displayDateFormat}
                    placeholder=''
                  />
                )}
              </Field>
              {touched.wrapDate && errors.wrapDate && (
                <div className='helper-text lowercase'>{errors.wrapDate}</div>
              )}
            </div>
          </Col>

          <Col md={12} xs={24}>
            <div className='formGroup'>
              <label className='fieldLabel'>Gig Number</label>
              <Field component={InputField} name='jobNumber' type='text' />
            </div>
          </Col>

          <Col md={12} xs={24}>
            <div className='formGroup'>
              <label className='fieldLabel'>Exec Producer Name</label>
              {isEditMode ? (
                <Input value={execProducerName} disabled />
              ) : (
                <>
                  <Field name='execProducer'>
                    {() => (
                      <AutoComplete
                        inputProps={{
                          className: 'ant-input',
                        }}
                        shouldItemRender={shouldItemRender}
                        items={users}
                        wrapperStyle={{
                          position: 'relative',
                          display: 'inline-block',
                          width: '100%',
                          zIndex: 3,
                        }}
                        renderItem={renderItem}
                        getItemValue={(user) => user.label}
                        renderMenu={(children) => (
                          <div className='isoAutocompleteDropdown'>
                            {children}
                          </div>
                        )}
                        onChange={(value) =>
                          setFieldValue('execProducer', value)
                        }
                        onSelect={(user) => {
                          setFieldValue('execProducer', user.value);
                        }}
                      />
                    )}
                  </Field>
                  {(touched.execProducer ||
                    touched.execProducer === undefined) &&
                    isFormSaveClick &&
                    errors.execProducer && (
                      <div className='helper-text lowercase'>
                        {errors.execProducer}
                      </div>
                    )}
                </>
              )}
            </div>
          </Col>

          <Col md={12} xs={24}>
            <div className='formGroup'>
              <label className='fieldLabel'>Producer Name</label>
              {isEditMode ? (
                <Input value={lineProducerName} disabled />
              ) : (
                <>
                  <Field name='lineProducer'>
                    {() => (
                      <AutoComplete
                        inputProps={{
                          className: 'ant-input',
                        }}
                        shouldItemRender={shouldItemRender}
                        items={users}
                        wrapperStyle={{
                          position: 'relative',
                          display: 'inline-block',
                          width: '100%',
                          zIndex: 2,
                        }}
                        renderItem={renderItem}
                        getItemValue={(user) => user.label}
                        renderMenu={(children) => (
                          <div className='isoAutocompleteDropdown'>
                            {children}
                          </div>
                        )}
                        onChange={(value) =>
                          setFieldValue('lineProducer', value)
                        }
                        onSelect={(user) => {
                          setFieldValue('lineProducer', user.value);
                        }}
                      />
                    )}
                  </Field>
                  {touched.lineProducer && errors.lineProducer && (
                    <div className='helper-text lowercase'>
                      {errors.lineProducer}
                    </div>
                  )}
                </>
              )}
            </div>
          </Col>

          <Col md={12} xs={24}>
            <div className='formGroup'>
              <label className='fieldLabel'>Director Name</label>
              {isEditMode ? (
                <Input value={directorName} disabled />
              ) : (
                <>
                  <Field name='director'>
                    {() => (
                      <AutoComplete
                        inputProps={{
                          className: 'ant-input',
                        }}
                        shouldItemRender={shouldItemRender}
                        items={users}
                        wrapperStyle={{
                          position: 'relative',
                          display: 'inline-block',
                          width: '100%',
                          zIndex: 2,
                        }}
                        renderItem={renderItem}
                        getItemValue={(user) => user.label}
                        renderMenu={(children) => (
                          <div className='isoAutocompleteDropdown'>
                            {children}
                          </div>
                        )}
                        onChange={(value) => setFieldValue('director', value)}
                        onSelect={(user) => {
                          setFieldValue('director', user.value);
                        }}
                      />
                    )}
                  </Field>
                  {(touched.director || touched.execProducer === undefined) &&
                    isFormSaveClick &&
                    errors.director && (
                      <div className='helper-text lowercase'>
                        {errors.director}
                      </div>
                    )}
                </>
              )}
            </div>
          </Col>
        </Row>
        <ActionButtons>
          <Button type='default' shape='round' onClick={onCancel}>
            Cancel
          </Button>
          <Button
            htmlType='submit'
            onClick={() => {
              setIsFormSaveClick(true);
            }}
            type='primary'
            shape='round'
            loading={action === 'job_reinstate'}
          >
            Reinstate Gig
          </Button>          
        </ActionButtons>
      </Spin>
    </Form>
  );
};
