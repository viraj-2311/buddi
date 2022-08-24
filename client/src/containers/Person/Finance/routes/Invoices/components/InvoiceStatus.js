import React from 'react';
import StatusTag from '@iso/components/utility/statusTag';
import InvoiceProducerStatus from '@iso/enums/invoice_producer_status';

export const InvoiceProducerStatusColor = {
  [InvoiceProducerStatus.REQUESTED]: '#bcbccb',
  [InvoiceProducerStatus.IN_DISPUTE]: '#ffa177',
  [InvoiceProducerStatus.APPROVED]: '#19913d',
  [InvoiceProducerStatus.RECEIVED]: '#808bff',
  [InvoiceProducerStatus.PAYMENT_SENT]: '#19913d',
  [InvoiceProducerStatus.PAYMENT_PROCESSING]: '#a3a0fb',
  [InvoiceProducerStatus.PAYMENT_FAILED]: '#e25656',
};

const InvoiceStatus = ( status ) => {
  switch (status) {
    case InvoiceProducerStatus.REQUESTED:
      return <StatusTag color={InvoiceProducerStatusColor[InvoiceProducerStatus.REQUESTED]}>Requested</StatusTag>;
    case InvoiceProducerStatus.RECEIVED:
      return <StatusTag color={InvoiceProducerStatusColor[InvoiceProducerStatus.RECEIVED]}>Received</StatusTag>;
    case InvoiceProducerStatus.IN_DISPUTE:
      return <StatusTag color={InvoiceProducerStatusColor[InvoiceProducerStatus.IN_DISPUTE]}>In Dispute</StatusTag>;
    case InvoiceProducerStatus.APPROVED:
      return <StatusTag color={InvoiceProducerStatusColor[InvoiceProducerStatus.APPROVED]}>Approved</StatusTag>;
    case InvoiceProducerStatus.PAYMENT_SENT:
      return <StatusTag color={InvoiceProducerStatusColor[InvoiceProducerStatus.PAYMENT_SENT]}>Paid</StatusTag>;
    case InvoiceProducerStatus.PAYMENT_PROCESSING:
      return <StatusTag color={InvoiceProducerStatusColor[InvoiceProducerStatus.PAYMENT_PROCESSING]}>Processing</StatusTag>;
    case InvoiceProducerStatus.PAYMENT_FAILED:
      return <StatusTag color={InvoiceProducerStatusColor[InvoiceProducerStatus.PAYMENT_FAILED]}>Failed</StatusTag>;
    default:
      return null;
  }
};

export default InvoiceStatus;