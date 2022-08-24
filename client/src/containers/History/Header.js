import React from 'react';
import HeaderWrapper from './Header.style';
import basicStyle from '@iso/assets/styles/constants';
import BackIcon from '@iso/components/icons/Back';
import Button from '@iso/components/uielements/button';

const PageHeader = ({ goBack }) => {
  return (
    <HeaderWrapper>
      <div className='header-top'>
        <div className='header-left'>
          <Button type='link' onClick={goBack} className='goBackBtn'>
            <BackIcon width={12} height={20} />
          </Button>
          <div className='header-title'>
            <p>
              Buddi Wallet / <strong>History</strong>
            </p>
          </div>
        </div>

        {/* <div className='header-right'>
          <div className='header-right-text'></div>
          <div className='header-right-action'></div>
        </div> */}
      </div>
    </HeaderWrapper>
  );
};

export default PageHeader;
