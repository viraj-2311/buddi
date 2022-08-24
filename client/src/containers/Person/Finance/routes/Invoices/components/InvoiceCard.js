import React from 'react';
import ContractorInvoiceCardWrapper from './InvoiceCard.style';
import Button from '@iso/components/uielements/button';
import CurrencyText from '@iso/components/utility/currencyText';
// import InvoiceStatus from './InvoiceStatus';
// import { MoreOutlined } from '@ant-design/icons';
import { formatDateString } from '@iso/lib/helpers/utility';
import { displayDateFormat } from '@iso/config/datetime.config';
import { InvoiceStatusSummaryStatus } from '@iso/enums/invoice_producer_status';
import { timeAgo } from '@iso/lib/helpers/utility';
import { InvoiceStatus } from '../../../../../Company/Finance/routes/Invoices/components/InvoiceStatus';

const ContractorInvoiceCard = ({ invoice, onOpen }) => {
  const { job } = invoice;
  const { client, title, jobNumber, shootDatesString } = job;
  const {
    invoiceStatus,
    paymentStatus,
    createdAt,
    paymentDue,
    invoiceDate,
    canHandleInvoice,
    totalInvoiceAmount: invoiceTotalPrice,
  } = invoice;

  const handleOpen = () => {
    if (!canHandleInvoice) return;
    onOpen(invoice);
  };

  // const MoreActions = (
  //   <Menu>
  //     <Menu.Item onClick={handleOpen}>Open</Menu.Item>
  //   </Menu>
  // );

  return (
    <ContractorInvoiceCardWrapper onClick={handleOpen}>
      {/* {invoice.canHandleInvoice && (
        <Dropdown overlay={MoreActions} overlayClassName="invoiceMenu" placement="bottomRight" trigger="click">
          <Button type="link" className="moreAction" onClick={(e) => e.stopPropagation()}><MoreOutlined /></Button>
        </Dropdown>
      )} */}
      <div className="invoiceHeader">
      <InvoiceStatus status={paymentStatus !== null ? paymentStatus : invoiceStatus} />
        <span className="timeAgo">{timeAgo(createdAt)}</span>
      </div>
      <div className="invoiceBody">
        <div className="jobHeadText">
          <div className="jobTitle">{client}</div>
          <div>{title}</div>
        </div>
        <div className="jobText">
          <div className="blockText">
            <strong>Gig ID</strong>
            <br />
            <div>{jobNumber}</div>
          </div>
          <div className="blockText">
            <strong>Date</strong>
            <br />
            <div>{formatDateString(invoiceDate, displayDateFormat)}</div>
          </div>
          <div className="blockText">
            <strong>Due</strong>
            <br />
            <div>{formatDateString(paymentDue, displayDateFormat)}</div>
          </div>
        </div>
      </div>
      <div className="invoiceFooter">
        <div>
          <span>
            <strong>Total</strong>
          </span>
          {/* {canHandleInvoice && ( */}
          <h2 className="totalPayPrice">
            <CurrencyText value={invoiceTotalPrice} />
          </h2>
          {/* )} */}
        </div>
        <Button
          className={
            invoiceStatus === InvoiceStatusSummaryStatus.RECEIVED
              ? 'editInvoice'
              : 'createInvoice'
          }
          type={
            invoiceStatus === InvoiceStatusSummaryStatus.RECEIVED
              ? 'default'
              : 'primary'
          }
          shape="round"
        >
          {`${
            invoiceStatus === InvoiceStatusSummaryStatus.RECEIVED
              ? 'Edit'
              : 'Create'
          } Invoice`}
        </Button>
      </div>
    </ContractorInvoiceCardWrapper>
  );
};

export default ContractorInvoiceCard;
