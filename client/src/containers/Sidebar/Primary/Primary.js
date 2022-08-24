import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Layout } from 'antd';
import Menu from '@iso/components/uielements/menu';
import PrimarySidebarWrapper, {
  CompanyPlusMenuWrapper,
} from './Primary.styles';
import Button from '@iso/components/uielements/button';
import Popover from '@iso/components/uielements/popover';
import CreateCompanyModal from './CreateCompany';
import SignInToCompany from './SignInToCompany';
import UserEmptyPhoto from '@iso/assets/images/icon/empty-profile-icon.webp';
import { PlusOutlined } from '@ant-design/icons';
import { setWorkspaceCompany } from '@iso/redux/accountBoard/actions';
import appActions from '@iso/redux/app/actions';
import PersonalAccountIntro from '@iso/containers/IntroToolTip/PersonalAccountIntro';
import CompanyAccountIntro from '@iso/containers/IntroToolTip/CompanyAccountIntro';
import {
  StepsIntroPersonalProducer,
  TypeUser,
  StepsIntroCompanyProducer,
} from '@iso/containers/IntroToolTip/TooltipData';
import AccountAvatar from '@iso/components/AccountAvatar';

const { Sider } = Layout;

const { displayMobileMenu, setAllowDoAction } = appActions;
export default function ({ person, companies }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { companyId } = useSelector((state) => state.AccountBoard);
  const { view, allowDoAction, showMobileMenu } = useSelector(
    (state) => state.App
  );
  const { user } = useSelector((state) => state.User);
  const { userStepIntro, companyStepIntro } = useSelector(
    (state) => state.UserIntro
  );
  const [visibleCreateCompanyModal, setVisibleCreateCompanyModal] =
    useState(false);
  const [visibleSignInToCompanyModal, setVisibleSignInToCompanyModal] =
    useState(false);

  const [visiblePopover, setVisiblePopover] = useState(false);
  const location = useLocation();

  const handleCreateNewCompany = () => {
    setVisiblePopover(false);
    setVisibleCreateCompanyModal(true);
  };

  const handleSignInToCompany = () => {
    setVisiblePopover(false);
    setVisibleSignInToCompanyModal(true);
  };

  useEffect(() => {
    if (location.pathname.indexOf('/help') > -1) {
      // setVisibleSignInToCompanyModal(true);
    }
  }, [location]);

  useEffect(() => {
    if (
      user &&
      view === 'MobileView' &&
      TypeUser.CREW !== user.type &&
      !user.toolTipFinished &&
      !showMobileMenu
    ) {
      // dispatch(displayMobileMenu());
    }
  }, [user]);

  const handleCompanyCreate = (type) => {
    if (type === 'close' || type === 'success') {
      setVisibleCreateCompanyModal(false);
    }
  };

  const handleSignInToCompanyModal = () => {
    setVisibleSignInToCompanyModal(false);
  };

  const handleToggle = () => {
    if (allowDoAction) {
      dispatch(displayMobileMenu());
    } else {
      dispatch(setAllowDoAction(true));
    }
  };

  const handleCompanySelect = ({ key }) => {
    dispatch(setWorkspaceCompany(key === 'null' ? null : key));
    if (key === 'null') {
      history.push(`/jobs`);
    } else {
      history.push(`/companies/${key}/jobs`);
    }
  };

  const CompanyPlusMenu = (
    <CompanyPlusMenuWrapper className='isoCompanyPlusDropdown'>
      {/* <a className='isoDropdownLink' onClick={handleSignInToCompany}>
        Sign in to another company
      </a> */}
      <a className='isoDropdownLink' onClick={handleCreateNewCompany}>
        Create new Band
      </a>
      {/* <a className='isoDropdownLink'>Find companies</a> */}
    </CompanyPlusMenuWrapper>
  );

  let profileIconSrc = UserEmptyPhoto;
  if (user && user.profilePhotoS3Url) {
    profileIconSrc = user.profilePhotoS3Url;
  }

  return (
    <PrimarySidebarWrapper>
      <Sider trigger={null} width={58} className='isoPrimarySidebar'>
        <CreateCompanyModal
          visible={visibleCreateCompanyModal}
          setModalData={handleCompanyCreate}
        />
        {visibleSignInToCompanyModal && (
          <SignInToCompany visible setModalData={handleSignInToCompanyModal} />
        )}
        {view === 'MobileView' && (
          <button
            className='triggerBtn menuCollapsed abc'
            onClick={handleToggle}
          />
        )}

        <Menu
          className='isoCompanyMenu'
          mode='inline'
          inlineIndent={0}
          selectedKeys={[companyId || 'null']}
          onSelect={handleCompanySelect}
        >
          <Menu.Item key={null}>
            <Popover
              placement={'rightTop'}
              content={<PersonalAccountIntro currentStep={0} />}
              visible={userStepIntro.currentStepIntro == 0 ? true : false}
            >
              <div className='isoPersonalPhotoWrapper'>
                {user && <AccountAvatar account={user} />}
              </div>
            </Popover>
          </Menu.Item>

          {companies.map((company) => (
            <Menu.Item key={company.id}>
              <Popover
                placement={'rightTop'}
                content={<CompanyAccountIntro currentStep={0} />}
                visible={
                  companyStepIntro.currentCompanyStepIntro == 0 &&
                  companyId != null &&
                  parseInt(companyId) === company.id
                    ? true
                    : false
                }
              >
                <div className='isoCompanyLogoWrapper'>
                  <AccountAvatar account={company} />
                </div>
              </Popover>
            </Menu.Item>
          ))}
        </Menu>
        <div className='addCompanyBtnWrapper'>
          <Popover
            placement={'rightTop'}
            content={
              companyId != null && companyId != 'null' ? (
                <CompanyAccountIntro
                  currentStep={StepsIntroCompanyProducer.CreateCompany}
                />
              ) : (
                <PersonalAccountIntro
                  currentStep={StepsIntroPersonalProducer.CreateCompany}
                />
              )
            }
            visible={
              companyId != null && companyId != 'null'
                ? companyStepIntro.currentCompanyStepIntro ==
                  StepsIntroCompanyProducer.CreateCompany
                  ? true
                  : false
                : userStepIntro.currentStepIntro ==
                  StepsIntroPersonalProducer.CreateCompany
                ? true
                : false
            }
          >
            <Popover
              trigger='click'
              placement='rightTop'
              content={CompanyPlusMenu}
              visible={visiblePopover}
              onVisibleChange={(val) => setVisiblePopover(val)}
            >
              <Button type='link' className='companyAddBtn'>
                <PlusOutlined />
              </Button>
            </Popover>
          </Popover>
        </div>
      </Sider>
    </PrimarySidebarWrapper>
  );
}
