import React, { useEffect, useMemo, useState } from "react";
import IconInfo from "@iso/components/icons/IconInfo";
import Success from "@iso/components/icons/Success";
import PaymentAlertStyle from "./PaymentAlert.style";

import { useSelector } from "react-redux";
import { formatCurrency } from "@iso/lib/helpers/utility";
import { WarningTwoTone } from "@ant-design/icons";

import _ from "lodash";

const PaymentAlert = ({ status,selectedPosition, memos, canPayApproved }) => {
  const { invoiceMemos, invoicesPaidBy, payApproved } = useSelector(
    (state) => state.JobInvoice
  );
  let paidPayment = [];
  let paymentTotal = 0;
  const totalPayPrice = useMemo(() => {
    let paidInvoices = [];

    paidInvoices = invoiceMemos.filter((memo) => {
      return (
        memo.invoice?.invoiceStatus === "Approved" &&
        memo.invoice?.paymentStatus !== "Paid" &&
        selectedPosition.includes(memo?.jobRole)
      );
    });

    paidPayment = memos && memos.length > 0 ? memos.filter((memo) => {
      return memo.invoice?.paymentStatus === null || memo.invoice?.paymentStatus === "Failed"
    }) : [];

    paidPayment.map((memo) => {
      paymentTotal = paymentTotal + memo?.invoice?.totalPrice;
    });

    return paidInvoices.reduce(
      (sum, memo) => sum + memo?.invoice?.totalPrice,
      0
    );
  }, [invoiceMemos, selectedPosition, paidPayment]);

  const totalPriceFormatted = formatCurrency("$", paymentTotal);
  const isInvoicePaidByBank =
    invoicesPaidBy === "bank" || payApproved.method === "bank";

  const paymentAlertTypes = [
    {
      status: "processing",
      title: (
        <div className="title">
          <IconInfo width={27} height={27} fill="#a3a0fb" />
          <h3>
            Collecting funds from{" "}
            {isInvoicePaidByBank ? "Bank Account" : "your Buddi Wallet"}
          </h3>
        </div>
      ),
      description: isInvoicePaidByBank ? (
        <p>
          Since you elected to have Buddisystems fund this job from your Bank Account,{" "}
          <strong>{totalPriceFormatted}</strong> will be debited and then sent
          to the Buddi Wallet of individuals on this job. To ensure a timely
          processing, please ensure you have{" "}
          <strong>{totalPriceFormatted}</strong> available in your Bank Account.
        </p>
      ) : (
        <p>
          Since you elected to have Buddisystems fund this job from your Buddi Wallet, <strong>{totalPriceFormatted}</strong> will be debited and
          then sent to the Buddi Wallet of individuals on this job. To ensure a
          timely processing, please ensure you have{" "}
          <strong>{totalPriceFormatted}</strong> available in your Buddi Wallet
          account.
        </p>
      ),
    },
    {
      status: "failed",
      title: (
        <div className="title">
          <IconInfo width={27} height={27} fill="#e25656" />
          <h3>Payment Failed</h3>
        </div>
      ),
      description: "",
    },
    {
      status: "paid",
      title: (
        <div className="title">
          <Success width={27} height={27} fill="#19913d" />
          <h3>Congratulations! Payment has been successfully processed</h3>
        </div>
      ),
      description: <p>Funds transferred to all recipients on this job.</p>,
    },
    {
      status: "error",
      title: (
        <div className="title">
          <WarningTwoTone twoToneColor={"#e25656"} style={{ fontSize: 27 }} />
          <h3>An error occurred to processing your request</h3>
        </div>
      ),
      description: (
        <p>
          Unexpected error encountered while processing your request, please
          contact support.
        </p>
      ),
    },
  ];
  const paymentAlert = paymentAlertTypes.filter((item) => {
    return item.status === status;
  })[0];

  return paymentAlert && !canPayApproved ? (
    <div className="ant-alert-content">
      <PaymentAlertStyle
        message={paymentAlert.title}
        description={paymentAlert.description}
        type="info"
      />
    </div>
  ) : (
    <></>
  );
};

export default PaymentAlert;
