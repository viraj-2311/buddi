import React from 'react';
import Button from '@iso/components/uielements/button';
import CheckIcon from '@iso/components/icons/Check';
import LinkBankSuccessWrapper from './LinkBankSuccess.style';
import { formatMoney } from '@iso/lib/helpers/numberUtil';

const TransferFundSuccess = ({
  onClose,
  title,
  amount,
  description,
  account,
}) => {
  let moneyFormat = formatMoney(amount);
  return (
    <LinkBankSuccessWrapper>
      <div>
        <Button type='success' shape='circle' size={15}>
          <CheckIcon width={24} height={26} fill={'#ffffff'} />
        </Button>
      </div>
      <div className='success-message'>
        <p>{title}</p>
        <p>
          <span className='even-number'>${moneyFormat.evenMoney}</span>
          <span className='small-number'>.{moneyFormat.pence}</span>
        </p>
      </div>
      <div className='additional-success-message'>{description}</div>
      {account &&
        account.plaid_accounts &&
        account.plaid_accounts[0] &&
        account.plaid_accounts[0].accountNumber && (
          <div className='success-account'>
            {account.plaid_accounts[0].accountNumber}
          </div>
        )}

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

export default TransferFundSuccess;
