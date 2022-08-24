import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Popover from '@iso/components/uielements/popover';
import IntlMessages from '@iso/components/utility/intlMessages';
// import userpic from '@iso/assets/images/icon/user-icon.svg';
import EmptyAvatar from '@iso/assets/images/empty-profile.png';
import downOutLinedIcon from '@iso/assets/images/icon/arrow-down-lined.svg';
import PowerOff from '@iso/components/icons/Power';
import * as authAction from '@iso/redux/auth/actions';
import TopbarDropdownWrapper from './TopbarDropdown.styles';
import LogoutModal from '@iso/components/Modals/LogoutModal';
import { showServerError } from '@iso/lib/helpers/utility';
import notify from '@iso/lib/helpers/notify';
import { setWorkspaceCompany } from '@iso/redux/accountBoard/actions';
import { syncAuthUserRequest } from '@iso/redux/auth/actions';
import {
  ArrowDowStyle,
  UserNameStyle,
  AccountSummaryStyle,
  AccountSummaryInfoStyle,
  AccountListWrapperStyle,
  AccountSummaryInfoEmailStyle,
  AccountSummaryInfoTitleStyle,
  FooterButtonWrapperStyle,
} from './TopbarUser.styles';
import AccountAvatar from '@iso/components/AccountAvatar';
import { Button, Divider, List } from 'antd';
import { UserAddOutlined, PoweroffOutlined } from '@ant-design/icons';
import { isExecutiveUser, isCompanyAccount } from '@iso/lib/helpers/auth';
import CreateCompanyModal from '../Sidebar/Primary/CreateCompany';

const { signout, companySignOutRequest } = authAction;

export default function TopbarUser({ dropdown }) {
  const [visible, setVisibility] = useState(false);
  /**
   * if companyId is not null then this means current workspace is company
   */
  const { companyId } = useSelector((state) => state.AccountBoard);
  const history = useHistory();
  const dispatch = useDispatch();
  const [action, setAction] = useState('');
  const { company: companyDetail } = useSelector((state) => state.Company);
  const { user: authUser, companySignOut } = useSelector((state) => state.Auth);
  const [visibleLogout, setVisibleLogout] = useState(false);
  const [visibleCreateCompanyModal, setVisibleCreateCompanyModal] =
    useState(false);
  function handleVisibleChange() {
    setVisibility((visible) => !visible);
  }
  const handleCompanyCreate = (type) => {
    if (type === 'close') {
      setVisibleCreateCompanyModal(false);
    }

    if (type === 'success') {
      dispatch(syncAuthUserRequest());
      setVisibleCreateCompanyModal(false);
    }
  };

  const onCreateNewCompnayBtnClicked = () => {
    setVisibility(false);
    setVisibleCreateCompanyModal(true);
  };
  const handleClose = () => {
    setVisibleLogout(false);
    dispatch(setWorkspaceCompany(null));
    dispatch(syncAuthUserRequest());
  };

  const handleContinueClick = () => {
    handleClose();
    history.push('/jobs');
  };

  useEffect(() => {
    if (action === 'company_sign_out') {
      if (!companySignOut.loading && !companySignOut.error) {
        setVisibleLogout(true);
      }
      if (companySignOut.error) {
        notify('error', showServerError(companySignOut.error));
      }
      if (!companySignOut.loading) {
        setAction('');
      }
    }
  }, [companySignOut]);

  const currentWorkspace =
    companyDetail && companyId
      ? { data: { ...companyDetail, businessType: 'company' }, type: 'company' }
      : { data: authUser, type: 'personal' };

  const onAccountClicked = (account) => {
    let accountDisplayName = account.title;
    if (isCompanyAccount(account)) {
      //company account
      dispatch(setWorkspaceCompany(account.id));
      history.push(`/companies/${account.id}/jobs`);
    } else {
      accountDisplayName = account.fullName;
      dispatch(setWorkspaceCompany(null));
      history.push(`/jobs`);
    }
    notify(
      'success',
      <IntlMessages
        id={'page.switchAccount'}
        values={{ account: accountDisplayName }}
      />
    );
    handleVisibleChange();
  };
  const AccountSummary = () => {
    const manageProfileItem = dropdown[0];
    return (
      <AccountSummaryStyle>
        <AccountAvatar account={currentWorkspace.data} size={60} />

        <AccountSummaryInfoStyle>
          <AccountSummaryInfoTitleStyle>
            {currentWorkspace.type === 'company'
              ? currentWorkspace.data.title
              : currentWorkspace.data.fullName}
          </AccountSummaryInfoTitleStyle>
          <AccountSummaryInfoEmailStyle>
            {currentWorkspace.type === 'company'
              ? currentWorkspace.data.ownerEmail
              : currentWorkspace.data.email}
          </AccountSummaryInfoEmailStyle>
        </AccountSummaryInfoStyle>
        <Link
          to={manageProfileItem.path || '#'}
          key={manageProfileItem.key}
          onClick={() => handleVisibleChange()}
        >
          <Button shape='round'>
            <IntlMessages id={manageProfileItem.label} />
          </Button>
        </Link>
      </AccountSummaryStyle>
    );
  };
  const canAddNewCompnay = isExecutiveUser(authUser);
  const AccountList = () => {
    let accouts = [...authUser.companies];
    if (currentWorkspace.type === 'company') {
      accouts.unshift(authUser);
      accouts = accouts.filter(
        (account) => account.id !== currentWorkspace.data.id
      );
    }

    return (
      <AccountListWrapperStyle>
        {accouts.length > 0 && (
          <List
            itemLayout='horizontal'
            dataSource={accouts}
            renderItem={(item) => (
              <>
                <List.Item onClick={() => onAccountClicked(item)}>
                  <List.Item.Meta
                    avatar={<AccountAvatar account={item} />}
                    title={item.title ? item.title : item.fullName}
                  />
                </List.Item>
              </>
            )}
          />
        )}
        {canAddNewCompnay && (
          <List.Item onClick={onCreateNewCompnayBtnClicked}>
            <List.Item.Meta
              avatar={<UserAddOutlined />}
              title={'Add new band'}
            />
          </List.Item>
        )}
      </AccountListWrapperStyle>
    );
  };
  const isOwner =
    companyId &&
    companyDetail &&
    authUser &&
    authUser.email === companyDetail.ownerEmail;
  const content = (
    <TopbarDropdownWrapper className='isoUserDropdown'>
      <AccountSummary />
      <Divider />

      {canAddNewCompnay && (
        <>
          <AccountList /> <Divider />
        </>
      )}
      {(!companyId || isOwner) && (
        <FooterButtonWrapperStyle>
          <Button
            shape='round'
            danger
            onClick={() => {
              handleVisibleChange();
              dispatch(signout());
            }}
            icon={<PoweroffOutlined />}
          >
            <span>
              <IntlMessages id='topbar.logout' />
            </span>
          </Button>
        </FooterButtonWrapperStyle>
      )}
      {companyId &&
        companyDetail &&
        authUser &&
        authUser.email !== companyDetail.ownerEmail && (
          <>
            <div className='isoDropdownDivider'></div>
            <a
              className='isoDropdownLink isoDropdownLinkDanger'
              onClick={() => {
                handleVisibleChange();
                setAction('company_sign_out');
                dispatch(companySignOutRequest(companyId));
              }}
            >
              <div className='isoDropdownLinkIcon'>
                <PowerOff fill='#eb5757' />
              </div>
              Log Out of {companyDetail && companyDetail.title}
            </a>
          </>
        )}
      <CreateCompanyModal
        visible={visibleCreateCompanyModal}
        setModalData={handleCompanyCreate}
      />
    </TopbarDropdownWrapper>
  );

  return (
    <div className='isoImgWrapper'>
      <Popover
        content={content}
        trigger='click'
        visible={visible}
        onVisibleChange={handleVisibleChange}
        placement='bottomRight'
      >
        <div className='userName'>
          <UserNameStyle className='userNameLabel'>
            {companyId && companyDetail
              ? companyDetail.title
              : authUser.fullName}
          </UserNameStyle>

          <AccountAvatar account={currentWorkspace.data} />

          <ArrowDowStyle
            alt='arrow-down'
            className='downOutLinedIcon'
            src={downOutLinedIcon}
          />
        </div>
      </Popover>
      <LogoutModal
        key='pay-approved-invoice-confirm'
        visible={visibleLogout}
        container={false}
        title='Log Out'
        description={<>You have been successfully logged out.</>}
        onContinue={() => {
          handleContinueClick();
        }}
        onClose={() => {
          handleClose();
        }}
      />
    </div>
  );
}
