import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InvoiceReceiptListWrapper from './List.style';
import ReceiptViewer from './ReceiptViewer';
import { Col, Dropdown, Menu, Row } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import Button, { ButtonGroup } from '@iso/components/uielements/button';
import notify from '@iso/lib/helpers/notify';
import { showServerError } from '@iso/lib/helpers/utility';
import PdfIcon from '@iso/assets/images/pdf.png';
import CurrencyText from '@iso/components/utility/currencyText';
import Modal from '@iso/components/Modal';
import ConfirmModal from '@iso/components/Modals/Confirm';
import { formatDateString } from '@iso/lib/helpers/utility';
import { displayDateFormat } from '@iso/config/datetime.config';
import Box from '@iso/components/utility/box';
import InvoiceReceiptForm from '../Form';
import { isImage, isPdf } from '@iso/lib/helpers/file_utils';
import {
  deleteContractorInvoiceReceiptRequest,
  fetchContractorInvoiceDetailRequest,
} from '@iso/redux/contractorInvoice/actions';
const InvoiceReceiptList = ({ invoice, receipts }) => {
  const dispatch = useDispatch();
  const { receiptUpdateAction, receiptDeleteAction } = useSelector(
    (state) => state.ContractorInvoice
  );
  const { user: authUser } = useSelector((state) => state.Auth);

  const [receiptEdit, setReceiptEdit] = useState({
    visible: false,
    receipt: null,
  });
  const [receiptDelete, setReceiptDelete] = useState({
    visible: false,
    receipt: null,
  });
  const [receiptOpen, setReceiptOpen] = useState({
    visible: false,
    receipt: null,
  });
  const [action, setAction] = useState('');

  useEffect(() => {
    if (action === 'delete') {
      if (!receiptDeleteAction.loading) {
        if (receiptDeleteAction.success) {
          notify('success', showServerError(receiptDeleteAction.success));
          dispatch(
            fetchContractorInvoiceDetailRequest(authUser.id, invoice.id)
          );
        }
        if (receiptDeleteAction.error) {
          notify('error', showServerError(receiptDeleteAction.error));
        }
        if (!receiptDeleteAction.error) {
          setReceiptDelete({ visible: false, receipt: null });
        }
        setAction('');
      }
    }
  }, [receiptDeleteAction]);

  useEffect(() => {
    if (
      !receiptUpdateAction.loading &&
      !receiptUpdateAction.error &&
      receiptEdit.visible
    ) {
      setReceiptEdit({ visible: false, receipt: null });
    }
  }, [receiptUpdateAction]);

  const onReceiptEdit = (receipt) => {
    setReceiptEdit({ visible: true, receipt: receipt });
  };

  const onReceiptDelete = (receipt) => {
    setReceiptDelete({ visible: true, receipt: receipt });
  };

  const onEditClose = () => {
    setReceiptEdit({ visible: false, receipt: null });
  };

  const onReceiptDeleteYes = () => {
    setAction('delete');
    dispatch(deleteContractorInvoiceReceiptRequest(receiptDelete.receipt.id));
  };

  const onReceiptDeleteCancel = () => {
    setReceiptDelete({ visible: false, receipt: null });
  };

  const onReceiptOpen = (receipt) => {
    setReceiptOpen({ visible: true, receipt: receipt });
  };

  const onReceiptOpenClose = () => {
    setReceiptOpen({ visible: false, receipt: null });
  };

  const receiptThumb = (receipt) => {
    if (!receipt.document) return PdfIcon;
    if (isImage(receipt.document)) {
      return receipt.document;
    } else {
      return PdfIcon;
    }
  };

  const MoreActions = ({ receipt }) => (
    <Menu>
      <Menu.Item onClick={() => onReceiptEdit(receipt)}>Edit</Menu.Item>
      <Menu.Item onClick={() => onReceiptDelete(receipt)}>Delete</Menu.Item>
    </Menu>
  );

  return (
    <InvoiceReceiptListWrapper>
      <Modal
        visible={receiptEdit.visible}
        title="Edit Receipt"
        footer={null}
        width={980}
        onCancel={onEditClose}
      >
        <InvoiceReceiptForm invoice={invoice} receipt={receiptEdit.receipt} />
      </Modal>

      <ConfirmModal
        visible={receiptDelete.visible}
        description="Do you really want to delete this Receipt? This action cannot be undone."
        onYes={onReceiptDeleteYes}
        onNo={onReceiptDeleteCancel}
      />
      <Modal
        visible={receiptOpen.visible}
        title="Receipt"
        onCancel={onReceiptOpenClose}
        width={900}
        footer={null}
      >
        {receiptOpen.receipt && receiptOpen.receipt.document && (
          <ReceiptViewer document={receiptOpen.receipt.document} />
        )}
      </Modal>

      <Row gutter={[30, 10]}>
        {receipts.map((receipt) => (
          <Col span={12} key={`receipt-${receipt.id}`}>
            <Box key="receipt-1" className="receiptItem">
              <div className="receiptThumb">
                <img
                  src={receiptThumb(receipt)}
                  alt="Receipt thumb"
                  onClick={() => onReceiptOpen(receipt)}
                />
              </div>
              <div className="receiptText">
                <h3 className="receiptAmount">
                  <CurrencyText value={receipt.amount} />
                </h3>

                <h4 className="receiptTitle">{receipt.title}</h4>
                <p className="receiptDueTo">
                  {receipt.title} |{' '}
                  {formatDateString(receipt.paymentDue, displayDateFormat)}
                </p>
                <p className="receiptNotes">{receipt.notes}</p>
              </div>
              <div className="receiptAction">
                <Dropdown
                  overlay={<MoreActions receipt={receipt} />}
                  overlayClassName="receiptMenu"
                  placement="bottomRight"
                  trigger="click"
                >
                  <Button type="link">
                    <EllipsisOutlined />
                  </Button>
                </Dropdown>
              </div>
            </Box>
          </Col>
        ))}
      </Row>
    </InvoiceReceiptListWrapper>
  );
};

export default InvoiceReceiptList;
