import React, { useMemo } from 'react';
import { useHistory } from 'react-router';
import { ContractorInvoiceViewWrapper } from './Detail.style';
import ContractorInvoicePreview from '../../components/InvoicePreview';
import Button from '@iso/components/uielements/button';
import Box from '@iso/components/utility/box';
import CurrencyText from '@iso/components/utility/currencyText';
import InvoiceProducerStatus from '@iso/enums/invoice_producer_status';
import DownloadIcon from '@iso/components/icons/Download';
import moment from 'moment';

const ContractorInvoiceView = ({ invoice, onEdit }) => {
  const history = useHistory();

  const invoiceTitle = useMemo(() => {
    let title = '';
    switch (invoice.status) {
      case InvoiceProducerStatus.REQUESTED:
        title = 'Create Invoice';
        break;
      case InvoiceProducerStatus.RECEIVED:
        title = 'Invoice Sent';
        break;
      case InvoiceProducerStatus.APPROVED:
        title = 'Invoice Sent';
        break;
      case InvoiceProducerStatus.PAYMENT_SENT:
        title = 'Get Paid';
        break;
      default:
    }

    return title;
  }, [invoice]);

  const onInvoiceEdit = () => {
    onEdit();
  };

  const onInvoiceResend = () => {
    onEdit();
  };

  return (
    <ContractorInvoiceViewWrapper>
      <Box className="invoiceView">
        <div className="invoiceViewHeader">
          <h3 className="title">{invoiceTitle}</h3>
          {invoice.status === InvoiceProducerStatus.REQUESTED && (
            <Button
              shape="round"
              className="editInvoiceBtn"
              onClick={onInvoiceEdit}
            >
              Edit Invoice
            </Button>
          )}
          {invoice.status === InvoiceProducerStatus.RECEIVED ||
            (invoice.status === InvoiceProducerStatus.IN_DISPUTE && (
              <Button
                shape="round"
                className="resendInvoiceBtn"
                onClick={onInvoiceResend}
              >
                Resend Invoice
              </Button>
            ))}
        </div>
        <div className="invoiceViewBody">
          {invoice.status === InvoiceProducerStatus.PAYMENT_SENT && (
            <>
              <div className="paymentSentInfo">
                <div className="totalInvoice">
                  <strong>Total Invoice:</strong>{' '}
                  <CurrencyText
                    value={invoice.totalInvoiceAmount }
                    className="totalInvoicePrice"
                  />
                </div>
                <div className="invoiceStatus">
                  <strong>Status:</strong> Your invoice is paid in full
                </div>
              </div>
              <div className="paymentReceivedDate">
                <strong>Payment Received:</strong>
                <p>
                  {moment(invoice.paymentDue).format('MMM Do, YYYY')} - A
                  Payment for{' '}
                  <strong>
                    <CurrencyText value={invoice.totalPrice} />
                  </strong>{' '}
                  was made using a bank payment.
                </p>
              </div>
            </>
          )}

          {invoice.status !== InvoiceProducerStatus.PAYMENT_SENT && (
            <div className="createAt">
              <strong>Created:</strong> on{' '}
              {moment(invoice.updatedAt).format('MMM Do, YYYY of hh:mm A')}
            </div>
          )}
        </div>
      </Box>

      <Box className="invoicePreview">
        <div className="invoicePreviewHeader">
          <h3 className="title">Preview Mode</h3>
          <Button
            shape="circle"
            icon={<DownloadIcon width={18} height={18} stroke="#2f2e50" />}
          />
        </div>
        <div className="invoicePreviewBody">
          <ContractorInvoicePreview invoice={invoice} />
        </div>
      </Box>
    </ContractorInvoiceViewWrapper>
  );
};

export default ContractorInvoiceView;
