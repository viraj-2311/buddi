import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProfileLayout from '@iso/containers/Profile';
import SignInSecurity from '@iso/containers/Profile/SignInSecurity';
import { Card, Col, Row } from 'antd';
import CompanyProfile from './CompanyProfile';
import CloseCompanyAccount from './CloseCompanyAccount';
import PersonalProfile from '@iso/containers/Profile/PersonalProfile';

export default () => {
  const TabTypes = {
    PERSONAL_PROFILE: 'PERSONAL_PROFILE',
    SECURITY: 'SECURITY',
    COMPANY_PROFILE: 'COMPANY_PROFILE',
    CLOSE_ACCOUNT: 'CLOSE_ACCOUNT',
  };
  const { company: companyDetail } = useSelector((state) => state.Company);
  const [currentTab, setCurrentTab] = useState(TabTypes.COMPANY_PROFILE);

  const hasOwnCompany = () => {
    return companyDetail && companyDetail.isOwner;
  };

  return (
    <ProfileLayout>
      <Row gutter={30}>
        <Col className='left-menu'>
          <Card className='side-nav'>
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
              <li
                className={
                  currentTab === TabTypes.COMPANY_PROFILE ? 'active' : ''
                }
              >
                <a onClick={() => setCurrentTab(TabTypes.COMPANY_PROFILE)}>
                  Band Profile
                </a>
              </li>
              {hasOwnCompany() && (
                <li
                  className={currentTab === TabTypes.SECURITY ? 'active' : ''}
                >
                  <a onClick={() => setCurrentTab(TabTypes.SECURITY)}>
                    Sign in & Security
                  </a>
                </li>
              )}
              {hasOwnCompany() && (
                <li
                  className={
                    currentTab === TabTypes.CLOSE_ACCOUNT ? 'active' : ''
                  }
                >
                  <a onClick={() => setCurrentTab(TabTypes.CLOSE_ACCOUNT)}>
                    Delete Band
                  </a>
                </li>
              )}
            </ul>
          </Card>
        </Col>
        <div className='right-content'>
          {currentTab === TabTypes.PERSONAL_PROFILE && <PersonalProfile />}
          {currentTab === TabTypes.COMPANY_PROFILE && <CompanyProfile />}
          {currentTab === TabTypes.SECURITY && <SignInSecurity />}
          {currentTab === TabTypes.CLOSE_ACCOUNT && hasOwnCompany() && (
            <CloseCompanyAccount />
          )}
        </div>
      </Row>
    </ProfileLayout>
  );
};
