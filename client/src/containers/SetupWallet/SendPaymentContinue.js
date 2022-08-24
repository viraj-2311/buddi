import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SendPaymentModal, {
  ActionWrapper,
  FooterWrapper,
} from './SendPaymentContinue.style';
import { Field, Form, Formik } from 'formik';
import Button from '@iso/components/uielements/button';
import { Row, Col, Input } from 'antd';
import basicStyle from '@iso/assets/styles/constants';
import { userItems } from '../../library/helpers/app.constants';
import {
  formatInputNumber,
  formatMoney,
  formatOriginalNumber,
  convertCurrencyToCent,
  convertCurrencyToDollar,
} from '@iso/lib/helpers/numberUtil';
import IconCurrency from '@iso/assets/images/ic_currency.svg';
import { InputField } from '@iso/components';
import IconBankLink from '@iso/assets/images/ic_card.svg';
import AcceptedIcon from '@iso/assets/images/benji-glass.png';
import Icon from '@iso/components/icons/Icon';
import { Radio } from 'antd';
import Empty_Avatar from '@iso/assets/images/empty-profile.png';
import {
  transferMoneyByBankAccount,
  transferMoneyByBenjiWalletAccount,
  getUserWallet,
} from '@iso/redux/user/actions';
import { getCompanyWallet } from '@iso/redux/company/actions';
import {
  getHistoryPayment,
  getListRequestPaymentSila,
  declineRequestPaymentSila,
} from '@iso/redux/wallet/actions';

import notify from '@iso/lib/helpers/notify';
import Spin from '@iso/components/uielements/spin';
import ConfirmModalSend from '@iso/components/Modals/ConfirmSend';
import schemaValidateRequestPayment from './schemaRequestPayment';
const { rowStyle, gutter } = basicStyle;

export default ({
  visible,
  handleCancel,
  handleDecline,
  handleSuccess,
  userReceivePayment,
  hasPersonalWallet,
}) => {
  const dispatch = useDispatch();
  const { userWallet, plaidUserAccount, transferByBenji, transferByBank } =
    useSelector((state) => state.User);

  const { companyWallet, plaidCompanyAccount } = useSelector(
    (state) => state.Company
  );

  const { companyId } = useSelector((state) => state.AccountBoard);
  const { userHistoryPayment, listRequestPayment, declinePayment } =
    useSelector((state) => state.Wallet);
  const [amountInput, setValueAmountInput] = useState('');
  const [isUsingBankAccount, setUsingBankAccount] = useState(false);
  const [hasRemoveRequestAfterPayment, setHasRemoveRequestAfterPayment] =
    useState(false);
  const [hasConfirmPayment, setConfirmPayment] = useState(false);
  const [hasDoDeclineAction, setHasDoDeclineAction] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allowPayment, setAllowPayment] = useState(false);
  const [dataPayment, setDataPayment] = useState({});
  const formData = { notePayment: '' };

  const transferMoney = (data) => {
    setLoading(true);
    if (userReceivePayment && userReceivePayment.requestPaynow) {
      setHasRemoveRequestAfterPayment(true);
    } else {
      setHasRemoveRequestAfterPayment(false);
    }
    if (hasPersonalWallet) {
      if (isUsingBankAccount) {
        const dataPayload = {
          account_id: plaidUserAccount.account[0].id,
          amount: getMoneyTransfer(),
          note: data.notePayment ? data.notePayment : '',
        };
        if (userReceivePayment.userId) {
          dataPayload.to_user = userReceivePayment.userId;
        } else {
          dataPayload.to_company = userReceivePayment.companyId;
        }
        dispatch(transferMoneyByBankAccount(dataPayload));
      } else {
        const dataPayload = {
          amount: getMoneyTransfer(),
          note: data.notePayment ? data.notePayment : '',
        };
        if (userReceivePayment.userId) {
          dataPayload.to_user = userReceivePayment.userId;
        } else {
          dataPayload.to_company = userReceivePayment.companyId;
        }
        dispatch(transferMoneyByBenjiWalletAccount(dataPayload));
      }
    } else {
      if (isUsingBankAccount) {
        const dataPayload = {
          from_company: parseInt(companyId),
          account_id: plaidCompanyAccount.account[0].id,
          amount: getMoneyTransfer(),
          note: data.notePayment ? data.notePayment : '',
        };
        if (userReceivePayment.userId) {
          dataPayload.to_user = userReceivePayment.userId;
        } else {
          dataPayload.to_company = userReceivePayment.companyId;
        }
        dispatch(transferMoneyByBankAccount(dataPayload));
      } else {
        const dataPayload = {
          from_company: parseInt(companyId),
          amount: getMoneyTransfer(),
          note: data.notePayment ? data.notePayment : '',
        };
        if (userReceivePayment.userId) {
          dataPayload.to_user = userReceivePayment.userId;
        } else {
          dataPayload.to_company = userReceivePayment.companyId;
        }
        dispatch(transferMoneyByBenjiWalletAccount(dataPayload));
      }
    }
  };

  const getMoneyTransfer = () => {
    if (userReceivePayment && userReceivePayment.requestPaynow) {
      return convertCurrencyToCent(
        parseFloat(formatOriginalNumber(userReceivePayment.amount))
      );
    } else {
      return convertCurrencyToCent(
        parseFloat(formatOriginalNumber(amountInput))
      );
    }
  };

  const proceedRemoveRequestPaymentAfterTransferred = () => {
    //if this is a request payment, we need to remove the request once you transferred
    if (userReceivePayment && userReceivePayment.requestPaynow) {
      if (companyId == null || companyId == 'null') {
        let payload = {
          payment_id: userReceivePayment.payment_id,
          status: 'completed',
        };
        dispatch(declineRequestPaymentSila(payload));
      } else {
        let payload = {
          company_id: companyId,
          payment_id: userReceivePayment.payment_id,
          status: 'completed',
        };
        dispatch(declineRequestPaymentSila(payload));
      }
    } else {
      refreshWallet();
    }
  };

  const displayConfirmPopup = (data) => {
    setDataPayment(data);
    setConfirmPayment(true);
  };

  const handleConfirmPayment = () => {
    setConfirmPayment(false);
    transferMoney(dataPayment);
  };

  const checkAllowPayment = () => {
    if (
      (userReceivePayment && userReceivePayment.requestPaynow) ||
      allowPayment
    )
      return true;
    return false;
  };

  useEffect(() => {
    if (
      visible &&
      !transferByBenji.loading &&
      transferByBenji.success &&
      checkAllowPayment()
    ) {
      proceedRemoveRequestPaymentAfterTransferred();
    } else if (
      !transferByBenji.loading &&
      transferByBenji.error &&
      checkAllowPayment()
    ) {
      setLoading(false);
      setAllowPayment(false);
      if (transferByBank.error && transferByBank.error.message) {
        notify('error', transferByBank.error.message);
      } else {
        notify('error', 'Can not proceed the payment');
      }
    }
  }, [transferByBenji]);

  useEffect(() => {
    if (
      visible &&
      !transferByBank.loading &&
      transferByBank.success &&
      checkAllowPayment()
    ) {
      proceedRemoveRequestPaymentAfterTransferred();
    } else if (
      !transferByBank.loading &&
      transferByBank.error &&
      checkAllowPayment()
    ) {
      setLoading(false);
      setAllowPayment(false);
      if (transferByBank.error && transferByBank.error.message) {
        notify('error', transferByBank.error.message);
      } else {
        notify('error', 'Can not proceed the payment');
      }
    }
  }, [transferByBank]);

  //refresh wallet after finish payment
  useEffect(() => {
    if (
      visible &&
      !declinePayment.loading &&
      declinePayment.success &&
      !hasDoDeclineAction
    ) {
      refreshWallet();
    } else if (!declinePayment.loading && declinePayment.error) {
      setLoading(false);
      notify('error', 'Can not proceed the payment');
    }
  }, [declinePayment]);

  //dismiss popup after do payment success and refresh data wallet
  useEffect(() => {
    if (
      visible &&
      !listRequestPayment.loading &&
      !userHistoryPayment.loading &&
      !hasDoDeclineAction
    ) {
      setLoading(false);
      const dataSuccess = {
        amount: userReceivePayment.requestPaynow
          ? userReceivePayment.amount
          : amountInput,
      };
      setValueAmountInput('');
      setAllowPayment(false);
      handleSuccess(dataSuccess);
    }
  }, [listRequestPayment, userHistoryPayment]);

  //load list request after finish decline request payment
  useEffect(() => {
    if (
      visible &&
      !declinePayment.loading &&
      declinePayment.success &&
      !hasRemoveRequestAfterPayment &&
      hasDoDeclineAction
    ) {
      if (companyId === null || companyId === 'null') {
        dispatch(getListRequestPaymentSila());
      } else {
        let payload = { company_id: companyId };
        dispatch(getListRequestPaymentSila(payload));
      }
    } else if (!declinePayment.loading && declinePayment.error) {
      setLoading(false);
      notify('error', 'Can not proceed the decline payment');
    }
  }, [declinePayment]);

  //dismiss popup request payment after decline
  useEffect(() => {
    if (visible && !listRequestPayment.loading && hasDoDeclineAction) {
      setLoading(false);
      handleDecline();
    }
  }, [listRequestPayment]);

  const refreshWallet = () => {
    setTimeout(() => {
      if (companyId === null || companyId === 'null') {
        dispatch(getUserWallet());
        dispatch(getHistoryPayment(null, {}));
        dispatch(getListRequestPaymentSila());
      } else {
        let payload = { company_id: companyId };
        dispatch(getCompanyWallet(companyId));
        dispatch(getHistoryPayment(companyId, {}));
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

  const handleTypeTransfer = (e) => {
    if (e.target.value == 1) {
      setUsingBankAccount(false);
    } else {
      setUsingBankAccount(true);
    }
  };

  const declineRequestPayment = () => {
    setLoading(true);
    setHasDoDeclineAction(true);
    if (companyId == null || companyId == 'null') {
      let payload = {
        payment_id: userReceivePayment.payment_id,
        status: 'rejected',
      };
      dispatch(declineRequestPaymentSila(payload));
    } else {
      let payload = {
        company_id: companyId,
        payment_id: userReceivePayment.payment_id,
        status: 'rejected',
      };
      dispatch(declineRequestPaymentSila(payload));
    }
  };

  const hasRequestPayment = () => {
    if (userReceivePayment && userReceivePayment.requestPaynow) return true;
    return false;
  };

  const renderRecipient = () => {
    let moneyFormat = formatMoney(
      userReceivePayment.requestPaynow ? userReceivePayment.amount : amountInput
    );
    return (
      <div className='send-view'>
        <p>
          <span className='currency'>$</span>
          <span className='even-number'>{moneyFormat.evenMoney}</span>
          <span className='small-number'>.{moneyFormat.pence}</span>
        </p>
      </div>
    );
  };

  const renderWarning = () => {
    let hasWarning = false;
    let balance = 0;
    let amount = 0;
    if (hasPersonalWallet) {
      amount = formatOriginalNumber(amountInput);
      if (isUsingBankAccount) {
        // plaidUserAccount.account[0].balance &&
        // plaidUserAccount.account[0].balance < amount
        // hasWarning = true;
        // balance = plaidUserAccount.account[0].balance;
      } else if (userWallet.wallet.balance / 100 < amount) {
        hasWarning = true;
        balance = userWallet.wallet.balance;
      }
    } else {
      amount = formatOriginalNumber(amountInput);
      if (isUsingBankAccount) {
        // plaidCompanyAccount.account[0].balance &&
        // plaidCompanyAccount.account[0].balance < amount
        // hasWarning = true;
        // balance = plaidCompanyAccount.account[0].balance;
      } else if (companyWallet.wallet.balance / 100 < amount) {
        hasWarning = true;
        balance = companyWallet.wallet.balance;
      }
    }
    if (!hasWarning) {
      if (amount > 0) {
        setAllowPayment(true);
      }
      return null;
    } else {
      setAllowPayment(false);
      return (
        <p className='warning-amount'>
          Your current balance is:{' '}
          <span>${convertCurrencyToDollar(balance)}</span> . You can not proceed
          the payment.
        </p>
      );
    }
  };

  const renderBankList = () => {
    let bankAccount = {};
    if (
      hasPersonalWallet &&
      plaidUserAccount.account &&
      plaidUserAccount.account[0]
    ) {
      bankAccount = plaidUserAccount.account[0];
    } else if (plaidCompanyAccount.account && plaidCompanyAccount.account[0]) {
      bankAccount = plaidCompanyAccount.account[0];
    }
    return (
      <div className='bank-title-view'>
        <p className='bank-title'>{bankAccount.accountName}</p>
        <p className='bank-account-number'>{bankAccount.accountNumber}</p>
        <p className='bank-title'>
          <span className='fee-title'>Fee: </span>
          <span className='even-fee'>$0</span>
          <span className='amount-fee'>.00</span>
        </p>
      </div>
    );
  };

  if (!visible) {
    if (isUsingBankAccount) {
      setUsingBankAccount(false);
    }
    return null;
  }

  return (
    <>
      <SendPaymentModal
        title='Send payment to'
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
              validationSchema={
                hasRequestPayment() ? schemaValidateRequestPayment : null
              }
              onSubmit={displayConfirmPopup}
            >
              {() => (
                <Form>
                  <Row style={rowStyle} gutter={gutter} justify='start'>
                    <Col md={24} sm={24} xs={24}>
                      <div className='detail-contact'>
                        <div className='avatar-icon'>
                          {userReceivePayment.profilePhotoS3Url ? (
                            <img
                              src={userReceivePayment.profilePhotoS3Url}
                              alt='Profile'
                            />
                          ) : (
                            <img src={Empty_Avatar} alt='Profile' />
                          )}
                        </div>
                        <div className='user-name'>
                          <p>{userReceivePayment.name}</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row
                    style={rowStyle}
                    gutter={gutter}
                    justify='start'
                    className='input-view'
                  >
                    <Col md={10} sm={10} xs={24} className='margin-view'>
                      <div className='title-contact'>
                        <span>You send</span>
                      </div>
                      <Input
                        allowClear
                        placeholder='0.00'
                        prefix='$'
                        onChange={(e) => handleChange(e)}
                        value={
                          userReceivePayment.requestPaynow
                            ? userReceivePayment.amount
                            : amountInput
                        }
                      />
                      <div>
                        <img
                          src={IconCurrency}
                          alt='Currency'
                          height={30}
                          width={60}
                        />
                      </div>
                    </Col>
                    <Col
                      md={4}
                      sm={4}
                      xs={0}
                      className='vertical-view margin-view'
                    >
                      <div className='vertical-border'></div>
                    </Col>
                    <Col md={10} sm={10} xs={24} className='margin-view'>
                      <div className='title-contact'>
                        <span>Recipient gets</span>
                      </div>
                      {renderRecipient()}
                      <div>
                        <img
                          src={IconCurrency}
                          alt='Currency'
                          height={30}
                          width={60}
                        />
                      </div>
                    </Col>
                  </Row>
                  {renderWarning()}
                  <Row style={rowStyle} gutter={gutter} justify='start'>
                    <Col span={24} className='note-view'>
                      {hasRequestPayment() ? (
                        <p className='label-note'>Add a note</p>
                      ) : (
                        <p className='label-note'>
                          Add a note - <span>optional</span>
                        </p>
                      )}

                      <Field
                        component={InputField}
                        name='notePayment'
                        type='text'
                      />
                    </Col>
                  </Row>
                  <div className='border-line' />
                  <div className='pay-method'>
                    <p>Pay using</p>
                  </div>
                  <Radio.Group
                    name='radiogroup'
                    defaultValue={1}
                    onChange={handleTypeTransfer}
                  >
                    <Row style={rowStyle} gutter={gutter} justify='start'>
                      <Col md={10} sm={10} xs={24} className='margin-view'>
                        <Radio value={1} disabled={false}>
                          <div className='bank-payment'>
                            <div className='company-icon cover-icon-purple'>
                              <Icon src={AcceptedIcon} width={15} height={29} />
                            </div>
                            <div className='bank-title-view'>
                              <p className='bank-title'>Buddi Wallet</p>
                              <p className='bank-title'>
                                <span className='fee-title'>Fee: </span>
                                <span className='amount-fee'>FREE</span>
                              </p>
                            </div>
                          </div>
                        </Radio>
                      </Col>
                      <Col
                        md={4}
                        sm={4}
                        xs={0}
                        className='vertical-view margin-view'
                      >
                        <div className='vertical-border'></div>
                      </Col>
                      {plaidUserAccount &&
                        plaidUserAccount.account &&
                        plaidUserAccount.account.length > 0 > 0 && (
                          <Col md={10} sm={10} xs={24} className='margin-view'>
                            <Radio value={2} disabled={false}>
                              <div className='bank-payment'>
                                <div className='cover-icon'>
                                  <Icon
                                    src={IconBankLink}
                                    width={35}
                                    height={35}
                                  />
                                </div>
                                {renderBankList()}
                              </div>
                            </Radio>
                          </Col>
                        )}
                    </Row>
                  </Radio.Group>
                  <div className='border-line' />
                  <div>
                    <ActionWrapper>
                      <Button
                        htmlType='button'
                        shape='round'
                        onClick={() =>
                          userReceivePayment.requestPaynow
                            ? declineRequestPayment()
                            : handleCancel()
                        }
                        className={
                          userReceivePayment.requestPaynow
                            ? 'buttonWrap declineBtn'
                            : 'buttonWrap'
                        }
                      >
                        {userReceivePayment.requestPaynow
                          ? 'Decline'
                          : 'Cancel'}
                      </Button>
                      <Button
                        htmlType='submit'
                        type='primary'
                        shape='round'
                        className={
                          checkAllowPayment()
                            ? 'buttonWrap'
                            : 'buttonWrap disableButton'
                        }
                        disabled={checkAllowPayment() ? false : true}
                      >
                        Continue
                      </Button>
                    </ActionWrapper>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Spin>
      </SendPaymentModal>
      {userReceivePayment && userReceivePayment.id && (
        <ConfirmModalSend
          visible={hasConfirmPayment}
          title='Are you sure you
        want to send?'
          amount={
            userReceivePayment.requestPaynow
              ? userReceivePayment.amount
              : amountInput
          }
          userSend={userReceivePayment.name}
          onYes={handleConfirmPayment}
          onNo={() => {
            setConfirmPayment(false);
            setDataPayment({});
          }}
        />
      )}
    </>
  );
};
