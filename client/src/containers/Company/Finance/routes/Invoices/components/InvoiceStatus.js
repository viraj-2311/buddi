import React from "react";
import InvoiceStatusWrapper from "@iso/components/utility/invoiceStatusWrapper";
import {
  InvoiceStatusSummaryStatus,
  PaymentSummaryStatus,
  InvoiceStatusSummaryStatusColor,
} from "@iso/enums/invoice_producer_status";
import InvoiceProducerStatus from "@iso/enums/invoice_producer_status";
import StatusTag from "@iso/components/utility/statusTag";

const InvoiceStatusWithCount = ({ status, count }) => {
  let displayStatus;
  switch (status) {
    case InvoiceStatusSummaryStatus.REQUESTED:
      displayStatus = "Requested";
      break;
    case InvoiceStatusSummaryStatus.RECEIVED:
      displayStatus = "Sent";
      break;
    case InvoiceStatusSummaryStatus.APPROVED:
      displayStatus = "Approved";
      break;
    case InvoiceStatusSummaryStatus.IN_DISPUTE:
      displayStatus = "In Dispute";
      break;
    case PaymentSummaryStatus.PAYMENT_SENT:
      displayStatus = "Paid";
      break;
    case PaymentSummaryStatus.PAYMENT_PROCESSING:
      displayStatus = "Processing";
      break;
    case PaymentSummaryStatus.PAYMENT_FAILED:
      displayStatus = "Failed";
      break;
    default:
      displayStatus = null;
      break;
  }

  return (
    <InvoiceStatusWrapper
      lightColor={InvoiceStatusSummaryStatusColor[status].light}
      darkColor={InvoiceStatusSummaryStatusColor[status].dark}
    >
      <span className="count"> {count}</span>
      <span>{displayStatus}</span>
    </InvoiceStatusWrapper>
  );
};

const InvoiceProducerStatusColor = {
  [InvoiceProducerStatus.REQUESTED]: "#bcbccb",
  [InvoiceProducerStatus.IN_DISPUTE]: "#ffa177",
  [InvoiceProducerStatus.APPROVED]: "#19913d",
  [InvoiceProducerStatus.RECEIVED]: "#808bff",
  [InvoiceProducerStatus.PAYMENT_SENT]: "#19913d",
  [InvoiceProducerStatus.PAYMENT_PROCESSING]: "#a3a0fb",
  [InvoiceProducerStatus.PAYMENT_FAILED]: "#e25656",
};

const InvoiceStatus = ({ status }) => {
  switch (status) {
    case InvoiceProducerStatus.REQUESTED:
      return (
        <StatusTag
          color={InvoiceProducerStatusColor[InvoiceProducerStatus.REQUESTED]}
        >
          Requested
        </StatusTag>
      );
    case InvoiceProducerStatus.PAYMENT_SENT:
      return (
        <StatusTag
          color={InvoiceProducerStatusColor[InvoiceProducerStatus.PAYMENT_SENT]}
        >
          Paid
        </StatusTag>
      );
    case InvoiceProducerStatus.PAYMENT_PROCESSING:
      return (
        <StatusTag
          color={
            InvoiceProducerStatusColor[InvoiceProducerStatus.PAYMENT_PROCESSING]
          }
        >
          Processing
        </StatusTag>
      );
    case InvoiceProducerStatus.PAYMENT_PROCESSING:
      return (
        <StatusTag
          color={
            InvoiceProducerStatusColor[InvoiceProducerStatus.PAYMENT_FAILED]
          }
        >
          Failed
        </StatusTag>
      );
    case InvoiceProducerStatus.APPROVED:
      return (
        <StatusTag
          color={InvoiceProducerStatusColor[InvoiceProducerStatus.APPROVED]}
        >
          Approved
        </StatusTag>
      );
    case InvoiceProducerStatus.RECEIVED:
      return (
        <StatusTag
          color={InvoiceProducerStatusColor[InvoiceProducerStatus.RECEIVED]}
        >
          Received
        </StatusTag>
      );
    case InvoiceProducerStatus.IN_DISPUTE:
      return (
        <StatusTag
          color={InvoiceProducerStatusColor[InvoiceProducerStatus.IN_DISPUTE]}
        >
          In Dispute
        </StatusTag>
      );
    default:
      return null;
  }
};

export { InvoiceStatusWithCount, InvoiceStatus };
