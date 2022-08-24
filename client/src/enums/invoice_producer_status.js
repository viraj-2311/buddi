const InvoiceProducerStatus = {
  REQUESTED: 'Requested',
  IN_DISPUTE: 'In Dispute',
  APPROVED: 'Approved',
  RECEIVED: 'Received',
  PAYMENT_SENT: 'Paid',
  PAYMENT_PROCESSING: 'Processing',
  PAYMENT_FAILED: 'Failed'
};

export default InvoiceProducerStatus;

export const InvoiceStatusSummaryStatus = {
  ALL: 'All',
  REQUESTED: 'Requested',
  RECEIVED: 'Received',
  APPROVED: 'Approved',
  IN_DISPUTE: 'In Dispute',
};

export const PaymentSummaryStatus = {
  PAYMENT_SENT: 'Paid',
  PAYMENT_PROCESSING: 'Processing',
  PAYMENT_FAILED: 'Failed'
};

export const InvoiceStatusSummaryStatusColor = {
  [InvoiceStatusSummaryStatus.ALL]: { light: '#51369a', dark: '' },
  [InvoiceStatusSummaryStatus.REQUESTED]: { light: '#bcbccb', dark: '#9f9fac' },
  [InvoiceStatusSummaryStatus.RECEIVED]: { light: '#808bff', dark: '#5e68d1' },
  [InvoiceStatusSummaryStatus.IN_DISPUTE]: {
    light: '#ffa177',
    dark: '#ce8565',
  },
  [InvoiceStatusSummaryStatus.APPROVED]: { light: '#19913d', dark: '#11752f' },
  [PaymentSummaryStatus.PAYMENT_SENT]: { light: '#19913d', dark: '' },
  [PaymentSummaryStatus.PAYMENT_PROCESSING]: { light: '#a3a0fb', dark: '' },
  [PaymentSummaryStatus.PAYMENT_FAILED]: { light: '#e25656', dark: '' },
};

export const getInvoiceStatusesList = () => {
  const sValues = Object.values(InvoiceStatusSummaryStatus);
  const statusList = [];
  Object.keys(InvoiceStatusSummaryStatus).forEach((k, i) => {
    statusList.push({
      status: sValues[i],
      color:
        InvoiceStatusSummaryStatusColor[InvoiceStatusSummaryStatus[k]].light,
      count: 0,
    });
  });
  return statusList;
};

export const getPaymentSummaryStatusesList = () => {
  const sValues = Object.values(PaymentSummaryStatus);
  const statusList = [];
  Object.keys(PaymentSummaryStatus).forEach((k, i) => {
    statusList.push({
      status: sValues[i],
      color:
        InvoiceStatusSummaryStatusColor[PaymentSummaryStatus[k]].light,
      count: 0,
    });
  });
  return statusList;
};

export const FinanceStatusFilterType = {
  ALL: 'All',
  REQUESTED: 'Received',
  APPROVED: 'Approved',
  IN_DISPUTE: 'In Dispute',
  PROCESSING: 'Processing',
  PAID: 'Paid',
  SENT: 'Sent',
  OVERDUE: 'Overdue',
  INVOICE_SAVED: 'Invoice Saved ',
};

export const shortStatus = (status) => {
  switch (status) {
    case PaymentSummaryStatus.PAYMENT_SENT:
      return 'Paid';
    case PaymentSummaryStatus.PAYMENT_PROCESSING:
      return 'Processing';
    case PaymentSummaryStatus.PAYMENT_FAILED:
      return 'Failed';
    default:
      return null;
  }
}

export const financeStatusFilterList = [
  {
    status: FinanceStatusFilterType.ALL,
  },
  {
    status: FinanceStatusFilterType.REQUESTED,
  },
  {
    status: FinanceStatusFilterType.SENT,
  },
  {
    status: FinanceStatusFilterType.OVERDUE,
  },
  {
    status: FinanceStatusFilterType.IN_DISPUTE,
  },
];
