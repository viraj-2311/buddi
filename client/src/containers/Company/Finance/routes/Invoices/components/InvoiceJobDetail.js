import React from 'react';
import { useHistory } from 'react-router';
import InvoiceJobDetailWrapper from './InvoiceJobDetail.style';
import InvoiceStatus from './InvoiceStatus';
import { formatDateString } from '@iso/lib/helpers/utility';
import CurrencyText from '@iso/components/utility/currencyText';

const InvoiceJobDetail = ({ invoice }) => {
  const history = useHistory();
  const goBack = () => {
    history.push('../../jobs');
  };

  const { job } = invoice;

  return (
    <InvoiceJobDetailWrapper>
      <div className="header-top">
        <div className="header-left">
          <div className="header-title">
          <InvoiceStatus status={invoice.paymentStatus !== null ? invoice.paymentStatus : invoice.invoiceStatus} />
            <h1>{job.client}</h1>
            <p>
              {job.agency} &nbsp; | &nbsp; {job.title}
            </p>
            <div className="jobDetail">
              <div className="jobId">
                <strong>Gig #</strong>
                <span>{invoice.job.jobNumber}</span>
              </div>
              <div className="jobDate">
                <strong>Date(s):</strong>
                <span>{`${formatDateString(
                  invoice.job.startDate,
                  'MMMM Do, YYYY'
                )} - ${formatDateString(
                  invoice.job.wrapDate,
                  'MMMM Do, YYYY'
                )}`}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="invoiceTotal">
            <label>Total Invoice: </label>
            <span className="totalAmount">
              <CurrencyText value={invoice.totalInvoiceAmount} />
            </span>
          </div>
        </div>
      </div>
    </InvoiceJobDetailWrapper>
  );
};

export default InvoiceJobDetail;
