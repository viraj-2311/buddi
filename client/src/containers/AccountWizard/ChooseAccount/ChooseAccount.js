import BandLeaderImage from '@iso/assets/images/Bandleader.jpg';
import BandLeader from '@iso/assets/images/BandLeader.svg';
import MusicIcon from '@iso/assets/images/Music.svg';
import TalentImage from '@iso/assets/images/talent.jpg';
import CheckIcon from '@iso/components/icons/Check';
import Button from '@iso/components/uielements/button';
import { RadioButton, RadioGroup } from '@iso/components/uielements/radio';
import AccountTypes from '@iso/enums/account_types';
import { Card, Col, Divider, Row } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import ChooseAccountStyleWrapper, {
  AccountCardAmountStyle,
  AccountCardContentWrapperStyle,
  AccountCardFooterWrapperStyle,
  AccountCardPriceWrapperStyle,
  AccountCardTitleWrapperStyle,
  AccountCardWrapperStyle,
  AccountTypeDiv
} from './ChooseAccount.styles';

const BandLeaderAccountRole = [
  'Hold Talents',
  'Book Talents',
  "Network with industry Pro's",
  'Easy Invoicing & Payments'
];

const TalentBandLeaderAccountRole = [
  'Showcase your Skills & Get hired',
  'Get Paid FAST',
  'Your own Buddi Wallet',
  "Network with industry Pro's"
];
const ACCOUNTS = [
  {
    type: AccountTypes.BAND_LEADER,
    icon: BandLeader,
    background: BandLeaderImage,
    title: 'BandLeader Account',
    price: 'Free',
    features: [
      'Hold Musicians',
      'Book Musicians',
      "Network with industry Pro's",
      'Easy Invoicing & Payments'
    ]
  },
  {
    type: AccountTypes.TALENT,
    icon: MusicIcon,
    title: 'Talent Account',
    background: TalentImage,
    price: 'Free',
    features: [
      'Showcase your Skills & Get hired',
      'Get Paid FAST',
      'Your own Buddi Wallet',
      "Network with industry Pro's"
    ]
  }
];

export default ({ accountType, onSelect, onNext }) => {
  const { view } = useSelector((state) => state.App);

  const onAccountTypeChange = (e) => {
    const selectedAccountType = e.target.value;
    onSelect(selectedAccountType);
  };

  const onAccountTypeNext = (type) => {
    onSelect(type);
    onNext();
  };
  const AccountCardPortrait = ({ account }) => (
    <RadioButton value={account.type} className='account-option'>
      <AccountTypeDiv
        background={account.background}
        isChecked={accountType === account.type}
      >
        <div className='account-type-image'></div>
        <div className='card'>
          <div className='card-icon'>
            <img src={account.icon} />
          </div>
          <div className='card-head'>
            <h2 className='card-title'>{account.title}</h2>
          </div>
          <div className='card-price'>
            <label>Pricing</label>
            <div className='pricingAmount free'>
              <span>{account.price}</span>
            </div>
          </div>
          <div className='card-content'>
            <ul>
              {account.features.map((role, index) => (
                <li key={`company-role-${index}`}>
                  <CheckIcon width={17} height={13} fill='#ff7f00' />
                  <span>{role}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className='card-action'>
            <Button
              type='primary'
              shape='round'
              onClick={() => onAccountTypeNext(account.type)}
            >
              Select
            </Button>
          </div>
        </div>
      </AccountTypeDiv>
    </RadioButton>
  );
  const AccountCardLandscape = ({ account }) => {
    return (
      <AccountCardWrapperStyle className='test'>
        <RadioButton value={account.type} className='account-option'>
          <Card>
            <div>
              <AccountCardTitleWrapperStyle className='account-card-title-wrapper'>
                <img src={account.icon} />
                <h2>{account.title}</h2>
              </AccountCardTitleWrapperStyle>
              <AccountCardContentWrapperStyle>
                <ul>
                  {account.features.map((role, index) => (
                    <li key={`company-role-${index}`}>
                      <CheckIcon width={17} height={13} fill='#ff7f00' />
                      <span>{role}</span>
                    </li>
                  ))}
                </ul>
              </AccountCardContentWrapperStyle>
            </div>
            <Divider />
            <AccountCardFooterWrapperStyle>
              <AccountCardPriceWrapperStyle>
                <span>Pricing:</span>
                <AccountCardAmountStyle className='price-amount'>
                  {account.price}
                </AccountCardAmountStyle>
              </AccountCardPriceWrapperStyle>
              <Button
                type='primary'
                shape='round'
                onClick={() => onAccountTypeNext(account.type)}
              >
                Select
              </Button>
            </AccountCardFooterWrapperStyle>
          </Card>
        </RadioButton>
      </AccountCardWrapperStyle>
    );
  };
  return (
    <ChooseAccountStyleWrapper>
      <h1>Choose The Right Account</h1>
      <RadioGroup
        onChange={onAccountTypeChange}
        value={accountType}
        className='account-options'
      >
        {view === 'MobileView' ? (
          ACCOUNTS.map((account) => <AccountCardLandscape account={account} />)
        ) : (
          <Row gutter={{ xs: 0, sm: 0, md: 30 }} justify='center'>
            {ACCOUNTS.map((account) => (
              <Col md={12}>
                <AccountCardPortrait account={account} />
              </Col>
            ))}
          </Row>
        )}
      </RadioGroup>
    </ChooseAccountStyleWrapper>
  );
};
