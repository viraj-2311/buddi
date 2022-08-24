import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import filesize from 'filesize.js';
import Button from '@iso/components/uielements/button';
import notify from '@iso/lib/helpers/notify';
import { showServerError, getW9AttachmentName } from '@iso/lib/helpers/utility';
import ConfirmModal from '@iso/components/Modals/Confirm';
import { Card } from 'antd';
import Dropzone from '@iso/components/uielements/dropzone';
import Icon from '@iso/components/icons/Icon';
import DownloadCloudIcon from '@iso/components/icons/DownloadCloud';
import { uploadFile } from '@iso/lib/helpers/s3';
import { DocumentWrapper } from './Documents.style';
import PdfImg from '@iso/assets/images/pdf.svg';
import { CloseCircleFilled } from '@ant-design/icons';
import {
  updateContractorW9DocumentRequest,
  removeContractorW9DocumentRequest,
} from '@iso/redux/user/actions';

const Documents = () => {
  const [action, setAction] = useState('');
  const [visibleRemoveW9Confirm, setVisibleRemoveW9Confirm] = useState(false);
  const [documentError, setDocumentError] = useState('');
  const filePicker = useRef(null);
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.Auth);
  const { updateW9Document, removeW9Document } = useSelector(
    (state) => state.User
  );
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    setUploadedFile(authUser.w9Document);
  }, [authUser]);

  useEffect(() => {
    if (
      !updateW9Document.loading &&
      !updateW9Document.error &&
      action === 'update_w9_document'
    ) {
      notify('success', updateW9Document.success);
    }

    if (updateW9Document.error && action === 'update_w9_document') {
      notify('error', showServerError(updateW9Document.error));
    }

    if (!updateW9Document.loading && action === 'update_w9_document') {
      setAction('');
    }
  }, [updateW9Document]);

  useEffect(() => {
    if (
      !removeW9Document.loading &&
      !removeW9Document.error &&
      action === 'delete_w9_document'
    ) {
      setVisibleRemoveW9Confirm(false);
      notify('success', removeW9Document.success);
    }

    if (removeW9Document.error && action === 'delete_w9_document') {
      notify('error', showServerError(removeW9Document.error));
    }

    if (!removeW9Document.loading && action === 'delete_w9_document') {
      setAction('');
    }
  }, [removeW9Document]);

  const handleAttachmentLoad = async (files) => {
    const file = files[0];
    const W9documentDirName =
      process.env.REACT_APP_S3_BUCKET_CONTRACTOR_W9_DOCUMENT;
    setAction('update_w9_document');
    const document = await uploadFile(file, W9documentDirName);
    if (document.location) {
      const attachment = {
        name: getW9AttachmentName(authUser, file),
        size: file.size,
        type: file.type,
        path: document.location,
      };
      const payload = { ...attachment, purpose: 'w9' };
      dispatch(updateContractorW9DocumentRequest(authUser.id, payload));
    }
  };
  const handleRemoveW9Cancel = () => {
    setVisibleRemoveW9Confirm(false);
  };

  const handleRemoveW9Confirm = () => {
    setAction('delete_w9_document');
    dispatch(removeContractorW9DocumentRequest(authUser.id, uploadedFile.id));
  };

  const openFilePicker = () => {
    if (filePicker && filePicker.current) {
      filePicker.current.value = null;
      filePicker.current.click();
    }
  };

  return (
    <DocumentWrapper>
      <Card className='document-card'>
        <h2 className='sectionHead'>W9 Document</h2>
        <p className='note'>
          Before you submit an invoice, all employers require a signed W-9 to be
          on file. This information is secure and will not be shared with anyone
          except for businesses signed up for this service. All businesses on
          this platform agree to keep your information private.
        </p>
        <>
          <Dropzone
            disabled={action === 'update_w9_document'}
            multiple={false}
            onDrop={(files) => handleAttachmentLoad(files)}
            accept={'image/jpeg, image/png, application/pdf'}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps({ className: 'dropzone' })}>
                <input ref={filePicker} {...getInputProps()} />
                <p>
                  <DownloadCloudIcon width={55} height={44} />
                </p>
                <span className='drag_and_drop'>
                  Drag and Drop you files here
                </span>
                <p>OR</p>
                <Button
                  shape='round'
                  type='primary'
                  onClick={openFilePicker}
                  className='browseBtn'
                  loading={
                    action === 'update_w9_document' || updateW9Document.loading
                  }
                >
                  Browse
                </Button>
              </div>
            )}
          </Dropzone>
          {documentError && <div className='errorText'>{documentError}</div>}

          {uploadedFile && (
            <>
              <h3>Uploaded file</h3>
              <div className='attachmentBox'>
                <div className='attachmentDetails'>
                  <Icon image={PdfImg} width={20} height={26} />
                  <div className='rightDetail'>
                    <a
                      href={uploadedFile.path}
                      target='_blank'
                      className='attachmentTitle'
                      title={uploadedFile.name}
                    >
                      {uploadedFile.name}
                    </a>
                    <span>{filesize(uploadedFile.size)}</span>
                  </div>
                </div>
                <Button
                  type='link'
                  onClick={() => {
                    setVisibleRemoveW9Confirm(true);
                  }}
                >
                  <CloseCircleFilled className='closeCircle' />
                </Button>
              </div>
            </>
          )}
        </>
      </Card>
      <ConfirmModal
        key='remove-w9-confirm'
        visible={visibleRemoveW9Confirm}
        container={false}
        title='Confirm Remove W9'
        description={<>Are you sure you want to remove W9 Document?</>}
        confirmLoading={removeW9Document.loading}
        onYes={handleRemoveW9Confirm}
        onNo={handleRemoveW9Cancel}
      />
    </DocumentWrapper>
  );
};

export default Documents;
