import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Layout } from 'antd';
import TopbarUser from './TopbarUser';
import TopbarWrapper, { Container } from './Topbar.styles';
import { themeConfig } from '@iso/config/theme/theme.config';
import Button from '@iso/components/uielements/button';
import { DollarCircleFilled } from '@ant-design/icons';
import SetupWalletModal from '../SetupWallet/SetupWalletModal';
import SetupUserWallet from '../SetupWallet/SetupUserWallet';
import KYCUserWallet from '../SetupWallet/KYCUserWallet';
import KYBCompanyWallet from '../SetupWallet/KYBCompanyWallet';
import SetupCompanyWallet from '../SetupWallet/SetupCompanyWallet';
import {
  WalletStatus,
  KYCStatusFailed,
  checkStatusFailed,
  WalletAccessRole,
} from '@iso/enums/wallet_status';
import { KYBStatusFailed } from '@iso/enums/wallet_company_status';
import ConfirmModal from '@iso/components/Modals/Confirm';
import { convertCurrencyToDollar } from '@iso/lib/helpers/numberUtil';
import PersonalAccountIntro from '@iso/containers/IntroToolTip/PersonalAccountIntro';
import CompanyAccountIntro from '@iso/containers/IntroToolTip/CompanyAccountIntro';
import Popover from '@iso/components/uielements/popover';
import { TypeUser } from '@iso/containers/IntroToolTip/TooltipData';
import {
  StepsIntroPersonalProducer,
  StepsIntroCompanyProducer,
} from '@iso/containers/IntroToolTip/TooltipData';
import {
  fetchUserDetailRequest,
  getUserWallet,
  getUserSilaKYC,
  getPlaidUserAccount,
  displayRegisterUserWallet,
} from '@iso/redux/user/actions';
import {
  fetchCompanyDetailRequest,
  fetchCompanyTypeRequest,
  fetchBusinessTypeRequest,
  getCompanyWallet,
  getCompanySilaKYB,
  getPlaidCompanyAccount,
  toggleWalletNotSetModal,
} from '@iso/redux/company/actions';
import WalletNotSetModal from '../SetupWallet/WalletNotSetModal/WalletNotSetModal';
import { setWorkspaceCompany } from '@iso/redux/accountBoard/actions';
import appActions from '@iso/redux/app/actions';
import Hamburger from '../../components/utility/hamburger';
import RegisterWalletModal from '@iso/components/Modals/RegisterWalletModal';
import {
  setIsBuddiWalletRegistered,
  triggerSetupBuddiWallet,
  setDisplayBuddiWallet,
} from '../../redux/auth/actions';

import Logo from '@iso/assets/images/logo.webp';
import IntlMessages from '@iso/components/utility/intlMessages';

const { Header } = Layout;

const Topbar = ({
  userDropdown,
  hasPersonalWallet = false,
  isHideTopBar = false,
}) => {
  let history = useHistory();
  const { toggleMobileOverlayMenu } = appActions;
  const [selectedItem, setSelectedItem] = React.useState('');
  const customizedTheme = themeConfig.topbar;
  const { collapsed, openDrawer } = useSelector((state) => state.App);
  const [mobileMenuOpened, setMobileMenuOpened] = React.useState(false);
  const { userStepIntro, companyStepIntro } = useSelector(
    (state) => state.UserIntro
  );
  const dispatch = useDispatch();
  const setupUserWalletRef = useRef();
  const setupCompanyWalletRef = useRef();

  const [visibleSetupWallet, setVisibleSetupWallet] = useState(false);
  const [visibleKYCVerification, setVisibleKYCVerification] = useState(false);
  const [visibleKYBVerification, setVisibleKYBVerification] = useState(false);
  const [isIgnoreCreateKYB, setIgnoreCreateKYB] = useState(false);
  const [allowDisplayPopup, setAllowDisplayPopup] = useState(true);
  const { view } = useSelector((state) => state.App);

  const [visibleSetupCompanyWallet, setVisibleSetupCompanyWallet] =
    useState(false);
  const [userDetail, setUserDetail] = useState({});
  const { user: authUser, triggers } = useSelector((state) => state.Auth);
  const {
    user: userById,
    userWallet,
    silaKYC,
    plaidUserAccount,
    displayRegister,
  } = useSelector((state) => state.User);
  const { companies } = useSelector((state) => state.Auth.user);
  const {
    companyWallet,
    silaKYB,
    plaidCompanyAccount,
    displayWalletNotSetModal,
  } = useSelector((state) => state.Company);
  const { companyId } = useSelector((state) => state.AccountBoard);
  const { payApproved } = useSelector((state) => state.JobInvoice);
  const { canOpenRegisterBuddiWallet,displayRegisterBuddiWallet, isBuddiWalletRegister } = useSelector(
    (state) => state.Auth
  );
  useEffect(() => {
    if (companyId && !hasPersonalWallet) {
      dispatch(getPlaidCompanyAccount(companyId));
      dispatch(fetchCompanyDetailRequest(companyId));
      dispatch(fetchCompanyTypeRequest());
      dispatch(fetchBusinessTypeRequest());
      dispatch(getCompanySilaKYB(companyId));
      dispatch(getCompanyWallet(companyId));
    }
  }, [companyId]);

  useEffect(() => {
    if (hasPersonalWallet) {
      dispatch(getPlaidUserAccount());
      dispatch(getUserSilaKYC());
      dispatch(getUserWallet());
    }
  }, []);

  useEffect(() => {
    try {
      dispatch(fetchUserDetailRequest(authUser.id));
    } catch (error) {}
  }, [dispatch, authUser]);

  useEffect(() => {
    if (authUser != null) {
      setUserDetail(authUser);
    }
  }, [userById]);

  const isCollapsed = view === 'MobileView' ? true : collapsed && !openDrawer;
  const styling = {
    background: customizedTheme.backgroundColor,
    position: 'fixed',
    width: '100%',
    height: 88,
  };

  const goToWallet = () => {
    if (hasPersonalWallet) {
      history.push('/wallet');
    } else {
      history.push(`/companies/${companyId}/wallet`);
    }
  };

  const handleIgnoreKYB = () => {
    setIgnoreCreateKYB(false);
  };

  const handleSetupKYB = () => {
    dispatch(setWorkspaceCompany(null));
    history.push('/jobs');
    setIgnoreCreateKYB(false);
    dispatch(displayRegisterUserWallet(true));
  };

  const onCancelSetupWallet = () => {
    dispatch(displayRegisterUserWallet(false));
    setAllowDisplayPopup(false);
    setVisibleSetupWallet(false);
    setupUserWalletRef.current && setupUserWalletRef.current.reset();
  };

  const onCancelKYCVerification = () => {
    setVisibleKYCVerification(false);
  };

  const onCancelKYBVerification = () => {
    setVisibleKYBVerification(false);
  };

  const onCancelSetupCompanyWallet = () => {
    setAllowDisplayPopup(false);
    setVisibleSetupCompanyWallet(false);
    setupCompanyWalletRef.current && setupCompanyWalletRef.current.reset();
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

  const handleWallet = () => {
    setAllowDisplayPopup(true);
    if (
      (plaidCompanyAccount.account &&
      plaidCompanyAccount.account.length > 0 &&
      companyWallet.wallet &&
      !hasPersonalWallet &&
      silaKYB.silaKYB &&
      silaKYB.silaKYB.id &&
      silaKYB.silaKYB.verificationStatus == WalletStatus.Success) ||
      hasCompanyMember()
    ) {
      goToWallet();
    } else if (
      plaidUserAccount.account &&
      plaidUserAccount.account.length > 0 &&
      userWallet.wallet &&
      hasPersonalWallet &&
      silaKYC.silaKYC &&
      silaKYC.silaKYC.verificationStatus == WalletStatus.Success
    ) {
      goToWallet();
    } else if (hasPersonalWallet) {
      if (
        silaKYC.silaKYC &&
        checkStatusFailed(silaKYC.silaKYC.verificationStatus)
      ) {
        // if user wallet failed, ask user for uploading KYC
        setVisibleKYCVerification(true);
      } else {
        // register new wallet user
        setVisibleSetupWallet(true);
      }
    } else if (hasCompanyOwner()) {
      if (
        silaKYB.silaKYB &&
        silaKYB.silaKYB.id &&
        checkStatusFailed(silaKYB.silaKYB.verificationStatus)
      ) {
        // if company wallet failed, ask user for uploading KYB
        setVisibleKYBVerification(true);
      } else if (
        silaKYC.silaKYC &&
        silaKYC.silaKYC.verificationStatus == WalletStatus.Success
      ) {
        // register new wallet company
        setVisibleSetupCompanyWallet(true);
      } else {
        setIgnoreCreateKYB(true);
      }
    }
  };
  useEffect(() => {
    if (triggers.setupBuddiWallet) {
      handleWallet();
      dispatch(triggerSetupBuddiWallet(false));
    }
  }, [triggers.setupBuddiWallet]);
  const renderButtonWallet = () => {
    let title = 'Register Wallet';
    let className = 'walletButton';
    let classNameIcon = 'walletButtonIcon';
    var sila = silaKYC.silaKYC;
    var wallet = userWallet.wallet;
    var amountBalance = '';
    let account = plaidUserAccount.account;
    let walletFlag = false;
    var isloading =
      silaKYC.loading || userWallet.loading || plaidUserAccount.loading;

    if (authUser.type == TypeUser.CREW) {
      if (userDetail.type != null && !userDetail.toolTipFinished) {
        walletFlag = true;
      }
    } else {
      if (userDetail.type != null && !userDetail.producerToolTipFinished) {
        walletFlag = true;
      }
    }
    if (!hasCompanyOwner() && !hasPersonalWallet) {
      title = 'No Wallet';
      walletFlag = true;
    }
    if (!hasPersonalWallet) {
      sila = silaKYB.silaKYB;
      wallet = companyWallet.wallet;
      account = plaidCompanyAccount.account;
      isloading =
        silaKYB.loading || companyWallet.loading || plaidCompanyAccount.loading;
    }
    if (isloading) {
      walletFlag = true;
    }
    if (!account || !Object.keys(sila) || !wallet) {
      walletFlag = true;
    }
    if (sila && sila.verificationStatus == WalletStatus.Pending) {
      title = 'Pending Verification';
      className = 'walletButton pending';
      classNameIcon = 'walletButtonIcon icon-pending';
      walletFlag = true;
    } else if (sila && checkStatusFailed(sila.verificationStatus)) {
      title = 'Failed Verification';
      className = 'walletButton failed';
      classNameIcon = 'walletButtonIcon icon-failed';
      walletFlag = true;
    } else if (
      (sila && sila.verificationStatus == WalletStatus.Success) ||
      hasCompanyMember()
    ) {
      if (account && account.length > 0 && wallet) {
        title = 'Balance:';
        amountBalance = '$' + convertCurrencyToDollar(wallet.balance);
      } else if (hasCompanyOwner() || hasPersonalWallet) {
        title = 'Passed Verification';
        className = 'walletButton success';
        classNameIcon = 'walletButtonIcon icon-success';
      }
      walletFlag = true;
    }
    dispatch(setIsBuddiWalletRegistered(walletFlag));
    return (
      <Button
        onClick={handleWallet}
        className={className}
        loading={payApproved.success && companyWallet.loading}
        icon={<DollarCircleFilled className={classNameIcon} />}
      >
        <span className='walletButtonLabel'>
          {title}
          <span className='amount-balance'>{amountBalance}</span>
        </span>
      </Button>
    );
  };
  let statusUserWallet = null;
  if (silaKYC.silaKYC && silaKYC.silaKYC.verificationStatus) {
    statusUserWallet = silaKYC.silaKYC.verificationStatus;
  }
  let statusCompanyWallet = null;
  if (
    silaKYB.silaKYB &&
    silaKYB.silaKYB.id &&
    silaKYB.silaKYB.verificationStatus
  ) {
    statusCompanyWallet = silaKYB.silaKYB.verificationStatus;
  }

  const onHamburgerClicked = () => {
    setMobileMenuOpened(!mobileMenuOpened);
  };
  useEffect(() => {
    if (
      !isBuddiWalletRegister &&
      !plaidUserAccount.loading &&
      !plaidCompanyAccount.loading
    ) {
      dispatch(setDisplayBuddiWallet(true));
    } else {
      dispatch(setDisplayBuddiWallet(false));
    }
  }, [isBuddiWalletRegister, plaidUserAccount, plaidCompanyAccount]);
  return (
    <TopbarWrapper>
      <div
        style={styling}
        className={
          isCollapsed ? 'isomorphicTopbar collapsed' : 'isomorphicTopbar'
        }
      >
        {/* <div className='isoLeft'>
          <div className='isoSearch'>{ <TopbarSearch /> }</div>
        </div> */}
        <ul className='isoLeft hamburger'>
          <li>
            <Hamburger
              onClick={() => dispatch(toggleMobileOverlayMenu())}
            ></Hamburger>
          </li>
        </ul>
        <ul className='isoRight'>
          <li
            onClick={() => setSelectedItem('button')}
            className='isoWalletButton'
          >
            <Popover
              placement={'bottomRight'}
              content={
                hasPersonalWallet ? (
                  <PersonalAccountIntro
                    currentStep={userStepIntro.currentStepIntro}
                  />
                ) : (
                  <CompanyAccountIntro
                    currentStep={companyStepIntro.currentCompanyStepIntro}
                  />
                )
              }
              visible={
                hasPersonalWallet
                  ? userStepIntro.currentStepIntro >= 0 &&
                    userStepIntro.currentStepIntro ==
                      StepsIntroPersonalProducer.Wallet
                    ? true
                    : false
                  : companyStepIntro.currentCompanyStepIntro >= 0 &&
                    companyStepIntro.currentCompanyStepIntro ==
                      StepsIntroCompanyProducer.Wallet
                  ? true
                  : false
              }
            >
              {renderButtonWallet()}
            </Popover>
          </li>

          {/* <li onClick={() => setSelectedItem('inbox')} className="isoMail">
            <TopbarMail />
          </li>
          <li
            onClick={() => setSelectedItem('notification')}
            className='isoNotify'
          >
            <TopbarNotification />
          </li> */}
          <li onClick={() => setSelectedItem('user')} className='isoUser'>
            <TopbarUser dropdown={userDropdown} />
          </li>
        </ul>
      </div>
      <SetupWalletModal
        visible={visibleSetupWallet || displayRegister}
        onCancel={onCancelSetupWallet}
      >
        <SetupUserWallet
          ref={setupUserWalletRef}
          allowDisplayPopup={allowDisplayPopup}
          onClose={onCancelSetupWallet}
          userDetail={userDetail}
          statusWallet={statusUserWallet}
        />
      </SetupWalletModal>

      <SetupWalletModal
        visible={visibleSetupCompanyWallet}
        onCancel={onCancelSetupCompanyWallet}
      >
        <SetupCompanyWallet
          ref={setupCompanyWalletRef}
          allowDisplayPopup={allowDisplayPopup}
          statusWallet={statusCompanyWallet}
          onClose={onCancelSetupCompanyWallet}
        />
      </SetupWalletModal>

      <SetupWalletModal
        visible={visibleKYCVerification}
        onCancel={onCancelKYCVerification}
      >
        <KYCUserWallet
          onClose={onCancelKYCVerification}
          statusWallet={
            silaKYC.silaKYC &&
            silaKYC.silaKYC.resultDetail &&
            silaKYC.silaKYC.resultDetail[0]
              ? silaKYC.silaKYC.resultDetail[0]
              : KYCStatusFailed.GeneralFailed
          }
          usernameWallet={authUser.fullName}
        />
      </SetupWalletModal>

      <SetupWalletModal
        visible={visibleKYBVerification}
        onCancel={onCancelKYBVerification}
      >
        <KYBCompanyWallet
          onClose={onCancelKYBVerification}
          statusWallet={
            silaKYB.silaKYB &&
            silaKYB.silaKYB.resultDetail &&
            silaKYB.silaKYB.resultDetail[0]
              ? silaKYB.silaKYB.resultDetail[0]
              : KYBStatusFailed.GeneralFailed
          }
          usernameWallet={authUser.companyName}
          companyId={companyId}
        />
      </SetupWalletModal>

      <ConfirmModal
        visible={isIgnoreCreateKYB}
        title={`Sorry, you can't setup a band wallet yet`}
        description={
          !statusUserWallet
            ? `Please setup a personal wallet and get verified to proceed.\nDo you want to register Personal Wallet?`
            : 'You need to wait until personal wallet verified'
        }
        confirmLoading={false}
        onYes={!statusUserWallet ? handleSetupKYB : handleIgnoreKYB}
        onNo={handleIgnoreKYB}
        titleNoBtn={'No'}
        titleYesBtn={!statusUserWallet ? 'Setup' : 'OK'}
      />
      <WalletNotSetModal
        container={false}
        key='wallet-not-set-info'
        visible={displayWalletNotSetModal}
        hasCompanyOwner={
          !hasCompanyOwner() && !hasPersonalWallet ? true : false
        }
        title={
          !hasCompanyOwner() && !hasPersonalWallet
            ? 'You do not have access to the Band wallet.'
            : "You haven't setup a Band Wallet"
        }
        description={
          !hasCompanyOwner() && !hasPersonalWallet
            ? 'Please get in touch with the Band Owner.'
            : `Setup your Band Buddi Wallet so you can link a bank account`
        }
        onSetupWallet={() => {
          dispatch(toggleWalletNotSetModal(false));
          handleWallet();
        }}
        onCancel={() => {
          dispatch(toggleWalletNotSetModal(false));
        }}
      />
       {!isBuddiWalletRegister && (
        <RegisterWalletModal
          visible={displayRegisterBuddiWallet && canOpenRegisterBuddiWallet}
          onCancel={() => {
            dispatch(setDisplayBuddiWallet(false));
          }}
        />
      )}
    </TopbarWrapper>
  );
};
export default Topbar;
