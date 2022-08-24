import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import PaymentStatusTagStyle from "./PaymentStatusTag.style";
import InvoiceProducerStatus from "@iso/enums/invoice_producer_status";

const PaymentStatusTag = () => {
  const { payApproved, invoiceMemos } = useSelector(
    (state) => state.JobInvoice
  );
  const paymentStatuses = [
    {
      status: "processing",
      color: "#a3a0fb",
      text: "Processing",
    },
    {
      status: "error",
      color: "#e25656",
      text: "Failed",
    },
    {
      status: "paid",
      color: "#19913d",
      text: "Paid",
    },
  ];

  const paymentStatus = useMemo(() => {
    let paymentStatus;
    if (payApproved.error) {
      return "error";
    }

    if (payApproved.success) {
      paymentStatus = "processing";
    }

    if (invoiceMemos.length > 0) {
      let paidInvoicesCount = 0;
      let payProcessingInvoicesCount = 0;
      let payFailedInvoicesCount = 0;
      for (let invoiceMemo of invoiceMemos) {
        if (
            invoiceMemo?.invoice?.paymentStatus ===
            InvoiceProducerStatus.PAYMENT_SENT
        ) {
          ++paidInvoicesCount;
        } else if (
            invoiceMemo?.invoice?.paymentStatus ===
            InvoiceProducerStatus.PAYMENT_PROCESSING
        ) {
          ++payProcessingInvoicesCount;
        } else if (
            invoiceMemo?.invoice?.paymentStatus ===
            InvoiceProducerStatus.PAYMENT_FAILED
        ) {
          ++payFailedInvoicesCount;
        }
      }

      if (paidInvoicesCount > 0 && paidInvoicesCount === invoiceMemos.length) {
        paymentStatus = "paid";
      } else if (payProcessingInvoicesCount > 0) {
        paymentStatus = "processing";
      } else if (
          payFailedInvoicesCount > 0 &&
          paidInvoicesCount !== invoiceMemos.length
      ) {
        paymentStatus = "failed";
      }
    }

    return paymentStatus;
  }, [payApproved, invoiceMemos]);

  const paymentStatusItem = paymentStatuses.filter((item) => {
    return item.status === paymentStatus;
  })[0];

  return paymentStatusItem ? (
    <PaymentStatusTagStyle
      className={"payment-badge"}
      color={paymentStatusItem.color}
    >
      {paymentStatusItem.text}
    </PaymentStatusTagStyle>
  ) : (
    <></>
  );
};

export default PaymentStatusTag;
