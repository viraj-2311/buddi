import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AccountSuccessStyleWrapper from '@iso/containers/AccountWizard/components/AccountSuccess/AccountSuccess.styles';

import { Row, Col } from 'antd';
import IntlMessages from '@iso/components/utility/intlMessages';
import GigIcon from '@iso/assets/images/Gig.svg';
import AddNetworkIcon from '@iso/assets/images/BandAddNetwork.svg';
import WalletIcon from '@iso/assets/images/BandWallet.svg';
import Logo from '@iso/assets/images/buddi-band-logo.webp';
import NextIcon from '@iso/assets/images/Next-Buddi-band-with-circle.svg';
import Button from '@iso/components/uielements/button';
import { displayRegisterUserWallet } from '@iso/redux/user/actions';
import bgBuddiBandImage from '@iso/assets/images/buddi-band-large-bg.webp';

export default function ({ onSkip }) {
 
  const history = useHistory();
  const { user } = useSelector((state) => state.Auth);
  const companyId = user.companies[0]?.id;
  const dispatch = useDispatch();


  const handleCreateJobSelect = () => {
    if (companyId) {
      history.push(`/companies/${companyId}/jobs`);
    }
  };

  const handleNetworkSelect = () => {
    if (companyId) {
      history.push(`/companies/${companyId}/network`);
    }
  };

  const handleSetupWalletSelect = () => {
    if (companyId) {
      history.push(`/jobs`);
    }
    dispatch(displayRegisterUserWallet(true));
  };

  const nextStepsList = [
    {
      imgSrc: GigIcon,
      title: 'Create Gigs',
      body: 'Create a new gig in order to start holding, booking and paying talents. Users can easily input their first, second and event third choice talents for a gig and Buddi will do the rest.',
      handleSelect: handleCreateJobSelect,
    },
    {
      imgSrc: AddNetworkIcon,
      title: 'Add Personal Network',
      body: 'Connect with your favorite talents on Buddi! Start adding people you know and trust into your personal network to make your booking experience faster.',
      handleSelect: handleNetworkSelect,
    },
    {
      imgSrc: WalletIcon,
      title: 'Setup Wallet',
      body: 'Pay your talents instantly with contactless payments. Set up your Buddi Wallet today so you can take advantage of paying contractors instantly with no fee along with tracking payments.',
      handleSelect: handleSetupWalletSelect,
    },
  ];

  return (
    <AccountSuccessStyleWrapper background={bgBuddiBandImage}>
      <div className='success-step-container'>
        <h1 className='title'>Congratulations! Bandleader Account Created.</h1>
        <h3 className='subTitle'>Choose your next step.</h3>
        <Row className='steps' justify='center' gutter={37}>
          {nextStepsList.map(({ title, imgSrc, body, isNextDisable, handleSelect }) => (
            <Col md={8} key={title}>
              <div className='step-card'>
                <div className='step-card-icon'>
                  <img src={imgSrc} />
                </div>
                <h2 className='step-card-title step-card-company'>{title}</h2>
                <div className='step-card-body'>{body}</div>
                <div className='step-card-action'>
                  <a onClick={handleSelect}
                   className={isNextDisable ? 'disable' : ''}
                  >
                    <img src={NextIcon} />
                  </a>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        <div className='skip-go'>
          <Button onClick={onSkip}>
            <IntlMessages id='page.skipToDashboard' />
          </Button>
          <div className='footer-logo'>
            <img src={Logo} />
          </div>
        </div>
      </div>
    </AccountSuccessStyleWrapper>
  );
}
