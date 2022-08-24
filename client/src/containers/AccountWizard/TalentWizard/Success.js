import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import AccountSuccessStyleWrapper from '@iso/containers/AccountWizard/components/AccountSuccess/AccountSuccess.styles';
import { Row, Col } from 'antd';
import IntlMessages from '@iso/components/utility/intlMessages';
import LampIcon from '@iso/assets/images/BandLamp.svg';
import AddNetworkIcon from '@iso/assets/images/BandAddNetwork.svg';
import WalletIcon from '@iso/assets/images/BandWallet.svg';
import Logo from '@iso/assets/images/buddi-band-logo.webp';
import NextIcon from '@iso/assets/images/Next-Buddi-band-with-circle.svg';
import Button from '@iso/components/uielements/button';
import bgBuddiTalentImage from '@iso/assets/images/buddi-band-talent-large-bg.webp';
import {
  checkSectionToRedirect,
  displayRegisterUserWallet,
} from '@iso/redux/user/actions';

export default function ({ onSkip }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleSKillSelect = () => {
    dispatch(checkSectionToRedirect('section-skills'));
    history.push('/settings');
  };

  const handleNetworkSelect = () => {
    history.push('/network');
  };

  const handleSetupWalletSelect = () => {
    
    dispatch(displayRegisterUserWallet(true));
    history.push(`/jobs`);
  };

  const nextStepsList = [
    {
      imgSrc: LampIcon,
      title: 'Add Skills & Experience',
      body: `Showcase your skills and experience on Buddi. Having relevant skills listed on your profile is a signal to others that you're proficient at your work.`,
      handleSelect: handleSKillSelect,
    },
    {
      imgSrc: AddNetworkIcon,
      title: 'Add Personal Network',
      body: 'Connect with your favorite talents on Buddi! Start adding people you know and trust into your personal network.',
      handleSelect: handleNetworkSelect,
    },
    {
      imgSrc: WalletIcon,
      title: 'Setup Buddi Wallet',
      body: 'Get paid easily with contactless payments. Set up your Buddi Wallet today so you can take advantage of getting paid instantly with no fee along with tracking payments.',
      handleSelect: handleSetupWalletSelect,
    },
  ];

  return (
    <AccountSuccessStyleWrapper background={bgBuddiTalentImage}>
      <div className='success-step-container'>
        <h1 className='title'>Congratulations! Talent Account Created.</h1>
        <h3 className='subTitle'>Choose your next step.</h3>
        <Row className='steps' justify='center' gutter={37}>
          {nextStepsList.map(({ title, imgSrc, body, handleSelect }) => (
            <Col md={8} key={title}>
              <div className='step-card'>
                <div className='step-card-icon'>
                  <img src={imgSrc} />
                </div>
                <h2 className='step-card-title'>{title}</h2>
                <div className='step-card-body'>{body}</div>
                <div className='step-card-action'>
                  <a onClick={handleSelect}>
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
