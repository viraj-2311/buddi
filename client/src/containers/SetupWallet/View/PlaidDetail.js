import React from 'react';
import { Col } from 'antd';
import Collapse from '@iso/components/uielements/collapse';
import { SectionRow, PlaidDetailModalBodyWrapper } from './PlaidDetail.style';
const { Panel } = Collapse;
const PlaidDetail = () => {
  const renderHeader = (title) => {
    return (
      <div className='title-header'>
        <span>{title}</span>
      </div>
    );
  };

  return (
    <PlaidDetailModalBodyWrapper>
      <Collapse
        bordered={false}
        className='settingsSectionCollapse'
        expandIconPosition={'right'}
        defaultActiveKey={'section-active-1'}
        accordion={true}
      >
        <Panel
          header={renderHeader('What is Plaid?')}
          key='section-active-1'
          id='section-active-1'
        >
          <div className='description'>
            Plaid is our financial services partner that securely links user
            bank accounts to our platform. This way, we never access your info
            directly. Plaid is trusted by over 11,000 financial institutions to
            make it easier to manage transfer and invest their money.
          </div>
        </Panel>
        <Panel
          header={renderHeader('How It Works.')}
          key='section-active-2'
          id='section-active-2'
        >
          <div className='description'>
            All you do is choose your financial institution, enter your login ID
            and password for that financial institution. Using end-to-end
            encryption, multi-factor authorization, cloud infrastructure, robust
            monitoring, and third party security reviews, Plaid securely shares
            the info you've chosen to link, like a checking account number, with
            the platform you are using.
          </div>
        </Panel>
        <Panel
          header={renderHeader('Is Plaid Safe?')}
          key='section-active-3'
          id='section-active-3'
        >
          <div className='description'>
            When you link your checking account with a financial application,
            the company will instantly encrypt sensitive data sharing it with a
            secure connection. They never share your login and password with us
            which is essential when asked to share info with a third party.
          </div>
        </Panel>
      </Collapse>
    </PlaidDetailModalBodyWrapper>
  );
};

export default PlaidDetail;
