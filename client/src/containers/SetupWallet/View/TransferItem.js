import React from 'react';
import TransferItemWrapper from './TransferItem.style';
import MasterIcon from '@iso/components/icons/Master';
import { formatDateString } from '@iso/lib/helpers/utility';
import { displayDateFormat } from '@iso/config/datetime.config';
import {
  displayFormatMoney,
  convertCurrencyToDollar,
} from '@iso/lib/helpers/numberUtil';

const TransferItem = ({ openHistory, transferItem }) => {
  const moneyFormat = displayFormatMoney(
    convertCurrencyToDollar(transferItem.amount)
  );
  const receivingMoney = transferItem.side === 'credit';
  const getSilaRepr = () => {
    let silaRepr;
    //silaUserRepr is object user that request payment to you
    if (transferItem.toUserRepr) {
      silaRepr = transferItem.toUserRepr;
    } else {
      silaRepr = transferItem.toCompanyRepr;
    }
    return silaRepr;
  };

  const hasPayToUser = () => {
    if (transferItem.toUserRepr) {
      return true;
    }
    return false;
  };

  const displayTitle = () => {
    let title = '-';
    if (receivingMoney) {
      if (transferItem.processed) {
        if (transferItem.senderName) {
          title = `${transferItem.senderName} paid you`;
        } else if (transferItem.type === 'fiat_to_sila') {
          title = `Transferred funds from your bank to your wallet account`;
        } else if (transferItem.type === 'sila_to_fiat') {
          title = `Transferred funds from your wallet to your bank account`;
        }
      } else {
        if (transferItem.senderName) {
          title = `Pending - Payment from ${transferItem.senderName}`;
        } else if (transferItem.type === 'fiat_to_sila') {
          title = `Pending - Bank to Wallet Account Transfer`;
        } else if (transferItem.type === 'sila_to_fiat') {
          title = `Pending - Wallet to Bank Account Transfer`;
        }
      }
    } else {
      if (transferItem.processed) {
        if (transferItem.receiverName) {
          title = `Transferred payment to ${transferItem.receiverName}`;
        } else if (transferItem.type === 'fiat_to_sila') {
          title = `Transferred funds from your bank to your wallet account`;
        } else if (transferItem.type === 'sila_to_fiat') {
          title = `Transferred funds from your wallet to your bank account`;
        }
      } else {
        if (transferItem.receiverName) {
          title = `Pending - Payment from ${transferItem.receiverName}`;
        } else if (transferItem.type === 'fiat_to_sila') {
          title = `Pending - Bank to Wallet Account Transfer`;
        } else if (transferItem.type === 'sila_to_fiat') {
          title = `Pending - Wallet to Bank Account Transfer`;
        }
      }
    }
    return title;
  };

  const silaUser = getSilaRepr();
  return (
    <TransferItemWrapper
      onClick={() => {
        openHistory();
      }}
    >
      <div className='panel-header'>
        <div className='header-icon-view'>
          <MasterIcon width={16} height={16} fill='#FFFFFF' />
        </div>
        <div className='panel-header-content'>
          <div className='user-info'>
            <p className={transferItem.processed ? 'event' : 'event pending'}>
              {displayTitle()}
            </p>
            <p className='date'>
              {formatDateString(transferItem.createdAt, displayDateFormat)}
            </p>
            <p className='description'>
              {transferItem.note ? transferItem.note : '-'}
            </p>
          </div>
          <div className={`total-money ${receivingMoney ? 'positive' : ''}`}>
            <span>{receivingMoney ? `+ $` : `- $`}</span>
            <span>{`${moneyFormat}`}</span>
          </div>
        </div>
      </div>
    </TransferItemWrapper>
  );
};

export default TransferItem;
