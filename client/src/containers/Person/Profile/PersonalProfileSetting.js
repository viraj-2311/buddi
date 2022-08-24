import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Col, Row } from 'antd';

import ProfileLayout from '@iso/containers/Profile';
import SignInSecurity from '@iso/containers/Profile/SignInSecurity';
import Documents from '@iso/containers/Profile/Documents';
import CloseAccount from '@iso/containers/Profile/CloseAccount';
import PersonalProfile from '@iso/containers/Profile/PersonalProfile';
import CreateCompanyModal from '@iso/containers/Sidebar/Primary/CreateCompany';
import Button from '@iso/components/uielements/button';
import CompanyIcon from '@iso/assets/images/CompanyIcon.webp';
import { syncAuthUserRequest } from '@iso/redux/auth/actions';
import { useLocation } from 'react-router';

export default () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const TabTypes = {
    PERSONAL_PROFILE: 'PERSONAL_PROFILE',
    SECURITY: 'SECURITY',
    DOCUMENTS: 'DOCUMENTS',
    CLOSE_ACCOUNT: 'CLOSE_ACCOUNT'
  };
  const onNewCompanyClick = () => {
    setVisibleCreateCompanyModal(true);
  };

  const handleCompanyCreate = (type) => {
    if (type === 'close') {
      setVisibleCreateCompanyModal(false);
    }

    if (type === 'success') {
      dispatch(syncAuthUserRequest());
      setVisibleCreateCompanyModal(false);
    }
  };

  const [visibleCreateCompanyModal, setVisibleCreateCompanyModal] =
    useState(false);

  const [currentTab, setCurrentTab] = useState(location?.state?.state || TabTypes.PERSONAL_PROFILE);
  return (
    <ProfileLayout>
      <Row gutter={30}>
        <Col className="left-menu">
          <Card className="side-nav">
            <h2>Settings</h2>
            <ul>
              <li
                className={
                  currentTab === TabTypes.PERSONAL_PROFILE ? 'active' : ''
                }
              >
                <a onClick={() => setCurrentTab(TabTypes.PERSONAL_PROFILE)}>
                  Personal Profile
                </a>
              </li>
              <li className={currentTab === TabTypes.SECURITY ? 'active' : ''}>
                <a onClick={() => setCurrentTab(TabTypes.SECURITY)}>
                  Sign in & Security
                </a>
              </li>
              <li className={currentTab === TabTypes.DOCUMENTS ? 'active' : ''}>
                <a onClick={() => setCurrentTab(TabTypes.DOCUMENTS)}>
                  Documents
                </a>
              </li>
              <li className={currentTab === TabTypes.CLOSE_ACCOUNT ? 'active' : ''}>
                <a onClick={() => setCurrentTab(TabTypes.CLOSE_ACCOUNT)}>
                  Close Account
                </a>
              </li>
            </ul>
          </Card>
          <Card className="company-section">
            <h3>Do you manage or lead a band?</h3>
            <p>
              <img src={CompanyIcon} alt="BuddiIcon" />
            </p>
            <p>
              Click the Create Band button to create your own entity and start booking talent for free!
            </p>
            <Button type="primary" shape="round" onClick={onNewCompanyClick}>
              Create Band
            </Button>
          </Card>
        </Col>
        <div className="right-content">
          {currentTab === TabTypes.PERSONAL_PROFILE && <PersonalProfile />}
          {currentTab === TabTypes.SECURITY && <SignInSecurity />}
          {currentTab === TabTypes.DOCUMENTS && <Documents />}
          {currentTab === TabTypes.CLOSE_ACCOUNT && <CloseAccount />}
        </div>
      </Row>
      <CreateCompanyModal
        visible={visibleCreateCompanyModal}
        setModalData={handleCompanyCreate}
      />
    </ProfileLayout>
  );
};
