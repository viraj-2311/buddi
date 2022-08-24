import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import WithDirection from '@iso/lib/helpers/rtl';
import LinkBankAccountWrapper from './LinkBankAccount.style';
import Button from '@iso/components/uielements/button';
import PlaidIcon from '@iso/assets/images/plaid_grey.svg';
import BankIcon from '@iso/assets/images/bank.svg';
import { Col, Row } from 'antd';
import Modal from '@iso/components/Modal';
import LinkBankSuccess from './LinkBankSuccess';
import { getPlaidLinkUserToken } from '@iso/redux/user/actions';
import { getPlaidLinkCompanyToken } from '@iso/redux/company/actions';
import { usePlaidLink } from 'react-plaid-link';
import notify from '@iso/lib/helpers/notify';
import _ from 'lodash';
import Spin from '@iso/components/uielements/spin';
import PlaidDetail from './View/PlaidDetail';
import AddManualBank from './AddManualBank/AddManualBank';

const OpenPlaidLink = ({ token, onSuccess, onExit }) => {
  const config = {
    token: token,
    onSuccess,
    onExit,
  };
  const { open, ready } = usePlaidLink(config);
  return (
    <Button
      className='bank-button'
      type='primary'
      shape='round'
      onClick={() => open()}
      disabled={!ready}
    >
      Connect via Plaid
    </Button>
  );
};

const LinkBankAccount = ({ goToWallet, companyId }) => {
  const dispatch = useDispatch();
  const { plaidLink } = useSelector((state) => state.User);
  const { plaidLinkKYB } = useSelector((state) => state.Company);
  const [plaidLinkToken, setPlaidLinkToken] = useState(null);
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [visibleLinkBankSuccess, setVisibleLinkBankSuccess] = useState(false);
  const [visibleAddBankCard, setVisibleAddBankCard] = useState(false);
  const [bankCardNumber, setBankCardNumber] = useState('');

  useEffect(() => {
    if (companyId) {
      dispatch(
        getPlaidLinkCompanyToken({
          id: companyId,
          plaidToken: null,
          accounts: null,
        })
      );
    } else {
      dispatch(getPlaidLinkUserToken());
    }
  }, []);

  useEffect(() => {
    if (companyId) {
      if (plaidLinkKYB && plaidLinkKYB.token && plaidLinkKYB.token.linkToken) {
        setPlaidLinkToken(plaidLinkKYB.token.linkToken);
      } else if (plaidLinkKYB && plaidLinkKYB.connected) {
        setLoadingAccount(false);
        goToWallet();
      } else if (plaidLinkKYB && plaidLinkKYB.error) {
        setLoadingAccount(false);
        notify('error', 'Can not get link token KYB');
      }
    }
  }, [plaidLinkKYB]);

  useEffect(() => {
    if (!companyId) {
      if (plaidLink && plaidLink.token && plaidLink.token.linkToken) {
        setPlaidLinkToken(plaidLink.token.linkToken);
      } else if (plaidLink && plaidLink.connected) {
        setLoadingAccount(false);
        goToWallet();
      } else if (plaidLink && plaidLink.error) {
        setLoadingAccount(false);
        notify('error', 'Can not get link token KYC');
      }
    }
  }, [plaidLink]);

  const onExit = (error, metadata) => {};

  const onSuccess = (public_token, metadata) => {
    if (!companyId) {
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
    setLoadingAccount(true);
  };

  const onCloseLinkBankSuccess = () => {
    setVisibleLinkBankSuccess(false);
    goToWallet();
  };

  const onCloseAddBankCard = (hasAddedSuccess = false, bankCard) => {
    setVisibleAddBankCard(false);
    if (hasAddedSuccess) {
      setBankCardNumber(bankCard);
      setVisibleLinkBankSuccess(true);
    }
  };

  return (
    <LinkBankAccountWrapper>
      <Spin spinning={loadingAccount}>
        <div className='link-bank-account__header'>Link a Bank Account</div>
        <Row type='flex' className='link-bank-account__body'>
          <Col xs={24} md={12}>
            <div className='bank-account-area recommended-area'>
              <div className='recommended'>
                <span>Recommended</span>
              </div>
              <div>
                <div className='bank-account-area__icon plaid-icon-bg'>
                  <img src={PlaidIcon} alt='Plaid' height={56} />
                </div>
              </div>
              <div className='bank-account-area__text recommended-color'>
                We've partnered with Plaid to connect bank accounts to the Buddi
                platform. This helps us ensure account ownership.
              </div>
              <div className='bank-account-area__button'>
                {plaidLinkToken ? (
                  <OpenPlaidLink
                    token={plaidLinkToken}
                    onExit={onExit}
                    onSuccess={onSuccess}
                  />
                ) : (
                  <Button
                    className='bank-button disableButton'
                    type='primary'
                    shape='round'
                    disabled={true}
                  >
                    Connect via Plaid
                  </Button>
                )}
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className='bank-account-area'>
              <div>
                <div className='bank-account-area__icon'>
                  <img src={BankIcon} alt='Bank' height={56} />
                </div>
              </div>
              <div className='bank-account-area__text'>
                Connect a Bank Account to your Buddi Wallet.
              </div>
              <div className='bank-account-area__button'>
                <Button
                  className='bank-button'
                  type='primary'
                  shape='round'
                  onClick={() => setVisibleAddBankCard(true)}
                >
                  Enter Account/Routing
                </Button>
              </div>
            </div>
            {/* <PlaidDetail /> */}
          </Col>
        </Row>
      </Spin>
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
      <Modal
        visible={visibleAddBankCard}
        onCancel={() => onCloseAddBankCard(false)}
        footer={null}
        style={{ borderRadius: '5px' }}
      >
        <AddManualBank
          companyId={companyId}
          visible={visibleAddBankCard}
          onClose={(hasAddedSuccess, bankCard) =>
            onCloseAddBankCard(hasAddedSuccess, bankCard)
          }
        />
      </Modal>
    </LinkBankAccountWrapper>
  );
};

export default WithDirection(LinkBankAccount);
