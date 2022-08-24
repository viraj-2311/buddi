import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Input, Row } from 'antd';
import TransferFundsWrapper from './TransferFunds.style';
import Button from '@iso/components/uielements/button';
import Icon from '@iso/components/icons/Icon';
import BentArrows from '@iso/assets/images/beat_swap_ic.webp';
import AcceptedIcon from '@iso/assets/images/benji-glass.png';
import FeeSelectorRadio from './FeeSelectorRadio';
import {
  convertCurrencyToCent,
  convertCurrencyToDollar,
  formatInputNumber,
  formatMoney,
  formatOriginalNumber,
} from '@iso/lib/helpers/numberUtil';
import {
  transferFromBenjiToBankAccount,
  transferMoneyByBankAccount,
  getUserWallet,
} from '@iso/redux/user/actions';
import { getCompanyWallet } from '@iso/redux/company/actions';
import {
  getHistoryPayment,
  getListRequestPaymentSila,
} from '@iso/redux/wallet/actions';
import CardIcon from '@iso/assets/images/card.svg';
import notify from '@iso/lib/helpers/notify';
import FlipIcon from '@iso/assets/images/flip-icon.svg';
import FlipMove from 'react-flip-move';
import { WrapperModal } from './Wallet.style';
import ChangeBank from './ChangeBankModal/ChangeBank';

const TransferFunds = React.forwardRef(
  (
    {
      visible,
      handleSuccess,
      hasPersonalWallet,
      currentBalance,
      plaidLinkToken,
      onAddNewBankSuccess,
      setTransferTo,
    },
    ref
  ) => {
    const TRANSFER_SOURCE_WALLET = 'wallet';
    const TRANSFER_SOURCE_BANK = 'bank';

    // console.log('currentBalance', currentBalance)
    const dispatch = useDispatch();
    const {
      userWallet,
      plaidUserAccount,
      transferFromBenjiToBank,
      transferByBank,
    } = useSelector((state) => state.User);
    const { plaidCompanyAccount } = useSelector((state) => state.Company);
    const { userHistoryPayment } = useSelector((state) => state.Wallet);

    const { companyId } = useSelector((state) => state.AccountBoard);
    const [currentWidthInput, setCurrentWidthInput] = useState(135);
    const [amountInput, setValueAmountInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [allowPayment, setAllowPayment] = useState(false);
    const [transferItems, setTransferItems] = useState([]);
    // const [transferItemsInited, setTransferItemsInited] = useState(false);
    const [transferSource, setTransferSource] = useState(
      TRANSFER_SOURCE_WALLET
    );
    const [visibleChangeBankModal, setVisibleChangeBankModal] = useState(false);
    const [selectedBank, setSelectedBank] = useState(null);

    // Construct bank accounts array
    let bankAccounts = [];
    if (hasPersonalWallet && plaidUserAccount.account.length > 0) {
      bankAccounts = plaidUserAccount.account;
    } else if (
      plaidCompanyAccount.account &&
      plaidCompanyAccount.account.length > 0
    ) {
      bankAccounts = plaidCompanyAccount.account;
    }

    const transferMoney = () => {
      setLoading(true);
      const transferAmount = convertCurrencyToCent(
        parseFloat(formatOriginalNumber(amountInput))
      );

      if (transferSource === TRANSFER_SOURCE_WALLET) {
        // Transferring money from Buddi wallet to Buddi bank
        if (hasPersonalWallet) {
          const dataPayload = {
            amount: transferAmount,
            account_id: selectedBank.id,
            note: '',
          };
          dispatch(transferFromBenjiToBankAccount(dataPayload));
        } else {
          const dataPayload = {
            from_company: parseInt(companyId),
            account_id: selectedBank.id,
            amount: transferAmount,
            note: '',
          };
          dispatch(transferFromBenjiToBankAccount(dataPayload));
        }
      } else {
        if (hasPersonalWallet) {
          // Transferring money from Buddi bank to personal wallet
          const dataPayload = {
            account_id: selectedBank.id,
            amount: transferAmount,
            note: '',
          };
          dispatch(transferMoneyByBankAccount(dataPayload));
        } else {
          // Transferring money from Buddi bank to company wallet
          const dataPayload = {
            account_id: selectedBank.id,
            from_company: companyId,
            amount: transferAmount,
            note: '',
          };
          dispatch(transferMoneyByBankAccount(dataPayload));
        }
      }
    };

    useEffect(() => {
      if (
        !transferFromBenjiToBank.loading &&
        transferFromBenjiToBank.success &&
        allowPayment
      ) {
        refreshWallet();
      } else if (
        transferFromBenjiToBank &&
        !transferFromBenjiToBank.loading &&
        transferFromBenjiToBank.error
      ) {
        setLoading(false);
        setAllowPayment(false);
        if (transferFromBenjiToBank.error.message) {
          notify('error', transferFromBenjiToBank.error.message);
        } else {
          notify(
            'error',
            'Unable to complete transaction, please try again later.'
          );
        }
      }
    }, [transferFromBenjiToBank]);

    useEffect(() => {
      if (!transferByBank.loading && transferByBank.success && allowPayment) {
        refreshWallet();
      } else if (
        transferByBank &&
        !transferByBank.loading &&
        transferByBank.error
      ) {
        setLoading(false);
        setAllowPayment(false);
        if (transferByBank.error.message) {
          notify('error', transferByBank.error.message);
        } else {
          notify(
            'error',
            'Unable to complete transaction, Please try again later.'
          );
        }
      }
    }, [transferByBank]);

    //refresh data wallet
    useEffect(() => {
      if (
        visible &&
        !userHistoryPayment.loading &&
        allowPayment &&
        ((!transferByBank.loading && transferByBank.success) ||
          (!transferFromBenjiToBank.loading && transferFromBenjiToBank.success))
      ) {
        setValueAmountInput('');
        setLoading(false);
        setAllowPayment(false);
        if (transferSource === TRANSFER_SOURCE_WALLET) {
          const dataSuccess = {
            amount: amountInput,
            transferSource: TRANSFER_SOURCE_WALLET,
          };
          handleSuccess(dataSuccess);
        } else {
          const dataSuccess = {
            amount: amountInput,
            transferSource: TRANSFER_SOURCE_BANK,
          };
          handleSuccess(dataSuccess);
        }
      }
    }, [userHistoryPayment]);

    const refreshWallet = () => {
      setTimeout(() => {
        if (companyId === null || companyId === 'null') {
          dispatch(getUserWallet());
          dispatch(getHistoryPayment(null, {}));
        } else {
          dispatch(getCompanyWallet(companyId));
          dispatch(getHistoryPayment(companyId, {}));
        }
      }, 1000);
    };

    const checkIsTransferAllowed = (amount) => {
      if (!amount) {
        setAllowPayment(false);
      } else {
        if (
          parseInt(amount) > parseInt(currentBalance) &&
          transferSource === TRANSFER_SOURCE_WALLET
        ) {
          setAllowPayment(false);
        } else {
          setAllowPayment(true);
        }
      }
    };

    const handleChange = (e) => {
      const { value } = e.target;
      if (value == '') {
        setValueAmountInput(value);
        setCurrentWidthInput(135);
      } else if (amountInput.length < 10) {
        let amountInput = formatInputNumber(value);
        if (amountInput) {
          let amount = formatOriginalNumber(amountInput);
          if (amountInput.length >= 3) {
            let newWidth = 135 + (amountInput.length - 3) * 19;
            setCurrentWidthInput(newWidth);
          } else {
            setCurrentWidthInput(135);
          }
          setValueAmountInput(amountInput);
          checkIsTransferAllowed(amount);
        }
      }
    };

    const renderBenjiBalance = () => {
      let hasWarning = false;
      let amount = formatOriginalNumber(amountInput);
      if (
        transferSource === TRANSFER_SOURCE_WALLET &&
        parseInt(amount) > convertCurrencyToDollar(currentBalance)
      ) {
        hasWarning = true;
      }
      let moneyFormat = formatMoney(convertCurrencyToDollar(currentBalance));
      return (
        <p className='bank-title'>
          <span className={hasWarning ? 'even-number warning' : 'even-number'}>
            ${moneyFormat.evenMoney}
          </span>
          <span
            className={hasWarning ? 'small-number warning' : 'small-number'}
          >
            .{moneyFormat.pence}
          </span>
          <span className={hasWarning ? 'warning' : ''}>
            {hasWarning ? ' Exceed your available' : ' available'}
          </span>
        </p>
      );
    };

    const renderTransferAmount = () => {
      let moneyFormat = formatMoney(amountInput);
      return (
        <p className='footer-text'>
          <span className='even-number'>${moneyFormat.evenMoney}</span>
          <span className='small-number'>.{moneyFormat.pence}</span>
        </p>
      );
    };

    const renderTotalAmountTransfer = () => {
      let moneyFormat = formatMoney(amountInput);
      return `$` + moneyFormat.evenMoney + '.' + moneyFormat.pence;
    };

    const renderBankCard = () => {
      let bankAccount;
      if (!selectedBank) {
        bankAccount = bankAccounts[0];
        setSelectedBank(bankAccount);
      } else {
        bankAccount = selectedBank;
      }

      return (
        <div className='bank-title-view'>
          <p className='bank-title'>{bankAccount.accountName}</p>
          <p className='bank-title bank-title-small'>
            <span>Savings</span>
            <span className={'bank-title-account-number'}>
              {bankAccount.accountNumber}
            </span>
          </p>
        </div>
      );
    };

    const shuffleTransferBlocks = () => {
      const transferSource = transferItems[1].name;
      setTransferTo(
        transferSource === TRANSFER_SOURCE_BANK
          ? TRANSFER_SOURCE_WALLET
          : TRANSFER_SOURCE_BANK
      );
      setTransferSource(transferSource);
      // setTransferItemsInited(false);

      checkIsTransferAllowed(formatOriginalNumber(amountInput));
    };

    const initTransferItems = () => {
      const transferItemBlocks = [
        {
          name: TRANSFER_SOURCE_WALLET,
          content: (
            <div className='link-bank-wallet '>
              <div className='company-icon cover-icon-purple'>
                <Icon src={AcceptedIcon} width={15} height={29} />
              </div>
              <div className='bank-title-view'>
                <p className='bank-title'>Buddi Wallet balance</p>
                {renderBenjiBalance()}
              </div>
            </div>
          ),
        },
        {
          name: TRANSFER_SOURCE_BANK,
          content: (
            <>
              <div className='link-bank-wallet'>
                <div className='cover-icon'>
                  <img src={CardIcon} alt='Bank' />
                </div>
                {renderBankCard()}
              </div>
              <Button
                type={'link'}
                className={
                  bankAccounts.length === 1
                    ? 'change-bank-btn bank-disable'
                    : 'change-bank-btn'
                }
                onClick={() => {
                  openChangeBankModal();
                }}
                disabled={bankAccounts.length === 1}
              >
                Change
              </Button>
            </>
          ),
        },
      ];
      const firstTransferItemBlockIndex = transferItemBlocks.findIndex(
        (transferItemBlock) => {
          return transferItemBlock.name === transferSource;
        }
      );
      const secondTransferItemBlockIndex =
        firstTransferItemBlockIndex === 1 ? 0 : 1;

      setTransferItems([
        transferItemBlocks[firstTransferItemBlockIndex],
        transferItemBlocks[secondTransferItemBlockIndex],
      ]);
    };

    const openChangeBankModal = () => {
      setVisibleChangeBankModal(true);
    };

    const closeChangeBankModal = () => {
      setVisibleChangeBankModal(false);
    };

    const selectBank = (selectedBankId) => {
      if (selectedBankId !== selectedBank.id) {
        const selectedBankAccount = bankAccounts.filter((bankAccount) => {
          return bankAccount.id === selectedBankId;
        })[0];
        setSelectedBank(selectedBankAccount);

        // Set transferItemsInited to false for re-rendering transfer bank account
        // setTransferItemsInited(false);
      }

      closeChangeBankModal();
    };

    useEffect(() => {
      initTransferItems();
    }, [currentBalance, transferSource, selectedBank, amountInput]);

    React.useImperativeHandle(ref, () => ({
      setInitialState() {
        console.log('here');
        setCurrentWidthInput(135);
        setValueAmountInput('');
        setLoading(false);
        setAllowPayment(false);
        setTransferSource(TRANSFER_SOURCE_WALLET);
        setVisibleChangeBankModal(false);
        setSelectedBank(null);
      },
    }));

    return (
      <TransferFundsWrapper>
        <div className='content'>
          <p className='content-text'>Transfer amount</p>
          <div className='input-view'>
            <Input
              allowClear
              placeholder='0.00'
              prefix='$'
              onChange={(e) => handleChange(e)}
              value={amountInput}
              style={{ width: currentWidthInput }}
            />
          </div>
          <FeeSelectorRadio />
          <Row>
            <Col xs={24} sm={10} md={10}>
              <p className='transfer-text'>Transfer From:</p>
            </Col>
            <Col xs={24} sm={4} md={4}></Col>
            <Col xs={24} sm={10} md={10}>
              <p className='transfer-text'>Transfer To:</p>
            </Col>
          </Row>
          <Row>
            <FlipMove
              staggerDurationBy='30'
              duration={500}
              enterAnimation={'accordionHorizontal'}
              leaveAnimation={'accordionHorizontal'}
              typeName={null}
            >
              {transferItems.map((item, index) => {
                const order = index === 1 ? 3 : 1;
                return (
                  <Col
                    xs={24}
                    sm={10}
                    md={10}
                    key={'transfer-item-' + item.name}
                    order={order}
                  >
                    {item.content}
                  </Col>
                );
              })}
              <Col xs={24} sm={4} md={4} order={2}>
                <div className='flip-transfers-button-container'>
                  <Button
                    type={'link'}
                    className={'flip-transfers-button'}
                    icon={<img alt={'beat-arrows-ic'} src={BentArrows} />}
                    onClick={shuffleTransferBlocks}
                  />
                </div>
              </Col>
            </FlipMove>
          </Row>
          <p className='content-bottom-text'>
            All transfers are subject to review and could be delayed or stopped
            if we identify an issue.
          </p>
        </div>
        <div className='footer'>
          <div className='footer-table'>
            <Row>
              <Col xs={12} className='footer-text-left'>
                Transfer amount
              </Col>
              <Col xs={12}>{renderTransferAmount()}</Col>
            </Row>
            <Row>
              <Col xs={12} className='footer-text-left'>
                Fee
              </Col>
              <Col xs={12}>
                <p className='footer-text'>
                  <span className='even-number'>$0</span>
                  <span className='small-number'>.00</span>
                </p>
              </Col>
            </Row>
            <div className='footer-delimiter'></div>
            <Row>
              <Col xs={12} className='footer-text-left'>
                You'll get
              </Col>
              <Col xs={12}>{renderTransferAmount()}</Col>
            </Row>
          </div>
          <div className='footer-button-container'>
            <Button
              className={
                allowPayment ? 'buttonWrap' : 'buttonWrap disableButton'
              }
              type='primary'
              shape='round'
              disabled={!allowPayment}
              onClick={() => {
                transferMoney();
              }}
              loading={loading}
            >
              Transfer {renderTotalAmountTransfer()} Now
            </Button>
          </div>
        </div>
        <WrapperModal
          visible={visibleChangeBankModal}
          title='Change Bank'
          onCancel={closeChangeBankModal}
          footer={null}
          width={540}
          className={'change-bank-modal'}
        >
          <ChangeBank
            bankAccounts={bankAccounts}
            onCancel={closeChangeBankModal}
            selectBank={selectBank}
            selectedBank={selectedBank}
            plaidLinkToken={plaidLinkToken}
            onAddNewBankSuccess={onAddNewBankSuccess}
          />
        </WrapperModal>
      </TransferFundsWrapper>
    );
  }
);

export default TransferFunds;
