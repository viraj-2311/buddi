import { Col, Row } from 'antd';
import React, { useState } from 'react';
import MultiplyIcon from '@iso/components/icons/Multiply';
import Button from '@iso/components/uielements/button';
import PaymentSummaryModal from './PaymentSummaryModal.style';
import { formatCurrency } from '@iso/lib/helpers/utility';
import IconBankLink from '@iso/assets/images/ic_card.svg';
import AcceptedIcon from '@iso/assets/images/benji-glass.png';
import Icon from '@iso/components/icons/Icon';
import { useSelector } from 'react-redux';
import { convertCurrencyToDollar } from '@iso/lib/helpers/numberUtil';
import NotEnoughMoneyOnWalletModal from './NotEnoughMoneyOnWalletModal';
import ChangeBank from '../../../../../../SetupWallet/ChangeBankModal/ChangeBank';
import { WrapperModal } from '../../../../../../SetupWallet/Wallet.style';

export default ({
  visible,
  bodyStyle,
  title,
  onDebit,
  onCancel,
  paymentAmount,
  selectedPaymentMethod,
  switchPaymentMethodToBank,
  selectedPaymentBank,
  setSelectedPaymentBank,
  wrapClassName = '',
}) => {
  const { companyWallet, plaidCompanyAccount } = useSelector((state) => state.Company);
  const [visibleNotEnoughMoneyOnWalletModal, setVisibleNotEnoughMoneyOnWalletModal] = useState(false);
  const [visibleChangeBankModal, setVisibleChangeBankModal] = useState(false);

  const onDebitClick = () => {
    if (selectedPaymentMethod === 'wallet' && paymentAmount > getCompanyWalletBalance()) {
      // Show not enough money modal
      setVisibleNotEnoughMoneyOnWalletModal(true)
    } else {
      onDebit();
    }
  };

  const onCancelClick = () => {
    onCancel();
  };

  const getCompanyWalletBalance = () => {
    return convertCurrencyToDollar(companyWallet.wallet.balance);
  }

  const getBankAccounts = () => {
    let bankAccounts = [];
    if (
        plaidCompanyAccount.account &&
        plaidCompanyAccount.account.length > 0
    ) {
      bankAccounts = plaidCompanyAccount.account;
    }

    return bankAccounts;
  }

  const openChangeBankModal = () => {
    setVisibleChangeBankModal(true);
  }

  const closeChangeBankModal = () => {
    setVisibleChangeBankModal(false);
  }

  const changeBank = (selectedBankId) => {
    const bankAccounts = getBankAccounts();
    if (selectedBankId !== selectedPaymentBank.id) {
      const selectedBank = bankAccounts.filter((bankAccount) => {
        return bankAccount.id === selectedBankId;
      })[0];

      setSelectedPaymentBank(selectedBank);
    }

    closeChangeBankModal();
  }

  const ModalHeader = () => {
    return (
      <>
        <h3 className="title">{title}</h3>
        <Button type="link" className="closeBtn" onClick={onCancelClick}>
          <MultiplyIcon width={14} height={14} />
        </Button>
      </>
    );
  };

  return (
    <PaymentSummaryModal
      visible={visible}
      closable={false}
      maskClosable={false}
      title={<ModalHeader />}
      width={773}
      bodyStyle={bodyStyle}
      onCancel={onCancelClick}
      wrapClassName={wrapClassName}
      footer={null}
    >
      <div className="content">
        <div className="title">
          <h3>Summary</h3>
        </div>
      </div>
      <div className="sourceList">
        <Row className="sourceItem">
          <Col>
            <h4>Invoice(s)</h4>
          </Col>
          <Col>
            <h4>{formatCurrency('$', paymentAmount)}</h4>
          </Col>
        </Row>
        <Row className="sourceItem">
          <Col>
            <h3>Total</h3>
          </Col>
          <Col>
            <h3>{formatCurrency('$', paymentAmount)}</h3>
          </Col>
        </Row>
      </div>
      <div className="paymentInfo">
        <h3>{selectedPaymentMethod === 'wallet' ? 'Buddi Wallet' : 'Bank Account'}</h3>
        <p>
          Take <strong>{formatCurrency('$', paymentAmount)}</strong> funds for
          this job from {selectedPaymentMethod === 'wallet' ? 'your Buddi Wallet account.' : 'the bank account on file.'}
        </p>
        {
          selectedPaymentMethod === 'wallet' ?
              <div className={'payment-source-item payment-source-wallet'}>
                <div className="payment-source-image">
                  <Icon src={AcceptedIcon} width={15} height={29} />
                </div>
                <div className="payment-source-details">
                    <p>Benji Wallet balance</p>
                    <p><strong>{formatCurrency('$', getCompanyWalletBalance())}</strong> available</p>
                </div>
              </div> :
              <div className={'payment-source-item payment-source-bank'}>
                <div className="payment-source-image">
                  <Icon src={IconBankLink} width={27} height={22} />
                </div>
                <div className="payment-source-details">
                  <p>{selectedPaymentBank.accountName}</p>
                  <strong>Savings&nbsp;&nbsp;{selectedPaymentBank.accountNumber}</strong>
                </div>
              </div>
        }
        {
          selectedPaymentMethod === 'bank' ?
              <Button type={'link'} className={'change-bank-btn'} onClick={openChangeBankModal}>
                Change
              </Button> :
              ''
        }
      </div>
      <div className="actions">
        <Button className="debitBtn" shape="round" onClick={onDebitClick}>
          Debit {selectedPaymentMethod === 'bank' ? 'Bank Account': 'Buddi Wallet'} {formatCurrency('$', paymentAmount)}
        </Button>
        <Button className="cancelBtn" shape="round" onClick={onCancelClick}>
          Cancel
        </Button>
      </div>
      <p>Once your funds are received, they will be immediately submitted to the crews Benji Wallet.</p>
      {
        selectedPaymentMethod === 'wallet' &&
            <NotEnoughMoneyOnWalletModal
                visible={visibleNotEnoughMoneyOnWalletModal}
                walletBalance={getCompanyWalletBalance()}
                closeModal={() => { setVisibleNotEnoughMoneyOnWalletModal(false); } }
                debitBankAccount={
                  () => {
                    setVisibleNotEnoughMoneyOnWalletModal(false);
                    switchPaymentMethodToBank();
                    onDebit();
                  }
                }
            />
      }
      {
        selectedPaymentMethod === 'bank' &&
        <WrapperModal
            visible={visibleChangeBankModal}
            title='Change Bank'
            onCancel={closeChangeBankModal}
            footer={null}
            width={540}
            className={'change-bank-modal'}
        >
          <ChangeBank
              bankAccounts={getBankAccounts()}
              onCancel={closeChangeBankModal}
              selectBank={changeBank}
              selectedBank={selectedPaymentBank}
          />
        </WrapperModal>
      }
    </PaymentSummaryModal>
  );
};
