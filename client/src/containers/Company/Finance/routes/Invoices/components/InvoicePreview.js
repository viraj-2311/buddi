import React, { useMemo, useState, createRef } from 'react';
import { Row, Col } from 'antd';
import ContractorInvoicePreviewWrapper from './InvoicePreview.style';
import Logo from '@iso/assets/images/logo-black.webp';
import CurrencyText from '@iso/components/utility/currencyText';
import PhoneText from '@iso/components/utility/phoneText';
import MemoPriceTypes from '@iso/enums/memo_price_types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { formatDateString, base64Image } from '@iso/lib/helpers/utility';
import { displayDateFormat } from '@iso/config/datetime.config';
import ContractorAttachmentPdfImg from "@iso/assets/images/pdf.svg";
import Icon from "@iso/components/icons/Icon";

import Button from "@iso/components/uielements/button";
import { DownloadOutlined, FilePdfFilled } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { fetchDownloadInvoiceRequest } from "../../../../../../redux/companyDocument/actions";

const ContractorInvoicePreview = React.forwardRef(({ invoice }, ref) => {
  const { billFrom, billTo, invoiceMemo, lineItems, receipts, rates } = invoice;
  const invoicePrintArea = createRef();
  const [action, setAction] = useState('');
  const dispatch = useDispatch();

  const handleDownloadInvoice = async () => {
    dispatch(
      fetchDownloadInvoiceRequest(
        invoice?.id,
        `Invoice_${invoice?.invoiceMemo?.fullName}.pdf`
      )
    );
    // if (!invoicePrintArea.current) return;
    // setAction('download');
    // const canvas = await html2canvas(invoicePrintArea.current, {
    //   allowTaint: true,
    //   useCORS: true,
    //   onclone: async (cloned) => {
    //     const downloadBtn = cloned.getElementById('download-btn');
    //     downloadBtn.style.display = 'none';
    //     const benjiPoweredBy = cloned.getElementById('benji-powered');
    //     benjiPoweredBy.classList.replace('ant-col-md-16', 'ant-col-md-24');
    //     const images = cloned.getElementsByTagName('img');
    //     for (let i = 0; i < images.length; i++) {
    //       images[i].src = await base64Image(images[i].src);
    //     }
    //   },
    // });
    // const imgData = canvas.toDataURL('image/jpeg');
    // let pdf = new jsPDF({
    //   unit: 'px',
    //   format: [canvas.width, canvas.height],
    //   hotfixes: ['px_scaling'],
    // });
    // pdf.addImage(imgData, 'JPEG', 0, 0);
    // pdf.save('invoice.pdf');
    // setAction('');
  };
  React.useImperativeHandle(ref, () => ({
    onDownload() {
      handleDownloadInvoice();
    },
  }));
  return (
    <ContractorInvoicePreviewWrapper gutter={[0, 9]} justify='start'>
      <div className='invoice-container'>
        <Col className='invoice-content-wrapper' md={24} ref={invoicePrintArea}>
          <div className='invoice-content'>
            <Row className='invoice-content-header'>
              <Col md={16} className='invoice-content-left'>
                <Row className='invoice-content-header-title'>
                  <Col>
                    <h2>Invoice</h2>
                  </Col>
                </Row>
                <Row className='job-detail'>
                  <Col md={10}>
                    <strong>Band Name:</strong>
                    <span>{invoice.job.client}</span>
                  </Col>

                  <Col md={14} className='job-name'>
                    <strong>Venue:</strong>
                    <span>{invoice.job.title}</span>
                  </Col>
                </Row>
                <Row className='job-detail'>
                  <Col md={10}>
                    <strong>Gig #</strong>
                    <span>{invoice.job.jobNumber}</span>
                  </Col>
                  <Col md={14} className='job-dates'>
                    <strong>Dates:</strong>
                    <span>
                      {`${formatDateString(
                        invoice.invoiceMemo.shootDates[0],
                        displayDateFormat
                      )} -
                      ${formatDateString(
                        invoice.invoiceMemo.shootDates[
                          invoice.invoiceMemo.shootDates.length - 1
                        ],
                        displayDateFormat
                      )}`}
                    </span>
                  </Col>
                </Row>
              </Col>
              <Col
                className='invoice-content-header-sender'
                md={8}
                style={{ textAlign: 'right' }}
              >
                <h3>{billFrom.name}</h3>
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
                  <PhoneText value={billFrom.phone} />
                  <br />
                  {billFrom.email}
                </p>
              </Col>
            </Row>
            <Row className='invoice-content-info'>
              <Col className='invoice-content-info-recipient' md={16}>
                <h3>Bill To</h3>
                <h3>{billTo.name}</h3>
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
                  <PhoneText value={billTo.phone} />
                  <br />
                  <span>{billTo.email}</span>
                </p>
              </Col>
              <Col className='invoice-content-info-invoice-data' md={8}>
                <Row>
                  <Col md={10}>
                    <strong>Invoice Number:</strong>
                  </Col>
                  <Col md={14}>
                    <span>{invoice.invoiceNumber}</span>
                  </Col>
                </Row>
                <Row>
                  <Col md={10}>
                    <strong>Invoice Date:</strong>
                  </Col>
                  <Col md={14}>
                    <span>
                      {formatDateString(invoice.invoiceDate, displayDateFormat)}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col md={10}>
                    <strong>Payment Due:</strong>
                  </Col>
                  <Col md={14}>
                    <span>
                      {formatDateString(invoice.paymentDue, displayDateFormat)}
                    </span>
                  </Col>
                </Row>
                <Row className='amount-due'>
                  <Col md={10}>
                    <strong>Amount Due:</strong>
                  </Col>
                  <Col md={14}>
                    <CurrencyText value={invoice.totalInvoiceAmount} />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <div className='ant-table'>
                <table className='dealMemo'>
                  <thead className='ant-table-thead'>
                    <tr>
                      {invoice.invoiceMemo.priceType ===
                        MemoPriceTypes.HOURLY && <th>Day Rate</th>}
                      {invoice.invoiceMemo.priceType ===
                        MemoPriceTypes.HOURLY && <th>No. of Days</th>}
                      {invoice.invoiceMemo.priceType ===
                        MemoPriceTypes.FIXED && <th>Project Rate</th>}
                      {invoice.invoiceMemo.priceType ===
                        MemoPriceTypes.FIXED && <th></th>}
                      <th>Kit Fee</th>
                      <th></th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody className='ant-table-tbody'>
                    <tr>
                      {invoice.invoiceMemo.priceType ===
                        MemoPriceTypes.HOURLY && (
                        <td>
                          <CurrencyText
                            value={invoice.invoiceMemo.workingRate}
                          />
                        </td>
                      )}
                      {invoice.invoiceMemo.priceType ===
                        MemoPriceTypes.HOURLY && (
                        <td>{invoice.invoiceMemo.workingDays}</td>
                      )}
                      {invoice.invoiceMemo.priceType ===
                        MemoPriceTypes.FIXED && (
                        <td>{invoice.invoiceMemo.projectRate}</td>
                      )}
                      {invoice.invoiceMemo.priceType ===
                        MemoPriceTypes.FIXED && <td></td>}
                      <td>
                        <CurrencyText value={invoice.invoiceMemo.kitFee} />
                      </td>
                      <td></td>
                      <td>
                        <CurrencyText
                          value={invoice.invoiceMemo.invoiceMemoBaseAmount}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Row>
            {rates && rates.length > 0 && (
              <Row>
                <div className='ant-table'>
                  <table className='rates'>
                    <thead className='ant-table-thead'>
                      <tr>
                        <th>Rate Field Title</th>
                        <th>No. of Days</th>
                        <th>Rate</th>
                        <th></th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody className='ant-table-tbody'>
                      {rates.map((item) => (
                        <tr key={`service-${item.id}`} className='bordered-row'>
                          <td>{item.title}</td>
                          <td>
                            {item.priceType === MemoPriceTypes.HOURLY
                              ? item.numberOfDays
                              : 'N/A'}
                          </td>
                          <td>
                            <CurrencyText
                              value={
                                item.priceType === MemoPriceTypes.HOURLY
                                  ? item.dayRate
                                  : item.projectRate
                              }
                            />
                          </td>
                          <td></td>
                          <td>
                            <CurrencyText value={item.totalAmount} />
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
                <div className='ant-table'>
                  <table className='services'>
                    <thead className='ant-table-thead'>
                      <tr>
                        <th>Services</th>
                        <th>Units</th>
                        <th>No. of Days</th>
                        <th>Rate</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody className='ant-table-tbody'>
                      {lineItems.map((item) => (
                        <tr key={`service-${item.id}`} className='bordered-row'>
                          <td>{item.title}</td>
                          <td>{item.units}</td>
                          <td>{item.numberOfDays}</td>
                          <td>
                            <CurrencyText value={item.rate} />
                          </td>
                          <td>
                            <CurrencyText value={item.totalAmount} />
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
                <div className='ant-table'>
                  <table className='receipt'>
                    <thead className='ant-table-thead'>
                      <tr>
                        <th>Receipt</th>
                        <th>Date</th>
                        <th>Notes</th>
                        <th></th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody className='ant-table-tbody'>
                      {receipts.map((receipt) => (
                        <tr
                          key={`receipt-${receipt.id}`}
                          className='bordered-row'
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
                              receipt.paymentDue,
                              displayDateFormat
                            )}
                          </td>
                          <td colspan='2'>{receipt.notes}</td>
                          <td>
                            <CurrencyText value={receipt.amount} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Row>
            )}
            <div className='ant-table'>
              <table className='total-amount'>
                <tbody className='ant-table-tbody'>
                  <tr>
                    <td></td>
                    <td className='total-calculation'>
                      <strong>Booking Memo Total:</strong>
                      <strong>Receipt Total:</strong>
                      <strong>Services Total:</strong>
                    </td>
                    <td>
                      <CurrencyText
                        value={invoice.invoiceMemo.totalInvoiceMemoAmount}
                      />
                      <CurrencyText
                        value={invoice.totalInvoiceReceiptsAmount}
                      />
                      <CurrencyText
                        value={invoice.totalInvoiceLineitemsAmount}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Row className='invoice-content-notes'>
              <Col className='invoice-content-notes-text' md={16}>
                {/* <strong>Notes:</strong>
                <br />
                <p>
                  All amounts are in dollars. Please make the payment within 15
                  days from the issue of date of this invoice.&nbsp; Tax is not
                  charged on the basis of paragraph 1 of Article 94 of the Value
                  Added Tax Act (I am not liable for VAT).
                </p> */}
              </Col>
              <Col className='invoice-content-notes-amount-due' md={8}>
                <div>
                  <p className='notes-amount'>
                    <strong>
                      <CurrencyText value={invoice.totalInvoiceAmount} />
                    </strong>
                  </p>
                  <p className='notes-amount-due-label'>
                    <strong>Amount Due</strong>
                  </p>
                </div>
              </Col>
            </Row>
            <Row className='invoice-preview-footer'>
              <Col md={24} id='benji-powered'>
                <p style={{ textAlign: 'center' }}>
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
        </Col>
      </div>
    </ContractorInvoicePreviewWrapper>
  );
});

export default ContractorInvoicePreview;
