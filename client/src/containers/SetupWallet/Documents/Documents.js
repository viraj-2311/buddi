import React, { useState, useRef, useEffect } from 'react';
import filesize from 'filesize.js';
import Button from '@iso/components/uielements/button';
import Dropzone from '@iso/components/uielements/dropzone';
import Icon from '@iso/components/icons/Icon';
import DownloadCloudIcon from '@iso/components/icons/DownloadCloud';
import { DocumentWrapper } from './Documents.style';
import PdfImg from '@iso/assets/images/pdf.svg';
import { CloseCircleFilled } from '@ant-design/icons';

const Documents = ({ documentUpdate, loading, acceptedTypes }) => {
  const [documentError, setDocumentError] = useState('');
  const filePicker = useRef(null);

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleAttachmentLoad = async (acceptedFiles) => {
    const attachments = [];
    Array.from(acceptedFiles).map((file) => {
      attachments.push({
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    });

    setUploadedFiles((prevState) => {
      return [...prevState, ...attachments];
    });
  };

  useEffect(() => {
    documentUpdate(uploadedFiles);
  }, [uploadedFiles]);

  const handleRemoveAttachment = (index) => {
    setUploadedFiles((prevState) => {
      return prevState.filter((_, i) => i !== index);
    });
  };

  const openFilePicker = () => {
    if (filePicker && filePicker.current) {
      filePicker.current.value = null;
      filePicker.current.click();
    }
  };

  return (
    <DocumentWrapper>
      <>
        <Dropzone
          disabled={loading}
          accept={acceptedTypes}
          onDrop={(files) => handleAttachmentLoad(files)}
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
                loading={loading}
              >
                Browse
              </Button>
            </div>
          )}
        </Dropzone>
        {documentError && <div className='errorText'>{documentError}</div>}

        {uploadedFiles && uploadedFiles.length > 0 && (
          <>
            <h3>Uploaded files</h3>
            {uploadedFiles.map((file, index) => {
              return (
                <div className='attachmentBox' key={index}>
                  <div className='attachmentDetails'>
                    <Icon image={PdfImg} width={20} height={26} />
                    <div className='rightDetail'>
                      {/* <a
                        href={file.path}
                        target="_blank"
                        className="attachmentTitle"
                        title={file.name}
                      >
                        {file.name}

                      </a> */}
                      <p className='attachmentTitle'>{file.name}</p>
                      <span>{filesize(file.size)}</span>
                    </div>
                  </div>
                  <Button
                    type='link'
                    onClick={() => {
                      handleRemoveAttachment(index);
                    }}
                  >
                    <CloseCircleFilled className='closeCircle' />
                  </Button>
                </div>
              );
            })}
          </>
        )}
      </>
    </DocumentWrapper>
  );
};

export default Documents;
