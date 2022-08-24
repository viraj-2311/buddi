import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import InvoiceDocumentListWrapper from './List.style';
import {Col, Dropdown, Menu, Row} from 'antd';
import Button, { ButtonGroup } from '@iso/components/uielements/button';
import PdfIcon from '@iso/assets/images/pdf.png';
import CurrencyText from '@iso/components/utility/currencyText';
import Modal from '@iso/components/Modal';
import ConfirmModal from '@iso/components/Modals/Confirm'
import Box from '@iso/components/utility/box';
import InvoiceDocumentForm from '../Form';
import InvoiceDocumentViewer from './DocumentViewer';
import { isImage, isPdf } from '@iso/lib/helpers/file_utils';
import { deleteContractorInvoiceDocumentRequest } from '@iso/redux/contractorInvoice/actions';
import {EllipsisOutlined} from '@ant-design/icons';

const InvoiceDocumentList = ({invoice, documents}) => {
  const dispatch = useDispatch();
  const { documentUpdateAction, documentDeleteAction } = useSelector(state => state.ContractorInvoice);
  const [documentEdit, setDocumentEdit] = useState({visible: false, document: null});
  const [documentDelete, setDocumentDelete] = useState({visible: false, document: null});
  const [documentOpen, setDocumentOpen] = useState({visible: false, document: null});
  const [action, setAction] = useState('');

  useEffect(() => {
    if (!documentDeleteAction.loading && !documentDeleteAction.error && action === 'delete') {
      setDocumentDelete({visible: false, document: null});
    }
  }, [documentDeleteAction]);

  useEffect(() => {
    if (!documentUpdateAction.loading && !documentUpdateAction.error && documentEdit.visible) {
      setDocumentEdit({visible: false, document: null});
    }
  }, [documentUpdateAction]);

  const onDocumentEdit = (document) => {
    setDocumentEdit({visible: true, document: document});
  };

  const onDocumentDelete = (document) => {
    setDocumentDelete({visible: true, document: document});
  };

  const onEditClose = () => {
    setDocumentEdit({visible: false, document: null});
  };

  const onDocumentDeleteYes = () => {
    setAction('delete');
    dispatch(deleteContractorInvoiceDocumentRequest(documentDelete.document.id));
  };

  const onDocumentDeleteCancel = () => {
    setDocumentDelete({visible: false, document: null});
  };

  const onDocumentOpen = (document) => {
    setDocumentOpen({visible: true, document: document});
  };

  const onDocumentOpenClose = () => {
    setDocumentOpen({visible: false, document: null});
  };

  const documentThumb = (document) => {
    if (!document.document) return null;
    if (isImage(document.document)) {
      return document.document;
    } else {
      return PdfIcon;
    }
  };

  const MoreActions = ({document}) => (
    <Menu>
      <Menu.Item onClick={() => onDocumentEdit(document)}>
        Edit
      </Menu.Item>
      <Menu.Item onClick={() => onDocumentDelete(document)}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <InvoiceDocumentListWrapper>
      <Modal
        visible={documentEdit.visible}
        title="Edit Document"
        footer={null}
        width={900}
        onCancel={onEditClose}
      >
        <InvoiceDocumentForm invoice={invoice} document={documentEdit.document} />
      </Modal>

      <ConfirmModal
        visible={documentDelete.visible}
        description="Do you really want to delete this Document? This action cannot be undone."
        onYes={onDocumentDeleteYes}
        onNo={onDocumentDeleteCancel}
      />
      <Modal
        visible={documentOpen.visible}
        title="Document"
        onCancel={onDocumentOpenClose}
        width={900}
        footer={null}
      >
        {documentOpen.document && documentOpen.document.document &&
          <InvoiceDocumentViewer document={documentOpen.document.document} />
        }
      </Modal>

      <Row gutter={[10, 10]} wrap={false}>
        {documents.map(document => (
          <Col span={12} key={`document-${document.id}`}>
            <Box key="document-1" className="documentItem">
              <div className="documentThumb">
                <img src={documentThumb(document)} alt="Document thumb" onClick={()=> onDocumentOpen(document)} />
              </div>
              <div className="documentText">
                <p className="documentAmount"><CurrencyText value={document.amount} /></p>
                <p className="documentDueTo">{document.title}</p>
                <p className="documentNotes">{document.notes}</p>
              </div>
              <div className="documentAction">
                <Dropdown overlay={<MoreActions receipt={document} />} overlayClassName="documentMenu" placement="bottomRight" trigger="click">
                  <Button type="link"><EllipsisOutlined style={{color: '#2f2e50', fontSize: 25}} /></Button>
                </Dropdown>
              </div>
            </Box>
          </Col>
        ))}
      </Row>
    </InvoiceDocumentListWrapper>
  );
};

export default InvoiceDocumentList;
