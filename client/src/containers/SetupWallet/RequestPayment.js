import React, { createRef, useState } from 'react';
import PopupModal, {
  ActionWrapper,
  FooterWrapper,
} from './RequestPayment.style';
import { Field, Form, Formik } from 'formik';
import Button from '@iso/components/uielements/button';
import { Row, Col, Input } from 'antd';
import basicStyle from '@iso/assets/styles/constants';
import { formatInputNumber } from '@iso/lib/helpers/numberUtil';
import IconCurrency from '@iso/assets/images/ic_currency.svg';
import { InputField } from '@iso/components';
import Icon from '@iso/components/icons/Icon';
import { Radio } from 'antd';
import TagAutoComplete from '@iso/components/TagAutoComplete';
import { tagFormattedEmails } from '@iso/lib/helpers/utility';
import IconUser from '@iso/assets/images/ic_user_request.png';

const { rowStyle, gutter } = basicStyle;

export default ({ visible, confirm, handleCancel, handleSuccess }) => {
  const [valueInput, setValueInput] = useState('');
  const [isFreePayment, setFreePayment] = useState(true);
  const handleConfirm = (values) => {
    confirm({ confirm: true });
  };

  const emailRef = createRef();

  const formData = {
    emails: [],
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (value == '') {
      setValueInput(value);
    } else {
      let amountInput = formatInputNumber(value);
      if (amountInput) {
        setValueInput(amountInput);
      }
    }
  };

  const onKeyDown = (keyEvent) => {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  };

  return (
    <PopupModal
      title='Request payment from'
      visible={visible}
      width={700}
      footer={null}
      onCancel={handleCancel}
    >
      <div className='content'>
        <Formik
          enableReinitialize={true}
          initialValues={formData}
          onSubmit={() => {
            handleSuccess(formData.emails);
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form onKeyDown={onKeyDown}>
              <Row
                style={rowStyle}
                gutter={gutter}
                justify='start'
                className='input-view'
              >
                <Col md={20} sm={20} xs={20} className='margin-view'>
                  <Input
                    allowClear
                    placeholder='0.00'
                    prefix='$'
                    onChange={(e) => handleChange(e)}
                    value={valueInput}
                  />
                  <div>
                    <img src={IconCurrency} alt='Currency' height={30} />
                  </div>
                </Col>
              </Row>
              <Row style={rowStyle} gutter={gutter} justify='start'>
                <Col md={24} sm={24} xs={24}>
                  <p className='label-note'>
                    Name, User handle, email, or mobile
                  </p>
                  <Field>
                    {() => (
                      <TagAutoComplete
                        ref={emailRef}
                        tags={tagFormattedEmails(values.emails)}
                        placeholder=''
                        onChange={(emails) => {
                          const names = emails.map((email) => email.name);
                          formData.emails = names;
                          setFieldValue('emails', names);
                        }}
                      />
                    )}
                  </Field>
                  <p className='total-request'>
                    <img src={IconUser} alt='User Request' height={10} />
                    <span>{formData.emails.length}/20</span>
                  </p>
                </Col>
              </Row>
              <div className='border-line' />
              <Row style={rowStyle} gutter={gutter} justify='start'>
                <Col span={24}>
                  <p className='label-note'>
                    Add a note - <span>optional</span>
                  </p>
                  <Field
                    component={InputField}
                    name='user-handle'
                    type='text'
                  />
                </Col>
              </Row>
              <div>
                <ActionWrapper>
                  <Button
                    htmlType='button'
                    shape='round'
                    onClick={() => handleCancel()}
                    className='buttonWrap'
                  >
                    Cancel
                  </Button>
                  <Button
                    htmlType='submit'
                    type='primary'
                    shape='round'
                    className='buttonWrap'
                  >
                    Request a Payment
                  </Button>
                </ActionWrapper>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </PopupModal>
  );
};
