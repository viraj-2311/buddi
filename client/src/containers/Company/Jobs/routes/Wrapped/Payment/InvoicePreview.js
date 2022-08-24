import React, { useEffect, useState, createRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import { Row, Col } from "antd";
import { Textarea } from "@iso/components/uielements/input";
import CurrencyText from "@iso/components/utility/currencyText";
import PhoneText from "@iso/components/utility/phoneText";
import MemoPriceTypes from "@iso/enums/memo_price_types";
import StyledModal, {
  InvoicePreviewContentWrapper,
} from "./InvoicePreview.style";
import Logo from "@iso/assets/images/logo-black.webp";
import Select, { SelectOption } from "@iso/components/uielements/select";
import Button from "@iso/components/uielements/button";
import MultiplyIcon from "@iso/components/icons/Multiply";
import DownloadIcon from "@iso/components/icons/Download";
import IntlMessages from "@iso/components/utility/intlMessages";
import Loader from "@iso/components/utility/loader";
import InvoiceProducerStatus from "@iso/enums/invoice_producer_status";
import { formatDateString, base64Image } from "@iso/lib/helpers/utility";
import { displayDateFormat } from "@iso/config/datetime.config";
import {
  fetchInvoiceByMemoRequest,
  approveInvoiceRequest,
  disputeInvoiceRequest,
} from "@iso/redux/jobInvoice/actions";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  InvoiceStatusSummaryStatus,
  PaymentSummaryStatus,
} from "@iso/enums/invoice_producer_status";
import { changeInvoiceStatusValidationSchema } from "./schema";
import ContractorAttachmentPdfImg from "@iso/assets/images/pdf.svg";
import Icon from "@iso/components/icons/Icon";
import { DownloadOutlined } from "@ant-design/icons";
import { fetchJobDetailsRequest } from "../../../../../../redux/producerJob/actions";
import { fetchDownloadInvoiceRequest } from "../../../../../../redux/companyDocument/actions";

const Option = SelectOption;

const InvoicePreview = ({ job, invoiceMemo, setModalData }) => {
  const invoiceStatusOptions = [
    {
      status: InvoiceStatusSummaryStatus.APPROVED,
    },
    {
      status: InvoiceStatusSummaryStatus.IN_DISPUTE,
    },
  ];
  const dispatch = useDispatch();
  const { invoice, fetchInvoiceByMemo, approveInvoice, disputeInvoice } =
    useSelector((state) => state.JobInvoice);
  const [showLoader, setShowLoader] = useState(true);
  const [action, setAction] = useState("");
  const invoicePrintArea = createRef();
  const [formData, setFormData] = useState({
    invoiceStatus: "",
    reason: "",
  });

  useEffect(() => {
    setAction("fetch_invoice_detail");
    dispatch(fetchInvoiceByMemoRequest(job.id, invoiceMemo.id));
    const {
      invoice: { invoiceStatus: invoiceStatus, notes: reason },
    } = invoiceMemo;
    setFormData({ invoiceStatus, reason: reason || "" });
  }, [invoiceMemo]);

  useEffect(() => {
    if (
      !fetchInvoiceByMemo.loading &&
      !fetchInvoiceByMemo.error &&
      action === "fetch_invoice_detail"
    ) {
      setShowLoader(false);
    }

    if (!fetchInvoiceByMemo.loading && action === "fetch_invoice_detail") {
      setAction("");
    }
  }, [fetchInvoiceByMemo]);

  useEffect(() => {
    if (
      (!approveInvoice.loading &&
        !approveInvoice.error &&
        action === "approve_invoice_request") ||
      (!disputeInvoice.loading &&
        !disputeInvoice.error &&
        action === "dispute_invoice_request")
    ) {
      setModalData("close");
    }

    if (
      (!approveInvoice.loading && action === "approve_invoice_request") ||
      (!disputeInvoice.loading && action === "dispute_invoice_request")
    ) {
      setAction("");
    }
  }, [approveInvoice, disputeInvoice]);

  const canEdit = useMemo(() => {
    return (
      invoice &&
      ![
        PaymentSummaryStatus.PAYMENT_SENT,
        PaymentSummaryStatus.PAYMENT_PROCESSING,
      ].includes(invoice?.paymentStatus)
    );
  }, [invoice]);

  const handleCancel = () => {
    setModalData("close");
  };

  const handleInvoiceStatus = async (values) => {
    const payload = { ...values };
    const { invoiceStatus, reason } = payload;
    if (invoiceStatusOptions.find((e) => e.status === invoiceStatus)) {
      if (invoiceStatus === InvoiceStatusSummaryStatus.IN_DISPUTE) {
        const params = { reason };
        setAction("dispute_invoice_request");
        await dispatch(disputeInvoiceRequest(job.id, invoice.id, params));
      } else if (invoiceStatus === InvoiceStatusSummaryStatus.APPROVED) {
        setAction("approve_invoice_request");
        await dispatch(approveInvoiceRequest(job.id, invoice.id));
        await dispatch(fetchJobDetailsRequest({ id: job.id }));
      }
    } else {
      setModalData("close");
    }
  };

  const handleDownloadInvoice = () => {
    dispatch(
      fetchDownloadInvoiceRequest(
        invoice?.id,
        `Invoice_${invoice?.invoiceMemo?.fullName}.pdf`
      )
    );
    // if (!invoicePrintArea.current) return;
    // setAction("download");
    // const canvas = await html2canvas(invoicePrintArea.current, {
    //   allowTaint: true,
    //   useCORS: true,
    //   onclone: async (cloned) => {
    //     const downloadBtn = cloned.getElementById("download-btn");
    //     downloadBtn.style.display = "none";
    //     const benjiPoweredBy = cloned.getElementById("benji-powered");
    //     benjiPoweredBy.classList.replace("ant-col-md-16", "ant-col-md-24");
    //     const images = cloned.getElementsByTagName("img");
    //     for (let i = 0; i < images.length; i++) {
    //       images[i].src = await base64Image(images[i].src);
    //     }
    //   },
    // });
    // const imgData = canvas.toDataURL("image/jpeg");
    // let pdf = new jsPDF({
    //   unit: "px",
    //   format: [canvas.width, canvas.height],
    //   hotfixes: ["px_scaling"],
    // });
    // pdf.addImage(imgData, "JPEG", 0, 0);
    // pdf.save("invoice.pdf");
    // setAction("");
  };

  if (showLoader) {
    return <Loader />;
  }

  const { billFrom, billTo, lineItems, receipts, rates } = invoice;

  return (
    <StyledModal
      visible={true}
      width={1440}
      onCancel={handleCancel}
      footer={null}
      closable={false}
    >
      <InvoicePreviewContentWrapper gutter={[0, 9]} justify="start">
        <Col
          className="invoice-content-wrapper"
          md={canEdit ? 18 : 24}
          ref={invoicePrintArea}
        >
          <div className="invoice-content">
            <Row className="invoice-content-header">
              <Col className="invoice-content-left" md={16}>
                <Row className="invoice-content-header-title">
                  <Col>
                    <h2>Invoice</h2>
                  </Col>
                </Row>
                <Row className="job-detail">
                  <Col md={10}>
                    <strong>Band Name:</strong>
                    <span>{invoice?.job?.client}</span>
                  </Col>

                  <Col md={14} className="job-name">
                    <strong>Venue:</strong>
                    <span>{invoice?.job?.title}</span>
                  </Col>
                </Row>
                <Row className="job-detail">
                  <Col md={10}>
                    <strong>Gig #</strong>
                    <span>{invoice?.job?.jobNumber}</span>
                  </Col>
                  <Col md={14} className="job-dates">
                    <strong>Dates:</strong>
                    <span>
                      {`${formatDateString(
                        invoice?.invoiceMemo?.shootDates[0],
                        displayDateFormat
                      )} -
                      ${formatDateString(
                        invoice?.invoiceMemo?.shootDates[
                          invoice?.invoiceMemo?.shootDates.length - 1
                        ],
                        displayDateFormat
                      )}`}
                    </span>
                  </Col>
                </Row>
              </Col>
              <Col
                className="invoice-content-header-sender"
                md={8}
                style={{ textAlign: "right" }}
              >
                <h3>{billFrom?.name}</h3>
                <p>
                  {billFrom?.address
                    ? `${billFrom?.address.trim()}${
                        billFrom?.city.trim() ||
                        billFrom?.state.trim() ||
                        billFrom?.zipCode
                          ? ","
                          : ""
                      }`
                    : ""}
                  {` `}
                  {billFrom?.city
                    ? `${billFrom?.city.trim()}${
                        billFrom?.state.trim() || billFrom?.zipCode ? "," : ""
                      }`
                    : ""}
                  {` `}
                  {billFrom?.state
                    ? `${billFrom?.state.trim()}${billFrom?.zipCode ? "," : ""}`
                    : ""}
                  {` `}
                  {billFrom?.zipCode ? `${billFrom?.zipCode.trim()}` : ""}
                </p>
                <br />
                <p>
                  <PhoneText value={billFrom?.phone} />
                  <br />
                  {billFrom?.email}
                </p>
              </Col>
            </Row>
            <Row className="invoice-content-info">
              <Col className="invoice-content-info-recipient" md={16}>
                <h3>Bill To</h3>
                <h3>{billTo?.name}</h3>
                <p>
                  {billTo?.address
                    ? `${billTo?.address.trim()}${
                        billTo?.city.trim() ||
                        billTo?.state.trim() ||
                        billTo?.zipCode
                          ? ","
                          : ""
                      }`
                    : ""}
                  {` `}
                  {billTo?.city
                    ? `${billTo?.city.trim()}${
                        billTo?.state.trim() || billTo?.zipCode ? "," : ""
                      }`
                    : ""}
                  {` `}
                  {billTo?.state
                    ? `${billTo?.state.trim()}${billTo?.zipCode ? "," : ""}`
                    : ""}
                  {` `}
                  {billTo?.zipCode ? `${billTo?.zipCode.trim()}` : ""}
                </p>
                <p>
                  <PhoneText value={billTo?.phone} />
                  <br />
                  <span>{billTo?.email}</span>
                </p>
              </Col>
              <Col className="invoice-content-info-invoice-data" md={8}>
                <Row>
                  <Col md={10}>
                    <strong>Invoice Number:</strong>
                  </Col>
                  <Col md={14}>
                    <span>{invoice?.invoiceNumber}</span>
                  </Col>
                </Row>
                <Row>
                  <Col md={10}>
                    <strong>Invoice Date:</strong>
                  </Col>
                  <Col md={14}>
                    <span>
                      {formatDateString(
                        invoice?.invoiceDate,
                        displayDateFormat
                      )}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col md={10}>
                    <strong>Payment Due:</strong>
                  </Col>
                  <Col md={14}>
                    <span>
                      {formatDateString(invoice?.paymentDue, displayDateFormat)}
                    </span>
                  </Col>
                </Row>
                <Row className="amount-due">
                  <Col md={10}>
                    <strong>Amount Due:</strong>
                  </Col>
                  <Col md={14}>
                    <CurrencyText value={invoice?.totalInvoiceAmount} />
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <div className="ant-table">
                <table className="dealMemo">
                  <thead className="ant-table-thead">
                    <tr>
                      {invoice?.invoiceMemo?.priceType ===
                        MemoPriceTypes.HOURLY && <th>Day Rate</th>}
                      {invoice?.invoiceMemo?.priceType ===
                        MemoPriceTypes.HOURLY && <th>No. of Days</th>}
                      {invoice?.invoiceMemo?.priceType ===
                        MemoPriceTypes.FIXED && <th>Project Rate</th>}
                      {invoice?.invoiceMemo?.priceType ===
                        MemoPriceTypes.FIXED && <th></th>}
                      <th>Kit Fee</th>
                      <th></th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody className="ant-table-tbody">
                    <tr>
                      {invoice?.invoiceMemo?.priceType ===
                        MemoPriceTypes.HOURLY && (
                        <td>
                          <CurrencyText
                            value={invoice?.invoiceMemo?.workingRate}
                          />
                        </td>
                      )}
                      {invoice?.invoiceMemo?.priceType ===
                        MemoPriceTypes.HOURLY && (
                        <td>{invoice?.invoiceMemo?.workingDays}</td>
                      )}
                      {invoice?.invoiceMemo?.priceType ===
                        MemoPriceTypes.FIXED && (
                        <td><CurrencyText value={invoice?.invoiceMemo?.projectRate} /></td>
                      )}
                      {invoice?.invoiceMemo?.priceType ===
                        MemoPriceTypes.FIXED && <td></td>}
                      <td>
                        <CurrencyText value={invoice?.invoiceMemo?.kitFee} />
                      </td>
                      <td></td>
                      <td>
                        <CurrencyText
                          value={invoice?.invoiceMemo?.invoiceMemoBaseAmount}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Row>
            {rates && rates.length > 0 && (
              <Row>
                <div className="ant-table">
                  <table className="rates">
                    <thead className="ant-table-thead">
                      <tr>
                        <th>Rate Field Title</th>
                        <th>No. of Days</th>
                        <th>Rate</th>
                        <th></th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody className="ant-table-tbody">
                      {rates.map((item) => (
                        <tr
                          key={`service-${item?.id}`}
                          className="bordered-row"
                        >
                          <td>{item?.title}</td>
                          <td>
                            {item?.priceType === MemoPriceTypes.HOURLY
                              ? item?.numberOfDays
                              : "N/A"}
                          </td>
                          <td>
                            <CurrencyText
                              value={
                                item?.priceType === MemoPriceTypes.HOURLY
                                  ? item?.dayRate
                                  : item?.projectRate
                              }
                            />
                          </td>
                          <td></td>
                          <td>
                            <CurrencyText value={item?.totalAmount} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Row>
            )}
            {lineItems && lineItems.length > 0 && (
              <Row>
                <div className="ant-table">
                  <table className="services">
                    <thead className="ant-table-thead">
                      <tr>
                        <th>Services</th>
                        <th>Units</th>
                        <th>No. of Days</th>
                        <th>Rate</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody className="ant-table-tbody">
                      {lineItems.map((item) => (
                        <tr
                          key={`service-${item?.id}`}
                          className="bordered-row"
                        >
                          <td>{item?.title}</td>
                          <td>{item?.units}</td>
                          <td>{item?.numberOfDays}</td>
                          <td>
                            <CurrencyText value={item?.rate} />
                          </td>
                          <td>
                            <CurrencyText value={item?.totalAmount} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Row>
            )}
            {receipts && receipts.length > 0 && (
              <Row>
                <div className="ant-table">
                  <table className="receipt">
                    <thead className="ant-table-thead">
                      <tr>
                        <th>Receipt</th>
                        <th>Date</th>
                        <th>Notes</th>
                        <th></th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody className="ant-table-tbody">
                      {receipts.map((receipt) => (
                        <tr
                          key={`receipt-${receipt?.id}`}
                          className="bordered-row"
                        >
                          <td>
                            <a
                              href={receipt?.document}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={receipt?.title}
                            >
                              {receipt?.title}
                            </a>
                          </td>
                          <td>
                            {formatDateString(
                              receipt?.paymentDue,
                              displayDateFormat
                            )}
                          </td>
                          <td colspan="2">{receipt?.notes}</td>
                          <td>
                            <CurrencyText value={receipt?.amount} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Row>
            )}
            <div className="ant-table">
              <table className="total-amount">
                <tbody className="ant-table-tbody">
                  <tr>
                    <td></td>
                    <td className="total-calculation">
                      <strong>Booking Memo Total:</strong>
                      <strong>Receipt Total:</strong>
                      <strong>Services Total:</strong>
                    </td>
                    <td>
                      <CurrencyText
                        value={invoice?.invoiceMemo?.totalInvoiceMemoAmount}
                      />
                      <CurrencyText
                        value={invoice?.totalInvoiceReceiptsAmount}
                      />
                      <CurrencyText
                        value={invoice?.totalInvoiceLineitemsAmount}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Row className="invoice-content-notes">
              <Col className="invoice-content-notes-text" md={16}>
                 {/* <strong>Notes:</strong> 
                <br />
                <p>
                  All amounts are in dollars. Please make the payment within 15
                  days from the issue of date of this invoice.&nbsp; Tax is not
                  charged on the basis of paragraph 1 of Article 94 of the Value
                  Added Tax Act (I am not liable for VAT).
                </p> */}
              </Col>
              <Col className="invoice-content-notes-amount-due" md={8}>
                <div>
                  <p className="notes-amount">
                    <strong>
                      <CurrencyText value={invoice?.totalInvoiceAmount} />
                    </strong>
                  </p>
                  <p className="notes-amount-due-label">
                    <strong>Amount Due</strong>
                  </p>
                </div>
              </Col>
            </Row>
            <Row className="invoice-preview-footer">
              <Col md={24} id="benji-powered">
                <p style={{ textAlign: "center" }}>
                  <span>Powered by</span>&nbsp;&nbsp;&nbsp;
                  <img src={Logo} height={20} />
                </p>
              </Col>
            </Row>
          </div>
          {receipts && receipts.length > 0 ? (
            <Row className="receipt-attachment-outer">
              <div className="invoice-main-title">Attachments</div>
              <Col md={24}>
                {receipts.map((receipt) => (
                  <div className="receipt-inner">
                    <div className="receipt-left-area">
                      <Icon
                        image={ContractorAttachmentPdfImg}
                        width={16}
                        height={20}
                      />
                      <a
                        href={receipt?.document}
                        title={receipt?.title}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginLeft: 15 }}
                      >
                        {receipt?.title}
                      </a>
                    </div>
                    <a
                      href={receipt?.document}
                      title={receipt?.title}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <DownloadOutlined />
                    </a>
                  </div>
                ))}
              </Col>
            </Row>
          ) : null}
          <Button
            id="download-btn"
            shape="circle"
            className="downloadBtn"
            icon={<DownloadIcon width={18} height={18} stroke="#2f2e50" />}
            loading={action === "download"}
            onClick={handleDownloadInvoice}
          />
        </Col>
        
        {canEdit && (
          <Col className="invoice-status-and-actions" md={6}>
            <div className="invoice-actions-header">
              <div className="title">Change Invoice Status</div>
              <Button
                type="link"
                icon={<MultiplyIcon width={14} height={14} />}
                onClick={handleCancel}
              />
            </div>
            <div className="invoice-actions-content">
              <Formik
                enableReinitialize
                initialValues={formData}
                validationSchema={changeInvoiceStatusValidationSchema}
                onSubmit={handleInvoiceStatus}
              >
                {({ values, setFieldValue, touched, errors }) => (
                  <Form>
                    <Row>
                      <Select
                        name="invoiceStatus"
                        showSearch
                        style={{ width: "100%" }}
                        value={values?.invoiceStatus}
                        onChange={(value) => {
                          setFieldValue("invoiceStatus", value);
                        }}
                      >
                        {invoiceStatusOptions.map(({ status }) => (
                          <Option key={status} value={status}>
                            {status}
                          </Option>
                        ))}
                      </Select>
                    </Row>
                    {values?.invoiceStatus ===
                      InvoiceStatusSummaryStatus.IN_DISPUTE && (
                      <Row className="invoice-status-reason">
                        <Col span={24}>
                          <label className="fieldLabel">Reason</label>
                          <Textarea
                            name="reason"
                            rows={3}
                            value={values?.reason}
                            placeholder="Reason"
                            onChange={(e) =>
                              setFieldValue("reason", e.target.value)
                            }
                          />
                          {touched?.reason && errors?.reason && (
                            <div className="helper-text ">{errors.reason}</div>
                          )}
                        </Col>
                      </Row>
                    )}
                    <Row>
                      <Col md={24}>
                        <Button
                          shape="round"
                          type="primary"
                          htmlType="submit"
                          loading={
                            approveInvoice.loading || disputeInvoice.loading
                          }
                        >
                          <IntlMessages id="page.confirm" />
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </div>
          </Col>
        )}
      </InvoicePreviewContentWrapper>
    </StyledModal>
  );
};

export default InvoicePreview;
