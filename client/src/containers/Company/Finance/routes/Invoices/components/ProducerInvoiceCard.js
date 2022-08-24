import React from 'react';
import ProducerInvoiceCardWrapper from './ProducerInvoiceCard.style';
import { InvoiceStatusWithCount } from './InvoiceStatus';

const ProducerInvoiceCard = ({ invoice, onOpen }) => {
  const { job } = invoice;
  const { client, title } = job;
  const { status: invoiceStatus, canHandleInvoice } = invoice;

  const handleOpen = () => {
    // onOpen(invoice);
  };

  const invoiceStatusList = [
    {
      status: 'Paid',
      count: 2,
    },
    {
      status: 'Received',
      count: 4,
    },
    {
      status: 'Requested',
      count: 34,
    },
    {
      status: 'Overdue',
      count: 5,
    },

    {
      status: 'In Dispute',
      count: 12,
    },
    {
      status: 'Processing',
      count: 14,
    },
  ];

  return (
    <ProducerInvoiceCardWrapper onClick={handleOpen}>
      {/* <div className="invoiceHeader">
        {invoiceStatusList.map(({ status, count }, index) => (
          <InvoiceStatusWithCount key={status} status={status} count={count} />
        ))}
      </div> */}
      <div className="invoiceBody">
        <div className="jobHeadText">
          <div className="jobTitle">{client}</div>
          <div>{title}</div>
        </div>
        <div className="jobText">
          <div className="blockText">
            <strong>Date(s)</strong>
            <br />
            <div>Feb 15 - Mar 15, 2021</div>
          </div>
          <div className="blockText">
            <strong>Crew Paid</strong>
            <br />
            <div>2/40</div>
          </div>
        </div>
      </div>
      <div className="invoiceFooter">
        <div className="jobText">
          <div className="blockText">
            <strong>Project Rate</strong>
            <br />
            <div className="rate">$200,000.00</div>
          </div>
          <div className="blockText">
            <strong>Total Unpaid</strong>
            <br />
            <div className="rate">$190,000.00</div>
          </div>
          <div className="blockText">
            <strong>Total Paid</strong>
            <br />
            <div className="rate">
              <strong className="green">$10,000.00</strong>
            </div>
          </div>
        </div>
      </div>
    </ProducerInvoiceCardWrapper>
  );
};

export default ProducerInvoiceCard;
