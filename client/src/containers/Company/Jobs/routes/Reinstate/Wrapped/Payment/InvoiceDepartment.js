import React, { useState, useEffect, useMemo } from "react";
import { Col, Menu, Row, Tooltip } from "antd";
import InvoiceDepartmentWrapper from "./InvoiceDepartment.style";
import Checkbox from "@iso/components/uielements/checkbox";
import InvoicePreview from "./InvoicePreview";
import Badge from "@iso/components/uielements/badge";
import CurrencyText from "@iso/components/utility/currencyText";
import InvoiceProducerStatus from "@iso/enums/invoice_producer_status";
import MemoPreview from "../../../JobDetails/MemoForm/MemoPreview";
import StatusTag from "@iso/components/utility/statusTag";
import IconInfo from "@iso/components/icons/IconInfo";

import notify from '@iso/lib/helpers/notify';
import { showServerError } from '@iso/lib/helpers/utility';

import InvoiceStatus from "../../../../../../Person/Finance/routes/Invoices/components/InvoiceStatus";
import { PaymentSummaryStatus } from "../../../../../../../enums/invoice_producer_status";

const { SubMenu } = Menu;

const InvoiceDepartment = ({
  job,
  department,
  memos,
  selectedPositions,
  onSelect,
  opened = false,
}) => {
  const [open, setOpen] = useState(opened);
  const [invoicePreview, setInvoicePreview] = useState({
    visible: false,
    invoiceMemo: null,
  });

  const [memoPreview, setMemoPreview] = useState({
    visible: false,
    memo: null,
  });
  const [leftWidth, setLeftWidth] = useState(0);

  const departmentKey = useMemo(() => {
    return `department-${department.id}`;
  }, [department]);

  const departmentPositions = useMemo(() => {
    return department?.jobRoles.map((p) => p?.id);
  }, [department]);

  const approved = useMemo(() => {
    let a = [];
    if (job?.wrapAndPayType && job?.wrapAndPayType !== 1) {
      if (departmentPositions && departmentPositions.length > 0) {
        departmentPositions.map((position) => {
          const invoiceMemo = memos[position];

          if (invoiceMemo && invoiceMemo.length) {
            if (
              invoiceMemo[0].invoice.invoiceStatus === "Approved" &&
              ![
                PaymentSummaryStatus.PAYMENT_PROCESSING,
                PaymentSummaryStatus.PAYMENT_SENT,
              ].includes(invoiceMemo[0].invoice.paymentStatus)
            ) {
              a.push(invoiceMemo[0]);
            }
          }
        });
      }
    }

    return a;
  }, [memos]);

  const isApprovedPosition = (position) => {
    const invoiceMemo = memos[position?.id];
    if (invoiceMemo && invoiceMemo.length) {
      return invoiceMemo[0]?.invoice?.invoiceStatus === "Approved"
        ? true
        : false;
    }

    return false;
  };

  const onInvoiceView = (invoiceMemo) => {
    if (!canViewInvoice(invoiceMemo?.invoice)) return;
    setInvoicePreview({ visible: true, invoiceMemo: invoiceMemo });
  };

  const onMemoView = (invoiceMemo) => {
    invoiceMemo = {...invoiceMemo , setTime:job.setTime };
    invoiceMemo = {...invoiceMemo , soundCheckTime:job.soundCheckTime };
    invoiceMemo = {...invoiceMemo , client:job.client };
    setMemoPreview({ visible: true, memo: invoiceMemo });
  };

  const handleMemoPreview = (type) => {
    if (type === "close") {
      setMemoPreview({ visible: false, memo: null });
    }
  };

  const handleInvoicePreview = (type, data) => {
    if (type === "close") {
      setInvoicePreview({ visible: false, invoiceMemo: null });
    }
  };

  const onPositionSelectAll = (selected) => {
    let newPositions = [];
    if (selected) {
      newPositions = [...selectedPositions, ...departmentPositions];
    } else {
      newPositions = selectedPositions.filter(
        (p) => !departmentPositions.includes(p)
      );
    }

    onSelect(newPositions);
  };

  const onPositionSelect = (selected, position) => {
    let newPositions = [];
    if (selected) {
      newPositions = [...selectedPositions, position?.id];
    } else {
      newPositions = selectedPositions.filter((p) => p !== position?.id);
    }

    onSelect(newPositions);
  };

  const canViewInvoice = (invoice) => {
    return (
      invoice && invoice?.invoiceStatus !== InvoiceProducerStatus.REQUESTED
    );
  };

  const calculateWidthLeftMenu = () => {
    const widthContent = document.getElementById("departmentPositionList");
    if (widthContent) {
      if (widthContent.clientWidth + 1 < leftWidth) {
        return leftWidth + "px";
      } else if (widthContent.clientWidth + 1 > leftWidth) {
        setLeftWidth(widthContent.clientWidth + 1);
      } else {
        return leftWidth + "px";
      }
    }
    return 0;
  };

  return (
    <InvoiceDepartmentWrapper
      className="inner-scroll"
      leftContentWidth={calculateWidthLeftMenu()}
    >
      <Row span="24" className="left-table d-flex">
        <div
          className="departmentListWrapper"
          style={{ width: `${leftWidth > 0 ? leftWidth + "px" : "auto"}` }}
        >
          <Menu
            mode="inline"
            inlineIndent={0}
            selectable={false}
            className="departmentList"
            defaultOpenKeys={opened ? [departmentKey] : []}
          >
            <SubMenu
              key={departmentKey}
              className="departmentPositionList"
              id="departmentPositionList"
              onTitleClick={(key, e) => setOpen(!open)}
              title={
                <>
                    <Checkbox
                      color="#19913d"
                      checked={departmentPositions.every((dp) =>
                        selectedPositions.includes(dp)
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onPositionSelectAll(e.target.checked);
                      }}
                    />
                  <span className="departmentName" title={department?.title}>
                    {department?.title}
                  </span>
                  <Badge count={approved.length} />
                </>
              }
            >
              {department?.jobRoles.map((jobRole) => {
                const invoiceMemo = memos[jobRole?.id]
                  ? memos[jobRole?.id][0]
                  : null; 
                return (
                  <Menu.Item
                    // disabled={isApprovedPosition(jobRole)}
                    key={`department-${department?.id}-role-${jobRole?.id}`}
                  >
                      <Checkbox
                        color="#19913d"
                        // disabled={isApprovedPosition(jobRole)}
                        checked={
                          selectedPositions.includes(jobRole?.id) 
                          // || isApprovedPosition(jobRole)
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          onPositionSelect(e.target.checked, jobRole);
                        }}
                      />
                    <span className="positionName" title={jobRole?.title}>
                      {jobRole?.title}
                    </span>
                 
                    {invoiceMemo?.invoice?.statusMessage && (
                    <Tooltip title={invoiceMemo?.invoice?.statusMessage} placement="bottomRight">
                      <div className="info-tooltip">!</div>
                    </Tooltip>
                    )}
                  </Menu.Item>
                );
              })}
            </SubMenu>
          </Menu>
        </div>
        <div className="invoiceDepartmentTable">
          <table className="table-global">
            <thead>
              <tr>
                <th>Talent</th>
                <th>Memo Total</th>
                {job?.wrapAndPayType && job?.wrapAndPayType !== 1 ? (
                <th>Invoice Amount</th>
                ) : null}
                {job?.wrapAndPayType && job?.wrapAndPayType !== 1 ? (
                <th>Invoice Status</th>
                ) : null}
                <th>Payment Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {open && (
                <>
                  <tr className="padding-view" />
                  {department?.jobRoles.map((jobRole) => {
                    const invoiceMemo = memos[jobRole?.id]
                      ? memos[jobRole?.id][0]
                      : null;

                    if (!invoiceMemo) return null;

                    return (
                      <tr key={`crew-invoice-memo-${invoiceMemo.id}`}>
                        <td>{invoiceMemo?.fullName}</td>
                        <td>
                          <CurrencyText
                            value={
                              invoiceMemo?.jobMemo?.totalPrice ||
                              invoiceMemo?.totalPrice
                            }
                          />
                        </td>
                        {job?.wrapAndPayType && job?.wrapAndPayType !== 1 ? (
                        <td>
                          <CurrencyText
                            value={invoiceMemo?.invoice?.totalPrice}
                          />
                        </td>
                         ) : null}
                         {job?.wrapAndPayType && job?.wrapAndPayType !== 1 ? (
                        <td>
                          {invoiceMemo?.invoice?.invoiceStatus ? (
                              InvoiceStatus(invoiceMemo?.invoice?.invoiceStatus)
                            ) : null}
                        </td>
                        ) : null}
                          <td>
                            {invoiceMemo?.invoice?.paymentStatus
                              ? InvoiceStatus(
                                  invoiceMemo?.invoice?.paymentStatus
                                )
                              : null}
                          </td>
                        <td className="action-btn">
                          {job?.wrapAndPayType && job?.wrapAndPayType !== 1 ? (
                            <a
                              disabled={!canViewInvoice(invoiceMemo?.invoice)}
                              type="link"
                              onClick={() => {
                                if(invoiceMemo?.invoice){
                                  onInvoiceView(invoiceMemo)
                                } else {
                                  notify('error', showServerError("Memo/Invoice not generated yet, please try again."));
                                }
                              }}
                            >
                              Invoice
                            </a>
                          ) : null}
                          <a
                            type="link"
                            onClick={() => {
                              if(invoiceMemo){
                                onMemoView(invoiceMemo);
                              } else {
                                notify('error', showServerError("Memo/Invoice not generated yet, please try again."));
                              }
                            }}
                          >
                            Memo
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="padding-view" />
                </>
              )}
            </tbody>
          </table>
        </div>
      </Row>
      {invoicePreview.visible && (
        <InvoicePreview
          job={job}
          invoiceMemo={invoicePreview.invoiceMemo}
          setModalData={handleInvoicePreview}
        />
      )}

      {memoPreview.visible && (
        <MemoPreview
          visible={memoPreview.visible}
          job={job}
          memo={memoPreview.memo}
          canEdit={false}
          setModalData={handleMemoPreview}
        />
      )}
    </InvoiceDepartmentWrapper>
  );
};

export default InvoiceDepartment;
