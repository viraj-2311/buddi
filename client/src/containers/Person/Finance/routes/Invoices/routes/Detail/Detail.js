import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import ContractorInvoiceDetailWrapper, { MessageDiv } from './Detail.style';
import InvoiceJobDetail from '../../components/InvoiceJobDetail';
import ContractorInvoiceEdit from './EditInvoice';
import ContractorInvoiceView from './ViewInvoice';
import Button from '@iso/components/uielements/button';
import Input from '@iso/components/uielements/input';
import BackIcon from '@iso/components/icons/Back';
import { LoadingOutlined } from '@ant-design/icons';
import useOnClickOutside from '@iso/lib/hooks/useOnClickOutside';
import notify from '@iso/lib/helpers/notify';
import { showServerError, formatRatesFields } from '@iso/lib/helpers/utility';
import {
  InvoiceStatusSummaryStatus,
  InvoiceStatusSummaryStatusColor,
} from '@iso/enums/invoice_producer_status';

import { CloseOutlined } from '@ant-design/icons';
import {
  setContractorInvoiceNumberRequest,
  sendContractorInvoiceRequest,
  updateContractorInvoiceJobMemoRequest,
  fetchContractorInvoiceDetailRequest,
} from '@iso/redux/contractorInvoice/actions';
import _ from 'lodash';

const ContractorInvoiceDetail = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.Auth);

  const { invoice, setInvoiceNumberAction, send, contractorInvoiceMemoUpdate } =
    useSelector((state) => state.ContractorInvoice);

  // const [viewMode, setViewMode] = useState('View');
  const [viewMode, setViewMode] = useState('View');
  const [editableInvoiceNumber, setEditableInvoiceNumber] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [action, setAction] = useState('');
  const [messageDisplay, setMessageDisplay] = useState(true);
  const ref = useRef();

  useEffect(() => {
    if (
      !setInvoiceNumberAction.loading &&
      !setInvoiceNumberAction.error &&
      action === 'update_invoice_number'
    ) {
      setEditableInvoiceNumber(false);
    }

    if (setInvoiceNumberAction.error && action === 'update_invoice_number') {
      notify('error', showServerError(setInvoiceNumberAction.error));
    }

    if (!setInvoiceNumberAction.loading && action === 'update_invoice_number') {
      setAction('');
    }
  }, [setInvoiceNumberAction]);

  useEffect(() => {
    if (action === 'update_invoice_deal_memo') {
      if (!contractorInvoiceMemoUpdate.loading) {
        if (contractorInvoiceMemoUpdate.success) {
          notify('success', showServerError(contractorInvoiceMemoUpdate.success));
          dispatch(
            fetchContractorInvoiceDetailRequest(authUser.id, invoice.id)
          );
        }
        if (contractorInvoiceMemoUpdate.error) {
          notify('error', showServerError(contractorInvoiceMemoUpdate.error));
        }
        setAction('');
      }
    }
  }, [contractorInvoiceMemoUpdate]);

  useEffect(() => {
    if (!send.loading && !send.error && action === 'send_invoice') {
      // setViewMode('View');/
      notify('success', 'Invoice sent successfully.');
    }

    if (send.error && action === 'send_invoice') {
      notify('error', showServerError(send.error));
    }

    if (!send.loading && action === 'send_invoice') {
      setAction('');
    }
  }, [send]);

  useEffect(() => {
    setInvoiceNumber(invoice.invoiceNumber);
    if (invoice.status === 'Processing' || invoice.status === 'Paid') {
      setViewMode('View');
    } else {
      setViewMode('Edit');
    }
  }, [invoice]);

  useOnClickOutside(ref, () => {
    setEditableInvoiceNumber(false);
  });

  const goBack = () => {
    history.push('../../invoices');
  };

  const onInvoiceEdit = () => {
    setViewMode('Edit');
  };

  const onInvoiceSend = () => {
    setAction('send_invoice');
    dispatch(sendContractorInvoiceRequest(authUser.id, invoice.id));
  };

  const handleInvoiceDealMemoUpdate = (payload) => {
    setAction('update_invoice_deal_memo');
    formatRatesFields(payload.rates);
    dispatch(
      updateContractorInvoiceJobMemoRequest(invoice.invoiceMemo.id, payload)
    );
  };

  const onInvoiceNumberEdit = () => {
    setEditableInvoiceNumber(true);
  };

  const onInvoiceNumberDone = () => {
    setAction('update_invoice_number');
    dispatch(
      setContractorInvoiceNumberRequest(authUser.id, invoice.id, {
        invoiceNumber: invoiceNumber,
      })
    );
  };

  const onClose = () => {
    setMessageDisplay(false);
  };

  return (
    <ContractorInvoiceDetailWrapper>
      <div className='PageHeader'>
        <div className='invoiceNumberWrapper'>
          {editableInvoiceNumber ? (
            <div className='invoiceNumberEditor' ref={ref}>
              <Input
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                onPressEnter={onInvoiceNumberDone}
                suffix={
                  action === 'update_invoice_number' &&
                  setInvoiceNumberAction.loading ? (
                    <LoadingOutlined />
                  ) : null
                }
              />
            </div>
          ) : (
            <div className='invoiceNumber'>Invoice No: {invoiceNumber}</div>
          )}
          <Button type='link' className='btnLink' onClick={onInvoiceNumberEdit}>
            Edit
          </Button>
        </div>
        <div className='jobInfoWrapper'>
          <Button type='link' className='goBackBtn' onClick={goBack}>
            <BackIcon />
          </Button>
          <InvoiceJobDetail invoice={invoice} />
        </div>
      </div>
      {/* <div className="divider" /> */}
      {/* <div className="PageSubHeader">
        <div className="inlineTextBlock">
          <label>Job #</label>
          <span>{invoice.job.jobNumber}</span>
        </div>
        <div className="">
          <label>Date(s):</label>
          <span>{invoice.job.shootDatesString}</span>
        </div>
      </div> */}
      {/* <div className="divider" /> */}
      <div className='PageContent'>
        {messageDisplay &&
          invoice.status === InvoiceStatusSummaryStatus.IN_DISPUTE && (
            <MessageDiv
              color={
                InvoiceStatusSummaryStatusColor[
                  InvoiceStatusSummaryStatus.IN_DISPUTE
                ].light
              }
            >
              <div>
                <span className='messageBorder' />
                <h4>{invoice.status} Message:</h4>
                <p>{invoice.notes}</p>
              </div>
              <a onClick={onClose}>
                <CloseOutlined />
              </a>
            </MessageDiv>
          )}

        <div className='pageTitle'>
          <h2>Invoice Details</h2>
        </div>

        {viewMode === 'View' ? (
          <ContractorInvoiceView invoice={invoice} onEdit={onInvoiceEdit} />
        ) : (
          <ContractorInvoiceEdit
            invoice={invoice}
            onSend={onInvoiceSend}
            onInvoiceDealMemoUpdate={handleInvoiceDealMemoUpdate}
          />
        )}
      </div>
    </ContractorInvoiceDetailWrapper>
  );
};

export default ContractorInvoiceDetail;
