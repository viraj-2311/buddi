import React, { useState } from 'react';
import RequestPaymentItemWrapper from './RequestPaymentItem.style';
import Button from '@iso/components/uielements/button';
import { formatDateString } from '@iso/lib/helpers/utility';
import { displayDateFormat } from '@iso/config/datetime.config';
import Empty_Avatar from '@iso/assets/images/empty-profile.png';
import {
  displayFormatMoney,
  convertCurrencyToDollar,
} from '@iso/lib/helpers/numberUtil';

const RequestPaymentItem = ({
  transferItem,
  handleProceedPayment,
  removeActivityPayment,
}) => {
  let moneyFormat = displayFormatMoney(
    convertCurrencyToDollar(transferItem.amount)
  );

  const getSilaRepr = () => {
    let silaRepr;
    //silaUserRepr is object user that request payment to you
    if (transferItem.silaUserRepr) {
      silaRepr = transferItem.silaUserRepr;
    } else {
      silaRepr = transferItem.silaCorporateRepr;
    }
    return silaRepr;
  };

  const hasPayToUser = () => {
    if (transferItem.silaUserRepr) {
      return true;
    }
    return false;
  };

  const getProfileImage = () => {
    if (
      hasPayToUser() &&
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

  const removeActivity = () => {
    let data = {
      payment_id: transferItem.id,
    };
    removeActivityPayment(data, false);
  };

  const payNow = () => {
    if (hasPayToUser()) {
      const silaRepr = getSilaRepr();
      let data = {
        name: silaRepr.firstName + ' ' + silaRepr.lastName,
        userId: silaRepr.user,
        companyId: null,
        amount: moneyFormat,
        requestPaynow: true,
        payment_id: transferItem.id,
        id: silaRepr.id,
      };
      handleProceedPayment(data);
    } else {
      let data = {
        name: silaRepr.legalCompanyName,
        userId: null,
        companyId: silaRepr.company,
        amount: moneyFormat,
        requestPaynow: true,
        payment_id: transferItem.id,
        id: silaRepr.id,
      };
      handleProceedPayment(data);
    }
  };

  const silaRepr = getSilaRepr();
  if (transferItem.requesteeStatus === 'hidden') {
    return null;
  }

  return (
    <RequestPaymentItemWrapper>
      <div className='panel-header'>
        <div className='header-icon-view'>
          <img src={getProfileImage()} alt='Profile' />
        </div>
        <div className='panel-header-content'>
          <div className='user-info'>
            <p className='event'>
              {hasPayToUser()
                ? `${
                    silaRepr.firstName + ' ' + silaRepr.lastName
                  } - Requested a payment`
                : `${silaRepr.legalCompanyName} - Requested a payment`}
            </p>
            <p className='date'>
              {formatDateString(transferItem.createdAt, displayDateFormat)}
            </p>
            <p className='description'>{`Note: ${
              transferItem.note ? transferItem.note : '-'
            } `}</p>
            {(transferItem.requesteeStatus === 'completed' ||
              transferItem.requesteeStatus === 'rejected') && (
              <p className='description'>
                Payment:{' '}
                <span className={`${transferItem.requesteeStatus}`}>
                  {transferItem.requesteeStatus}
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
                transferItem.requesteeStatus === 'completed' ||
                transferItem.requesteeStatus === 'rejected'
                  ? removeActivity
                  : payNow
              }
            >
              {transferItem.requesteeStatus === 'completed' ||
              transferItem.requesteeStatus === 'rejected'
                ? 'Hide'
                : 'Pay now'}
            </Button>
          </div>
        </div>
      </div>
    </RequestPaymentItemWrapper>
  );
};

export default RequestPaymentItem;
