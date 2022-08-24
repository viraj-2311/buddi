import React from 'react';
import Button from '@iso/components/uielements/button';
import CheckIcon from '@iso/components/icons/Check';
import LinkBankSuccessWrapper from './LinkBankSuccess.style';

const LinkBankSuccess = ({ onClose, bankCardNumber }) => {
  var lastFourDigits = bankCardNumber.substr(bankCardNumber.length - 4);
  return (
    <LinkBankSuccessWrapper>
      <div>
        <Button type='success' shape='circle' size={15}>
          <CheckIcon width={34} height={26} fill={'#ffffff'} />
        </Button>
      </div>
      <div className='success-message'>
        You linked successfully manual bank account
      </div>
      <div className='success-account'>****{lastFourDigits}</div>
      <div>
        <Button
          block
          className='bank-button'
          type='primary'
          shape='round'
          onClick={onClose}
        >
          Done
        </Button>
      </div>
    </LinkBankSuccessWrapper>
  );
};

export default LinkBankSuccess;
