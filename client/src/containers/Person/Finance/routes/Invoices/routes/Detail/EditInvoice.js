import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ContractorInvoiceEditWrapper, ActionDiv } from './Detail.style';
import InvoiceForm from './InvoiceForm/InvoiceForm';
import InvoiceDocumentForm from './Document/Form';
import InvoiceDocumentList from './Document/List';
import InvoiceReceiptList from './Receipt/List';
import InvoiceReceiptForm from './Receipt/Form';
import ContractorInvoicePreview from '../../components/InvoicePreview';
import RadioSwitch from '../../components/Switch';
import CurrencyText from '@iso/components/utility/currencyText';
import { scroller } from 'react-scroll';
import { RadioButton } from '@iso/components/uielements/radio';
import Button from '@iso/components/uielements/button';
import { DownloadOutlined } from '@ant-design/icons';
import EditIcon from '@iso/components/icons/Edit';
import Box from '@iso/components/utility/box';
import InvoiceServiceForm from './ServiceForm/ServiceForm';

const ContractorInvoiceEdit = ({
  invoice,
  onSend,
  onInvoiceDealMemoUpdate,
}) => {
  const [invoiceEditMode, setInvoiceEditMode] = useState('Edit');
  const { send } = useSelector((state) => state.ContractorInvoice);
  const childRef = useRef();

  const onInvoicePreview = () => {
    scroller.scrollTo('invoicePreview', {
      smooth: true,
      containerId: 'isoContentMainLayout',
    });
  };

  const onPreviewEdit = () => {
    scroller.scrollTo('invoiceForm', {
      smooth: true,
      containerId: 'isoContentMainLayout',
    });
  };

  const handleInvoiceSend = () => {
    onSend();
  };

  const { receipts } = invoice;

  return (
    <ContractorInvoiceEditWrapper>
      <Box className='invoiceForm' id='invoiceForm'>
        <div className='invoiceFormHeader'>
          <div className='leftSideAction'>
            <RadioSwitch value={invoiceEditMode}>
              <RadioButton
                value='Edit'
                onClick={() => setInvoiceEditMode('Edit')}
              >
                Edit Invoice
              </RadioButton>
              <RadioButton
                value='Upload'
                onClick={() => setInvoiceEditMode('Upload')}
              >
                Upload Invoice
              </RadioButton>
            </RadioSwitch>
          </div>
          <div className='rightSideAction'>
            {/* <Button shape="round" onClick={onInvoicePreview}>
              Preview
            </Button> */}
            <div className='totalPrice'>
              <label>Booking Memo Total:</label>
              <CurrencyText
                value={invoice.invoiceMemo.totalInvoiceMemoAmount}
              />
            </div>
          </div>
        </div>
        <div className='invoiceFormBody'>
          {invoiceEditMode === 'Edit' ? (
            <InvoiceForm
              invoice={invoice}
              onInvoiceDealMemoUpdate={onInvoiceDealMemoUpdate}
            />
          ) : (
            <InvoiceDocumentForm invoice={invoice} />
          )}

          {invoiceEditMode === 'Upload' && (
            <div className='documentListWrapper'>
              <InvoiceDocumentList
                invoice={invoice}
                documents={invoice.documents}
              />
            </div>
          )}
          <div className='serviceSection'>
            <div className='serviceWrapper'>
              <h3 className='title'>Additional Services</h3>
              <div className='totalPrice'>
                <label>Services Total:</label>
                <CurrencyText value={invoice.totalInvoiceLineitemsAmount} />
              </div>
            </div>
            <div className='serviceForm'>
              <InvoiceServiceForm invoice={invoice} />
            </div>
          </div>
        </div>
      </Box>
      <Box className='receiptForm'>
        <div className='receiptFormHeader'>
          <h3 className='title'>Receipts</h3>
          <div className='totalPrice'>
            <label>Receipts Total:</label>
            <CurrencyText value={invoice.totalInvoiceReceiptsAmount} />
          </div>
        </div>
        <div className='receiptFormBody'>
          <div className='uploadFormWrapper'>
            <InvoiceReceiptForm invoice={invoice} />
          </div>

          <div className='receiptListWrapper'>
            <InvoiceReceiptList invoice={invoice} receipts={receipts} />
          </div>
        </div>
      </Box>

      <div className='editButtonWrapper'>
        <div className='totalInvoice'>
          <label>Total Invoice:</label>
          <CurrencyText value={invoice.totalInvoiceAmount} />
        </div>
        <Button shape='round' className='blackBorder'>
          Save as Draft
        </Button>
        <Button
          shape='round'
          type='primary'
          onClick={handleInvoiceSend}
          loading={send.loading}
        >
          Send Invoice
        </Button>
      </div>

      {invoiceEditMode === 'Edit' && (
        <Box className='invoicePreview' id='invoicePreview'>
          <div className='invoicePreviewHeader'>
            <h3 className='title'>Preview Mode</h3>
            <ActionDiv>
              <Button
                shape='circle'
                icon={<EditIcon />}
                onClick={onPreviewEdit}
              />
              <Button shape='circle' id="download-btn" icon={<DownloadOutlined />} onClick={() => childRef.current.onDownload()} />
            </ActionDiv>
          </div>
          <div className='invoicePreviewBody'>
          <ContractorInvoicePreview invoice={invoice} ref={childRef} />
          </div>
        </Box>
      )}
    </ContractorInvoiceEditWrapper>
  );
};

export default ContractorInvoiceEdit;
