import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PopupModal, { ActionWrapper } from './RequestPaymentConfirm.style';
import { Field, Form, Formik } from 'formik';
import Button from '@iso/components/uielements/button';
import { Col, Input, Row } from 'antd';
import basicStyle from '@iso/assets/styles/constants';
import IconCurrency from '@iso/assets/images/ic_currency.svg';
import Empty_Avatar from '@iso/assets/images/empty-profile.png';
import { InputField } from '@iso/components';
import {
  convertCurrencyToCent,
  formatInputNumber,
  formatMoney,
  formatOriginalNumber,
} from '@iso/lib/helpers/numberUtil';
import {
  requestPaymentSilaFromPersonalAccount,
  requestPaymentSilaFromCompanyAccount,
} from '@iso/redux/user/actions';
import { getListRequestPaymentSila } from '@iso/redux/wallet/actions';
import notify from '@iso/lib/helpers/notify';
import Spin from '@iso/components/uielements/spin';
import schemaSendRequest from './schemaSendRequest';

const { rowStyle, gutter } = basicStyle;

export default ({
  companyId,
  visible,
  handleCancel,
  handleSuccess,
  requestUserPayment,
}) => {
  const dispatch = useDispatch();
  const { requestPayment } = useSelector((state) => state.User);
  const { listRequestPayment } = useSelector((state) => state.Wallet);
  const [amountInput, setValueAmountInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [allowRequestPayment, setAllowPayment] = useState(false);
  const formData = { noteRequest: '' };

  useEffect(() => {
    if (
      visible &&
      !requestPayment.loading &&
      requestPayment.success &&
      allowRequestPayment
    ) {
      refreshRequestPayment();
    } else if (
      !requestPayment.loading &&
      requestPayment.error &&
      allowRequestPayment
    ) {
      setLoading(false);
      setAllowPayment(true);
      if (requestPayment.error.message) {
        notify('error', requestPayment.error.message);
      } else {
        notify('error', 'Can not proceed the request payment');
      }
    }
  }, [requestPayment]);

  useEffect(() => {
    if (
      visible &&
      !requestPayment.loading &&
      requestPayment.success &&
      !listRequestPayment.loading &&
      allowRequestPayment
    ) {
      const dataSuccess = {
        amount: amountInput,
      };
      setLoading(false);
      setAllowPayment(false);
      setValueAmountInput('');
      handleSuccess(dataSuccess);
    }
  }, [listRequestPayment]);

  const handleRequestPayment = (data) => {
    setLoading(true);
    let dataPayload = {
      amount: convertCurrencyToCent(
        parseFloat(formatOriginalNumber(amountInput))
      ),
    };
    if (requestUserPayment.userId) {
      dataPayload.from_user = requestUserPayment.userId;
    } else {
      dataPayload.from_company = requestUserPayment.companyId;
    }
    if (data.noteRequest && data.noteRequest != '') {
      dataPayload.note = data.noteRequest;
    }
    if (companyId !== null && companyId !== 'null') {
      dispatch(requestPaymentSilaFromCompanyAccount(companyId, dataPayload));
    } else {
      dispatch(requestPaymentSilaFromPersonalAccount(dataPayload));
    }
  };

  const refreshRequestPayment = () => {
    setTimeout(() => {
      if (companyId === null || companyId === 'null') {
        dispatch(getListRequestPaymentSila());
      } else {
        let payload = { company_id: companyId };
        dispatch(getListRequestPaymentSila(payload));
      }
    }, 1000);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (value == '') {
      setAllowPayment(false);
      setValueAmountInput(value);
    } else {
      let amountInput = formatInputNumber(value);
      if (amountInput && amountInput.length < 10) {
        setAllowPayment(true);
        setValueAmountInput(amountInput);
      }
    }
  };

  const onKeyDown = (keyEvent) => {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  };

  const renderRecipient = () => {
    let moneyFormat = formatMoney(amountInput);
    return (
      <p>
        <span className='currency'>$</span>
        <span className='even-number'>{moneyFormat.evenMoney}</span>
        <span className='small-number'>.{moneyFormat.pence}</span>
      </p>
    );
  };

  if (!visible) {
    return null;
  }
  return (
    <PopupModal
      title='Request payment confirmation'
      visible={visible}
      width={700}
      footer={null}
      onCancel={handleCancel}
    >
      <Spin spinning={loading}>
        <div className='content'>
          <Formik
            enableReinitialize={true}
            initialValues={formData}
            onSubmit={handleRequestPayment}
            validationSchema={schemaSendRequest}
          >
            {() => (
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
                      value={amountInput}
                    />
                    <div>
                      <img src={IconCurrency} alt='Currency' height={30} />
                    </div>
                  </Col>
                </Row>
                <div className='user-cell'>
                  <Row style={rowStyle} gutter={gutter} justify='start'>
                    <Col md={24} sm={24} xs={24}>
                      <div className='detail-contact'>
                        <div className='avatar-icon'>
                          {requestUserPayment.profilePhotoS3Url ? (
                            <img
                              src={requestUserPayment.profilePhotoS3Url}
                              alt='Profile'
                            />
                          ) : (
                            <img src={Empty_Avatar} alt='Profile' />
                          )}
                        </div>
                        <div className='user-name'>
                          <p> {requestUserPayment.name}</p>
                        </div>
                        <div className='right-user-view'>
                          <div className='send-view'>{renderRecipient()}</div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className='border-line' />
                <Row style={rowStyle} gutter={gutter} justify='start'>
                  <Col span={24} className='note-view'>
                    <p className='label-note'>Add a note</p>
                    <Field
                      component={InputField}
                      name='noteRequest'
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
                      className={
                        allowRequestPayment
                          ? 'buttonWrap'
                          : 'buttonWrap disableButton'
                      }
                      disabled={!allowRequestPayment}
                    >
                      Request a Payment
                    </Button>
                  </ActionWrapper>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Spin>
    </PopupModal>
  );
};
