import React, { useState } from 'react';
import YourRequestPaymentItemWrapper from './YourRequestPaymentItem.style';
import Button from '@iso/components/uielements/button';
import { formatDateString } from '@iso/lib/helpers/utility';
import { displayDateFormat } from '@iso/config/datetime.config';
import Empty_Avatar from '@iso/assets/images/user1.png';
import {
  displayFormatMoney,
  convertCurrencyToDollar,
} from '@iso/lib/helpers/numberUtil';

const YourRequestPaymentItem = ({
  transferItem,
  handleCancelPayment,
  removeActivityPayment,
}) => {
  let moneyFormat = displayFormatMoney(
    convertCurrencyToDollar(transferItem.amount)
  );

  const getSilaRepr = () => {
    let silaRepr;
    //silaToUserRepr is object user that you request payment
    if (transferItem.silaToUserRepr) {
      silaRepr = transferItem.silaToUserRepr;
    } else {
      silaRepr = transferItem.silaToCompanyRepr;
    }
    return silaRepr;
  };

  const hasRequestToUser = () => {
    if (transferItem.silaToUserRepr) {
      return true;
    }
    return false;
  };

  const getFullName = () => {
    if (hasRequestToUser()) {
      return silaRepr.firstName + ' ' + silaRepr.lastName;
    } else {
      return silaRepr.legalCompanyName;
    }
  };

  const cancelRequest = () => {
    let data = {
      status: 'canceled',
      payment_id: transferItem.id,
      message:
        `Do you want to cancel the request payment from ` + getFullName(),
    };
    handleCancelPayment(data);
  };

  const removeActivity = () => {
    let data = {
      payment_id: transferItem.id,
    };
    removeActivityPayment(data, true);
  };

  const getProfileImage = () => {
    if (
      hasRequestToUser() &&
      silaRepr &&
      silaRepr.userInfo &&
      silaRepr.userInfo.profilePhotoS3Url != null
    ) {
      return silaRepr.userInfo.profilePhotoS3Url;
    } else if (
      silaRepr &&
      silaRepr.companyInfo &&
      silaRepr.companyInfo.profilePhotoS3Url != null
    ) {
      return silaRepr.companyInfo.profilePhotoS3Url;
    } else {
      return Empty_Avatar;
    }
  };

  const silaRepr = getSilaRepr();
  if (transferItem && transferItem.requesterStatus === 'hidden') {
    return null;
  }
  return (
    <YourRequestPaymentItemWrapper>
      <div className='panel-header'>
        <div className='header-icon-view'>
          <img src={getProfileImage()} alt='Profile' />
        </div>
        <div className='panel-header-content'>
          <div className='user-info'>
            <p className='event'>
              {silaRepr ? hasRequestToUser()
                ? `You requested payment from ${
                    silaRepr.firstName + ' ' + silaRepr.lastName
                  }`
                : `You requested payment from ${silaRepr.legalCompanyName}`
                : '-'}
            </p>
            <p className='date'>
              {formatDateString(transferItem.createdAt, displayDateFormat)}
            </p>
            <p className='description'>{`Note: ${
              transferItem.note ? transferItem.note : '-'
            } `}</p>
            {(transferItem.requesterStatus === 'completed' ||
              transferItem.requesterStatus === 'rejected') && (
              <p className='description'>
                Status:{' '}
                <span className={`${transferItem.requesterStatus}`}>
                  {transferItem.requesterStatus}
                </span>
              </p>
            )}
          </div>
        </div>
        <div className='total-money'>
          <div>
            <span>{`$${moneyFormat}`}</span>
          </div>
          <div>
            <Button
              className={'paynow-button'}
              type='primary'
              shape='round'
              onClick={
                transferItem.requesterStatus === 'completed' ||
                transferItem.requesterStatus === 'rejected'
                  ? removeActivity
                  : cancelRequest
              }
            >
              {transferItem.requesterStatus === 'completed' ||
              transferItem.requesterStatus === 'rejected'
                ? 'Hide'
                : 'Cancel'}
            </Button>
          </div>
        </div>
      </div>
    </YourRequestPaymentItemWrapper>
  );
};

export default YourRequestPaymentItem;
