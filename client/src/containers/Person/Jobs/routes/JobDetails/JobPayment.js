import React from 'react';
import ContractorJobPaymentWrapper from './JobPayment.style';
import CurrencyText from '@iso/components/utility/currencyText';
import MemoPriceTypes from '@iso/enums/memo_price_types';

const ContractorJobPayment = ({ job }) => {
  const {
    workingRate,
    payTerms,
    dailyHours,
    workingDays,
    rates,
    projectRate: jobProjectRate,
    priceType: jobPriceType,
  } = job;
  return (
    <ContractorJobPaymentWrapper>
      {/* <div className="paymentInfos">
        <div className="paymentInfoLabel">Pay Terms:</div>
        <div className="paymentInfoDetails">NET - {payTerms}</div>
      </div> */}

      {jobPriceType === MemoPriceTypes.HOURLY && (
        <div className="paymentInfos">
          <div className="paymentInfoLabel">Set Length:</div>
          <div className="paymentInfoDetails">{dailyHours}</div>
        </div>
      )}

      {jobPriceType === MemoPriceTypes.HOURLY && (
        <div className="paymentInfos">
          <div className="paymentInfoLabel">Gig Rate Per Day:</div>
          <div className="paymentInfoDetails">
            <CurrencyText value={workingRate} />
            <span className="paymentWorkingDay">{` x ${workingDays}`}</span>
          </div>
        </div>
      )}

      {jobPriceType === MemoPriceTypes.FIXED && (
        <div className="paymentInfos">
          <div className="paymentInfoLabel">Project Rate:</div>
          <div className="paymentInfoDetails">
            <CurrencyText value={jobProjectRate} />
          </div>
        </div>
      )}

      {rates.map(
        ({ id, title, priceType, dayRate, numberOfDays, projectRate }) => (
          <div className="paymentInfos" key={id}>
            <div className="paymentInfoLabel">{title}</div>
            <div className="paymentInfoDetails">
              <CurrencyText
                value={
                  priceType === MemoPriceTypes.FIXED ? projectRate : dayRate
                }
              />
              {priceType === MemoPriceTypes.HOURLY && (
                <span className="paymentWorkingDay">{` x ${numberOfDays}`}</span>
              )}
            </div>
          </div>
        )
      )}
      <div className="totalPayWrapper">
        <div className="totalPayLabel">Total Pay:</div>
        <div className="totalPayAmount">
          <CurrencyText value={job.totalPrice} />
        </div>
      </div>
    </ContractorJobPaymentWrapper>
  );
};

export default ContractorJobPayment;
