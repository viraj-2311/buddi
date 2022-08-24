import React from 'react';
import Button from '@iso/components/uielements/button';
import CheckIcon from '@iso/components/icons/Check';
import RegisterSuccessWrapper from './RegisterSuccess.style';

const LinkBankSuccess = ({ onClose }) => {
  return (
    <RegisterSuccessWrapper>
      <div>
        <Button type='success' shape='circle' size={15}>
          <CheckIcon width={34} height={26} fill={'#ffffff'} />
        </Button>
      </div>
      <div className='success-message'>Congratulations!</div>
      <div className='success-account'>
        You’ve completed all steps and certifications, and your team is ready to
        link bank accounts, create wallets, and transact! Continue on to get
        started.
      </div>
      <div className='button-view'>
        <div className='bank-button'>
          <Button block type='primary' shape='round' onClick={onClose}>
            Link a Bank Account
          </Button>
        </div>
      </div>
    </RegisterSuccessWrapper>
  );
};

export default LinkBankSuccess;
