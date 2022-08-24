import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Col, Row } from 'antd';
import Modal from '@iso/components/Modal';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import WalletContent, {
  EmptyWallet,
  LoadingWallet,
  WrapperModal,
} from './Wallet.style';
import basicStyle from '@iso/assets/styles/constants';
import BuddiLogo from '@iso/assets/images/benji-wallet.png';
import IconSend from '@iso/assets/images/ic_send.svg';
import IconRequest from '@iso/assets/images/ic_request.svg';
import IconHistory from '@iso/assets/images/ic_history.svg';
import Button from '@iso/components/uielements/button';
import BankIcon from '@iso/assets/images/bank.svg';
import IconActivity from '@iso/assets/images/ic_activity.svg';
import IconBankLink from '@iso/assets/images/ic_card.svg';
import IconPlus from '@iso/assets/images/ic_plus.svg';
import BuddiWallet from '@iso/assets/images/BuddiWallet.png';
import SendPayment from './SendPayment';
import SendPaymentContinue from './SendPaymentContinue';
import useWindowSize from '@iso/lib/hooks/useWindowSize';
import TransferFunds from './TransferFunds';
import TransferHistory from './TransferHistory';
import TransferFundSuccess from './TransferFundSuccess';
import RequestPaymentConfirm from './RequestPaymentConfirm';
import { usePlaidLink } from 'react-plaid-link';
import { WalletStatus, WalletAccessRole } from '@iso/enums/wallet_status';
import {
  convertCurrencyToDollar,
  formatMoney,
} from '@iso/lib/helpers/numberUtil';
import {
  getPlaidLinkUserToken,
  getPlaidUserAccount,
  getUserWallet,
  removePlaidUserAccount,
} from '@iso/redux/user/actions';
import {
  getCompanyWallet,
  getPlaidCompanyAccount,
  getPlaidLinkCompanyToken,
  removePlaidCompanyAccount,
} from '@iso/redux/company/actions';

import {
  declineRequestPaymentSila,
  getHistoryPayment,
  getListRequestPaymentSila,
} from '@iso/redux/wallet/actions';

import { requestListMembers } from '@iso/redux/user/actions';

import _ from 'lodash';
import notify from '@iso/lib/helpers/notify';
import Spin from '@iso/components/uielements/spin';
import DotIcon from '@iso/assets/images/dot-icon.svg';
import TransferItem from './View/TransferItem';
import RequestPaymentItem from './View/RequestPaymentItem';
import YourRequestPaymentItem from './View/YourRequestPaymentItem';
import ConfirmModal from '@iso/components/Modals/Confirm';
import PlaidIcon from '@iso/assets/images/plaid.svg';
import AddManualBank from './AddManualBank/AddManualBank';
import LinkBankSuccess from './LinkBankSuccess';
import BusinessMembersComponent from './RoleMember/BusinessMembersComponent';
import { getFileTransactionFdf } from '@iso/redux/wallet/actions';

const { rowStyle, gutter } = basicStyle;

const OpenPlaidLink = ({ token, onSuccess, onExit }) => {
  const config = {
    token: token,
    onSuccess,
    onExit,
  };
  const { open, ready } = usePlaidLink(config);
  return (
    <Button type='link' onClick={() => open()} disabled={!ready}>
      <div className='account-icon'>
        <img src={PlaidIcon} alt='Bank' height={56} />
        <div className='plus-icon'>
          <img src={IconPlus} alt='Plus' height={5} />
        </div>
      </div>
      <p className='title-link-account'>Link via Plaid</p>
    </Button>
  );
};

const Wallet = () => {
  let history = useHistory();
  const dispatch = useDispatch();
  const childRef = useRef();

  const {
    user,
    userWallet,
    plaidLink,
    plaidUserAccount,
    accountUserRemove,
    silaKYC,
    listMembers,
  } = useSelector((state) => state.User);
  const { userHistoryPayment, listRequestPayment, declinePayment } =
    useSelector((state) => state.Wallet);
  const {
    companyWallet,
    plaidLinkKYB,
    plaidCompanyAccount,
    accountCompanyRemove,
    silaKYB,
    company,
  } = useSelector((state) => state.Company);
  const { companies } = useSelector((state) => state.Auth.user);
  const { companyId } = useSelector((state) => state.AccountBoard);
  const [isVisibleSendPayment, setVisibleSendPayment] = useState(false);
  const [plaidLinkToken, setPlaidLinkToken] = useState(null);
  const [userReceivePayment, setUserReceivePayment] = useState(null);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [refreshWalletAmount, setRefreshWalletAmount] = useState(true);
  const [hasOpenHistoryItem, setOpenHistoryItem] = useState(false);
  const [hasRemoveBankAccount, setRemoveBankAccount] = useState(false);
  const [itemBankAccountRemove, setItemBankAccountRemove] = useState({});
  const [hasDeclineRequestPayment, setDeclineRequestPayment] = useState(false);
  const [plaidAccount, setPlaidAccount] = useState([]);
  const [isVisibleContinueProcessPayment, setVisibleContinueProcessPayment] =
    useState(false);
  const [visibleLinkBankSuccess, setVisibleLinkBankSuccess] = useState(false);
  const [visibleAddBankCard, setVisibleAddBankCard] = useState(false);
  const [currentHistoryItem, setCurrentHistoryItem] = useState([]);
  const [bankCardNumber, setBankCardNumber] = useState('');
  const [transferTo, setTransferTo] = useState('bank');
  const sendPayment = () => {
    setVisibleSendPayment(true);
  };
  const requestPayment = () => {
    setVisibleRequestPayment(true);
  };
  const requestPaymentConfirm = () => {
    setVisibleRequestPaymentConfirm(true);
  };
  const { width } = useWindowSize();
  const [visibleTransferFunds, setVisibleTransferFunds] = useState(false);
  const [hasPersonalWallet, setHasPersonalWallet] = useState(
    companyId == null ? true : false
  );
  const [visibleTransferHistory, setVisibleTransferHistory] = useState(false);
  const [visibleSendMessage, setVisibleSendMessage] = useState(false);
  const [dataMessage, setDataMessage] = useState({});
  const [visibleTransferFundsSuccess, setVisibleTransferFundsSuccess] =
    useState(false);
  const [visibleRequestPayment, setVisibleRequestPayment] = useState(false);
  const [visibleRequestPaymentConfirm, setVisibleRequestPaymentConfirm] =
    useState(false);
  const [visibleRequestPaymentSuccess, setVisibleRequestPaymentSuccess] =
    useState(false);

  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    if (
      !userWallet.loading &&
      !companyWallet.loading &&
      !plaidAccount.loading &&
      !plaidCompanyAccount.loading &&
      !listRequestPayment.loading &&
      !userHistoryPayment.loading
    ) {
      if (loadingAccount) {
        setLoadingAccount(false);
        if (refreshWalletAmount) {
          setRefreshWalletAmount(false);
        }
      } else if (refreshWalletAmount) {
        setRefreshWalletAmount(false);
      }
    }
  }, [userWallet, plaidAccount, listRequestPayment, userHistoryPayment]);

  useEffect(() => {
    if (allowAccessWallet(true)) {
      setHasPersonalWallet(true);
      dispatch(getPlaidLinkUserToken());
    } else if (allowAccessWallet(false)) {
      setHasPersonalWallet(false);
      if (!hasCompanyMember()) {
        dispatch(
          getPlaidLinkCompanyToken({
            id: companyId,
            plaidToken: null,
            accounts: null,
          })
        );
      }
    }
  }, [silaKYC, silaKYB]);

  useEffect(() => {
    if (allowAccessWallet(true)) {
      if (plaidLink && plaidLink.token && plaidLink.token.linkToken) {
        setPlaidLinkToken(plaidLink.token.linkToken);
      } else if (plaidLink && plaidLink.connected) {
        dispatch(getPlaidUserAccount());
      } else if (plaidLink && plaidLink.error) {
        setLoadingAccount(false);
        notify('error', 'Can not get link token KYC');
      }
    } else if (allowAccessWallet(false)) {
      if (plaidLinkKYB && plaidLinkKYB.token && plaidLinkKYB.token.linkToken) {
        setPlaidLinkToken(plaidLinkKYB.token.linkToken);
      } else if (plaidLinkKYB && plaidLinkKYB.connected) {
        dispatch(getPlaidCompanyAccount(companyId));
      } else if (plaidLinkKYB && plaidLinkKYB.error) {
        setLoadingAccount(false);
        notify('error', 'Can not get link token KYB');
      }
    }
  }, [plaidLink, plaidLinkKYB]);

  useEffect(() => {
    if (companyId == null || companyId == 'null') {
      if (accountUserRemove && accountUserRemove.success) {
        dispatch(getPlaidUserAccount());
      } else if (accountUserRemove && accountUserRemove.error) {
        setLoadingAccount(false);
        if (accountUserRemove.error && accountUserRemove.error.message) {
          notify('error', accountUserRemove.error.message);
        } else {
          notify('error', 'Can not remove your Bank User Account');
        }
      }
    } else {
      if (accountCompanyRemove && accountCompanyRemove.success) {
        dispatch(getPlaidCompanyAccount(companyId));
      } else if (accountCompanyRemove && accountCompanyRemove.error) {
        setLoadingAccount(false);
        if (accountCompanyRemove.error && accountCompanyRemove.error.message) {
          notify('error', accountCompanyRemove.error.message);
        } else {
          notify('error', 'Can not remove your Bank Bandleader');
        }
      }
    }
  }, [accountUserRemove, accountCompanyRemove]);

  useEffect(() => {
    if (companyId == null || companyId == 'null') {
      if (plaidUserAccount && plaidUserAccount.account) {
        setPlaidAccount(plaidUserAccount.account);
      } else if (plaidUserAccount && plaidUserAccount.error) {
        setLoadingAccount(false);
        if (plaidUserAccount.error && plaidUserAccount.error.message) {
          notify('error', plaidUserAccount.error.message);
        } else {
          notify('error', 'Can not link your Bank User Account');
        }
      }
    } else {
      if (plaidCompanyAccount && plaidCompanyAccount.account) {
        setPlaidAccount(plaidCompanyAccount.account);
      } else if (plaidCompanyAccount && plaidCompanyAccount.error) {
        setLoadingAccount(false);
        if (plaidCompanyAccount.error && plaidCompanyAccount.error.message) {
          notify('error', plaidCompanyAccount.error.message);
        } else {
          notify('error', 'Can not link your Bank Bandleader');
        }
      }
    }
  }, [plaidUserAccount, plaidCompanyAccount]);

  const onExit = (error, metadata) => {};
  const onSuccess = (public_token, metadata) => {
    if (companyId == null || companyId == 'null') {
      const payload = {
        public_token: public_token,
        accounts: metadata.accounts,
      };
      dispatch(getPlaidLinkUserToken(payload));
    } else {
      const payload = {
        id: companyId,
        plaidToken: public_token,
        accounts: metadata.accounts,
      };
      dispatch(getPlaidLinkCompanyToken(payload));
    }
  };

  useEffect(() => {
    if (
      !userWallet.loading &&
      userWallet.wallet &&
      (companyId == null || companyId == 'null') &&
      !hasOpeningPopup()
    ) {
      setHasPersonalWallet(true);
      setRefreshWalletAmount(true);
      dispatch(getHistoryPayment(null, {}));
      dispatch(getListRequestPaymentSila());
    }
  }, [userWallet]);

  useEffect(() => {
    if (
      !companyWallet.loading &&
      companyWallet.wallet &&
      companyId !== null &&
      companyId !== 'null' &&
      !hasOpeningPopup()
    ) {
      setRefreshWalletAmount(true);
      setHasPersonalWallet(false);
      let payload = { company_id: companyId };
      dispatch(getHistoryPayment(companyId, {}));
      dispatch(getListRequestPaymentSila(payload));
      if (!hasCompanyMember()) {
        dispatch(requestListMembers(payload));
      }
    }
  }, [companyWallet]);

  useEffect(() => {
    if (
      !declinePayment.loading &&
      declinePayment.success &&
      !hasOpeningPopup()
    ) {
      refreshWallet();
    }
  }, [declinePayment]);

  const refreshWallet = () => {
    setRefreshWalletAmount(true);
    if (hasPersonalWallet) {
      dispatch(getUserWallet());
      dispatch(getHistoryPayment(null, {}));
      dispatch(getListRequestPaymentSila());
    } else {
      dispatch(getCompanyWallet(companyId));
      let payload = { company_id: companyId };
      dispatch(getHistoryPayment(companyId, {}));
      dispatch(getListRequestPaymentSila(payload));
    }
  };

  useEffect(() => {
    if (
      hasPersonalWallet &&
      userWallet.wallet &&
      userWallet.wallet.hasOwnProperty('balance')
    ) {
      setCurrentBalance(userWallet.wallet.balance);
    } else if (
      !hasPersonalWallet &&
      companyWallet.wallet &&
      companyWallet.wallet.hasOwnProperty('balance')
    ) {
      setCurrentBalance(companyWallet.wallet.balance);
    }
  }, [userWallet, companyWallet]);

  const hasOpeningPopup = () => {
    if (
      visibleRequestPaymentConfirm ||
      visibleTransferFunds ||
      isVisibleSendPayment ||
      isVisibleContinueProcessPayment
    ) {
      return true;
    }
    return false;
  };

  const hasCompanyMember = () => {
    let isMember = false;
    for (let i = 0; i < companies.length; i++) {
      if (
        companies[i].id.toString() === companyId &&
        (companies[i].relationship === WalletAccessRole.ADMIN ||
          companies[i].relationship === WalletAccessRole.BENEFICIAL_OWNER ||
          companies[i].relationship === WalletAccessRole.CONTROLLING_OFFICER ||
          companies[i].relationship === WalletAccessRole.CONTRACTOR_PRODUCER ||
          companies[i].relationship === WalletAccessRole.BUSINESS_MEMBER)
      ) {
        isMember = true;
        break;
      }
    }
    return isMember;
  };

  const hasCompanyOwner = () => {
    let isOwner = false;
    for (let i = 0; i < companies.length; i++) {
      if (
        companies[i].id.toString() === companyId &&
        companies[i].relationship === 'OWNER'
      ) {
        isOwner = true;
        break;
      }
    }
    return isOwner;
  };
  
  const allowAccessWallet = (accessUserWallet) => {
    if (accessUserWallet) {
      if (
        (companyId == null || companyId == 'null') &&
        silaKYC.silaKYC &&
        silaKYC.silaKYC.verificationStatus == WalletStatus.Success
      ) {
        return true;
      }
      return false;
    } else {
      if (
        (silaKYB.silaKYB &&
        silaKYB.silaKYB.id &&
        silaKYB.silaKYB.verificationStatus == WalletStatus.Success) ||
        hasCompanyMember()
      ) {
        return true;
      }
      return false;
    }
  };

  const renderBalanceWallet = () => {
    let moneyFormat = formatMoney(convertCurrencyToDollar(currentBalance));
    return (
      <div className='total-balance'>
        <p className='title-wallet'>Balance</p>
        <p>
          <span className='even-number'>${moneyFormat.evenMoney}</span>
          <span className='small-number'>.{moneyFormat.pence}</span>
        </p>
      </div>
    );
  };

  const openHistoryPage = () => {
    if (userWallet.wallet && (companyId == null || companyId == 'null')) {
      history.push('wallet/history');
    } else {
      history.push(`/companies/${companyId}/wallet/history`);
    }
  };

  const openHistoryTransfer = (viewAllHistory, currentHistoryItem = {}) => {
    setOpenHistoryItem(!viewAllHistory);
    setVisibleTransferHistory(true);
    if (viewAllHistory) {
      let data = userHistoryPayment.data.slice(0, 10);
      setCurrentHistoryItem(data);
    } else if (currentHistoryItem) {
      setCurrentHistoryItem([currentHistoryItem]);
    }
  };

  const linkBankOption = (flag, bank) => {
    setRemoveBankAccount(flag);
    setItemBankAccountRemove(bank);
  };

  const handleDeleteAccount = () => {
    setRemoveBankAccount(false);
    setRefreshWalletAmount(true);
    if (companyId == null || companyId == 'null') {
      let payload = {
        account_id: itemBankAccountRemove.id,
      };
      dispatch(removePlaidUserAccount(payload));
    } else {
      let payload = {
        company_id: companyId,
        account_id: itemBankAccountRemove.id,
      };
      dispatch(removePlaidCompanyAccount(payload));
    }
  };

  const handleCancelRequestPaymentByOwner = (data) => {
    setDeclineRequestPayment(false);
    setRefreshWalletAmount(true);
    if (companyId == null || companyId == 'null') {
      let payload = {
        payment_id: data.payment_id,
        ownerRequest: true,
        status: 'hidden',
      };
      dispatch(declineRequestPaymentSila(payload));
    } else {
      let payload = {
        company_id: companyId,
        payment_id: data.payment_id,
        ownerRequest: true,
        status: 'hidden',
      };
      dispatch(declineRequestPaymentSila(payload));
    }
  };

  const handleProceedPayment = (data) => {
    setUserReceivePayment(data);
    setVisibleSendPayment(false);
    setVisibleContinueProcessPayment(true);
  };

  const removeActivityPayment = (data, ownerRequest) => {
    if (companyId == null || companyId == 'null') {
      let payload = {
        payment_id: data.payment_id,
        ownerRequest: ownerRequest,
        status: 'hidden',
      };
      dispatch(declineRequestPaymentSila(payload));
    } else {
      let payload = {
        company_id: companyId,
        payment_id: data.payment_id,
        ownerRequest: ownerRequest,
        status: 'hidden',
      };
      dispatch(declineRequestPaymentSila(payload));
    }
  };

  const handleCancelPayment = (data) => {
    setDataMessage(data);
    setDeclineRequestPayment(true);
  };

  const onCloseAddBankCard = (hasAddedSuccess = false, bankCardNumber) => {
    setVisibleAddBankCard(false);
    if (hasAddedSuccess) {
      setBankCardNumber(bankCardNumber);
      setVisibleLinkBankSuccess(true);
    }
  };

  const onCloseLinkBankSuccess = () => {
    setVisibleLinkBankSuccess(false);
  };

  const handleDownload = (transferID, type) => {
    dispatch(getFileTransactionFdf({ transferID, type }));
  };

  const renderRecentlyActivities = () => {
    if (userHistoryPayment.data && userHistoryPayment.data.length > 0) {
      let dataRender = userHistoryPayment.data.slice(0, 5);
      return (
        <>
          {dataRender.map((transaction, index) => (
            <div
              className={
                index == dataRender.length - 1
                  ? 'transfer-item'
                  : 'transfer-item borderItem'
              }
              key={index}
            >
              <TransferItem
                openHistory={() => openHistoryTransfer(false, transaction)}
                transferItem={transaction}
                companyId={companyId}
              />
            </div>
          ))}
        </>
      );
    }

    return (
      <div>
        <span>
          See when money comes in, and when it goes out. You'll find your recent
          Buddi Wallet activity here.
        </span>
      </div>
    );
  };

  const renderRequestPaymentActivities = () => {
    if (
      listRequestPayment.data &&
      listRequestPayment.data.recv &&
      listRequestPayment.data.recv.length > 0
    ) {
      const data = _.cloneDeep(listRequestPayment.data.recv);
      let dataRender = data.reverse().slice(0, 5);
      return (
        <>
          {dataRender.map((transaction, index) => (
            <div
              className={
                index < dataRender.length - 1 && dataRender.length > 1
                  ? 'borderItemNormal'
                  : ''
              }
              key={index}
            >
              <RequestPaymentItem
                transferItem={transaction}
                handleProceedPayment={handleProceedPayment}
                removeActivityPayment={removeActivityPayment}
              />
            </div>
          ))}
        </>
      );
    }
  };

  const renderYourRequestPaymentActivities = () => {
    if (
      listRequestPayment.data &&
      listRequestPayment.data.sent &&
      listRequestPayment.data.sent.length > 0
    ) {
      const data = _.cloneDeep(listRequestPayment.data.sent);
      const dataYourRequestPayment = data.reverse().slice(0, 5);
      return (
        <>
          {dataYourRequestPayment.map((transaction, index) => (
            <div
              className={
                index < dataYourRequestPayment.length - 1 &&
                dataYourRequestPayment.length > 1
                  ? 'borderItemNormal'
                  : ''
              }
              key={index}
            >
              <YourRequestPaymentItem
                transferItem={transaction}
                handleCancelPayment={handleCancelPayment}
                removeActivityPayment={removeActivityPayment}
              />
            </div>
          ))}
        </>
      );
    }
  };

  if (loadingAccount) {
    return (
      <LoadingWallet>
        <Spin spinning={true}></Spin>
      </LoadingWallet>
    );
  } else if (
    (hasPersonalWallet &&
      !allowAccessWallet(true) &&
      !loadingAccount &&
      userWallet.wallet != null) ||
    (!hasPersonalWallet &&
      !allowAccessWallet(false) &&
      !loadingAccount &&
      companyWallet.wallet != null) ||
    (!hasCompanyOwner() && !hasPersonalWallet &&
      companyWallet.wallet &&
      companyWallet.wallet.length < 1)
  ) {
    return (
      <EmptyWallet>
        <img src={BuddiWallet} alt='BuddiIcon' />
        {hasCompanyOwner() ? (
          <>
            <h2>Your wallet is not registered yet.</h2>
            <p>Please sign up for your wallet</p>
          </>
        ) : (
          <>
            <h2>Your wallet is not registered yet.</h2>
            <p>Please contact the company owner.</p>
          </>
        )}
      </EmptyWallet>
    );
  }
  return (
    <Spin spinning={refreshWalletAmount}>
      <LayoutContentWrapper>
        <WalletContent>
          <Row style={rowStyle} gutter={gutter} justify='start'>
            <Col md={12} sm={24} xs={24} className='wallet-info'>
              <div className='walletInfo'>
                <div className='wallet-shadow'></div>
                <div className='top-content'>
                  <div className='benji-logo'>
                    <img src={BuddiLogo} />
                  </div>
                  <div className='wallet-action'>
                    <div className='button-wallet'>
                      <Button type='link' onClick={() => sendPayment()}>
                        <div className='icon-circle-border'>
                          <img src={IconSend} alt='Sent' />
                        </div>
                        <p className='title'>Send</p>
                      </Button>
                    </div>
                    <div className='button-wallet button-wallet-padding'>
                      <Button type='link' onClick={() => requestPayment()}>
                        <div className='icon-circle-border'>
                          <img src={IconRequest} alt='Request' />
                        </div>
                        <p className='title'>Request</p>
                      </Button>
                    </div>
                    <div className='button-wallet'>
                      <Button type='link' onClick={() => openHistoryPage()}>
                        <div className='icon-circle-border'>
                          <img
                            src={IconHistory}
                            alt='History'
                            className='historyIcon'
                          />
                        </div>
                        <p className='title'>History</p>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className='border-line' />
                <div className='balance'>
                  {renderBalanceWallet()}
                  <div className='transfer-view'>
                    <Button
                      className='bank-button'
                      type='ghost'
                      shape='round'
                      onClick={() => {
                        if (
                          (hasPersonalWallet &&
                            plaidUserAccount.account &&
                            plaidUserAccount.account.length > 0) ||
                          (!hasPersonalWallet &&
                            plaidCompanyAccount.account &&
                            plaidCompanyAccount.account.length > 0)
                        ) {
                          setVisibleTransferFunds(true);
                        }
                      }}
                    >
                      Transfer Funds
                    </Button>
                  </div>
                </div>
              </div>
              <div className='walletHistory'>
                <p className='title-header recent-activity'>Recent activity</p>
                <div className='content-activity request-payment-activity'>
                  {renderRequestPaymentActivities()}
                </div>
                <div className='content-activity request-payment-activity'>
                  {renderYourRequestPaymentActivities()}
                </div>
                <div className='content-activity'>
                  {renderRecentlyActivities()}
                  <div className='border-activity' />
                  <div>
                    <Button
                      type='link'
                      className={
                        !userHistoryPayment.data ||
                        userHistoryPayment.data.length == 0
                          ? 'activity-button disableButton'
                          : 'activity-button'
                      }
                      onClick={() => openHistoryPage()}
                      disabled={
                        !userHistoryPayment.data ||
                        userHistoryPayment.data.length == 0
                      }
                    >
                      <img src={IconActivity} alt='Request' />
                      View recent activity
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={12} sm={24} xs={24} className='walletAccount'>
              <div className='account-view'>
                <p className='title-header'>Linked accounts</p>
              </div>
              <div className='content-activity'>
              {hasCompanyOwner() && (
                <div className='wallet-account'>
                  {plaidLinkToken ? (
                    <div className='button-bank-link'>
                      <OpenPlaidLink
                        token={plaidLinkToken}
                        onExit={onExit}
                        onSuccess={onSuccess}
                      />
                    </div>
                  ) : (
                    <div className='button-bank-link disableButton'>
                      <Button type='link' disabled={true}>
                        <div className='account-icon'>
                          <img src={PlaidIcon} alt='Bank' height={56} />

                          <div className='plus-icon'>
                            <img src={IconPlus} alt='Plus' height={5} />
                          </div>
                        </div>
                        <p className='title-link-account'>Link via Plaid</p>
                      </Button>
                    </div>
                  )}

                  <div className='button-bank-link '>
                    <Button
                      type='link'
                      onClick={() => setVisibleAddBankCard(true)}
                    >
                      <div className='account-icon'>
                        <img src={BankIcon} alt='Bank' height={56} />
                        <div className='plus-icon'>
                          <img src={IconPlus} alt='Plus' height={5} />
                        </div>
                      </div>
                      <p className='title-link-account'>Link a Bank</p>
                    </Button>
                  </div>
                </div>
                )}
                
                {plaidAccount.length > 0 && (
                  <>
                    {hasCompanyOwner() && <div className='border-activity' />}
                    {plaidAccount.map((bank, index) => (
                      <div className='link-bank-wallet' key={index}>
                        <div className='cover-icon'>
                          <img src={IconBankLink} alt='Bank' />
                        </div>
                        <div className='bank-title-view'>
                          <p className='bank-title '>{bank.accountName}</p>
                          <p className='bank-title '>{bank.accountNumber}</p>
                        </div>
                        {hasCompanyOwner() && (
                        <div
                          className='menu-option'
                          onClick={() => linkBankOption(true, bank)}
                        >
                          <img src={DotIcon} alt='MenuOption' />
                        </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
              {!hasPersonalWallet &&
                !listMembers.loading &&
                listMembers.data && 
                hasCompanyOwner() && <BusinessMembersComponent />}
            </Col>
          </Row>

          <WrapperModal
            visible={visibleTransferHistory}
            onCancel={() => {
              setVisibleTransferHistory(false);
            }}
            title={hasOpenHistoryItem ? 'Activity' : 'Recent Activity'}
            footer={null}
            width={width && width > 768 ? (width > 1024 ? 1024 : width) : 768}
            style={{ borderRadius: '5px' }}
          >
            <TransferHistory
              hasOpenHistoryItem={hasOpenHistoryItem}
              currentHistoryItem={currentHistoryItem}
              companyId={companyId}
              userId={user ? user.id : null}
              handleDownload={handleDownload}
            />
          </WrapperModal>
        </WalletContent>
        <SendPayment
          visible={isVisibleSendPayment}
          title={'Send payment to'}
          handleCancel={() => {
            setUserReceivePayment(null);
            setVisibleSendPayment(false);
          }}
          handleContinuePayment={(data) => {
            setUserReceivePayment(data);
            setVisibleSendPayment(false);
            setVisibleContinueProcessPayment(true);
          }}
        />
        <SendPaymentContinue
          visible={isVisibleContinueProcessPayment}
          hasPersonalWallet={hasPersonalWallet}
          userReceivePayment={userReceivePayment}
          handleCancel={() => {
            setVisibleContinueProcessPayment(false);
          }}
          handleDecline={() => {
            setVisibleContinueProcessPayment(false);
          }}
          handleSuccess={(data) => {
            setDataMessage(data);
            setVisibleContinueProcessPayment(false);
            setVisibleSendMessage(true);
          }}
        />
        <SendPayment
          visible={visibleRequestPayment}
          title={'Request payment from'}
          handleCancel={() => {
            setUserReceivePayment(null);
            setVisibleRequestPayment(false);
          }}
          handleContinuePayment={(data) => {
            setUserReceivePayment(data);
            setVisibleRequestPayment(false);
            setVisibleRequestPaymentConfirm(true);
          }}
        />
        <RequestPaymentConfirm
          companyId={companyId}
          visible={visibleRequestPaymentConfirm}
          requestUserPayment={userReceivePayment}
          handleCancel={() => {
            setVisibleRequestPaymentConfirm(false);
          }}
          handleSuccess={(data) => {
            setDataMessage(data);
            setVisibleRequestPaymentConfirm(false);
            setVisibleRequestPaymentSuccess(true);
          }}
        />
        <WrapperModal
          visible={visibleTransferFunds}
          title={`Transfer to your ${transferTo}`}
          onCancel={() => {
            setVisibleTransferFunds(false);
            setTransferTo('bank');
            childRef.current.setInitialState();
          }}
          footer={null}
          width={720}
          style={{ borderRadius: 10, padding: 20 }}
        >
          <TransferFunds
            ref={childRef}
            visible={visibleTransferFunds}
            hasPersonalWallet={hasPersonalWallet}
            currentBalance={currentBalance}
            handleSuccess={(data) => {
              setDataMessage(data);
              setVisibleTransferFunds(false);
              setVisibleTransferFundsSuccess(true);
              refreshWallet();
            }}
            plaidLinkToken={plaidLinkToken}
            onAddNewBankSuccess={onSuccess}
            setTransferTo={setTransferTo}
          />
        </WrapperModal>
        <Modal
          visible={visibleSendMessage}
          onCancel={() => setVisibleSendMessage(false)}
          width={300}
          footer={null}
          style={{ borderRadius: '5px' }}
        >
          {dataMessage.amount && userReceivePayment && (
            <TransferFundSuccess
              onClose={() => {
                setVisibleSendMessage(false);
              }}
              title={'You Sent'}
              amount={dataMessage.amount}
              description={`We'll let ${userReceivePayment.name}\n know you sent it.`}
              account={userReceivePayment}
            />
          )}
        </Modal>
        <Modal
          visible={visibleTransferFundsSuccess}
          onCancel={() => setVisibleTransferFundsSuccess(false)}
          footer={null}
          width={300}
          style={{ borderRadius: '5px' }}
        >
          <TransferFundSuccess
            onClose={() => {
              setVisibleTransferFundsSuccess(false);
            }}
            title={'You transferred'}
            amount={dataMessage.amount}
            description={
              dataMessage.transferSource === 'wallet'
                ? 'You transferred funds to your bank using your Visa Debit'
                : 'You transferred funds to your wallet using bank'
            }
            account={userReceivePayment}
          />
        </Modal>
        <Modal
          visible={visibleRequestPaymentSuccess}
          onCancel={() => setVisibleRequestPaymentSuccess(false)}
          footer={null}
          width={300}
          style={{ borderRadius: '5px' }}
        >
          {dataMessage.amount && userReceivePayment && (
            <TransferFundSuccess
              onClose={() => {
                setVisibleRequestPaymentSuccess(false);
              }}
              title={'You Requested'}
              amount={dataMessage.amount}
              description={`You requested payment from ${userReceivePayment.name}`}
              account={userReceivePayment}
            />
          )}
        </Modal>
        <ConfirmModal
          visible={hasRemoveBankAccount}
          title='Remove Bank Account'
          description='Are you sure you want to Remove this Bank Account?'
          onYes={handleDeleteAccount}
          onNo={() => linkBankOption(false, {})}
        />

        <ConfirmModal
          visible={hasDeclineRequestPayment}
          title='Cancel Request Payment'
          description={dataMessage.message}
          onYes={() => handleCancelRequestPaymentByOwner(dataMessage)}
          onNo={() => setDeclineRequestPayment(false)}
        />

        <Modal
          visible={visibleAddBankCard}
          onCancel={() => onCloseAddBankCard(false)}
          footer={null}
          style={{ borderRadius: '5px' }}
        >
          <AddManualBank
            companyId={companyId}
            visible={visibleAddBankCard}
            onClose={(hasAddedSuccess, bankCardNumber) =>
              onCloseAddBankCard(hasAddedSuccess, bankCardNumber)
            }
          />
        </Modal>
        <Modal
          visible={visibleLinkBankSuccess}
          onCancel={onCloseLinkBankSuccess}
          footer={null}
          width={300}
          style={{ borderRadius: '5px' }}
        >
          <LinkBankSuccess
            onClose={onCloseLinkBankSuccess}
            bankCardNumber={bankCardNumber}
          />
        </Modal>
      </LayoutContentWrapper>
    </Spin>
  );
};

export default Wallet;
