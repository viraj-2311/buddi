import React from 'react';
import {ProducerJobAttachmentsWrapper, ContractorJobAttachmentsWrapper} from './JobAttachments.style';
import Button from '@iso/components/uielements/button';
import Icon from '@iso/components/icons/Icon';
import TrashIcon from '@iso/components/icons/Trash';
import DownloadIcon from '@iso/components/icons/Download';
import filesize from 'filesize.js';
import ProducerAttachmentPdfImg from '@iso/assets/images/producer-attachment-pdf.svg';
import ContractorAttachmentPdfImg from '@iso/assets/images/pdf.svg';
import Multiply from "../../../../../components/icons/Multiply";

const ProducerJobAttachments = ({ attachments, onDelete }) => {
  return (
    <ProducerJobAttachmentsWrapper>
      {attachments.map((attachment) => (
        <div className='attachmentBox' key={`producer-attachment-${attachment.id}`}>
          <div className='attachmentDetails'>
            <Icon image={ProducerAttachmentPdfImg} width={28} height={35} />
            <div className='attachmentTitleAndSize'>
              <span className='attachmentTitle'>{attachment.name}</span>
              <span className='attachmentSize'>{filesize(attachment.size)}</span>
            </div>
          </div>
          <div className="attachmentActions">
            {onDelete && (
                <Button
                    type='link'
                    className='removeBtn'
                    onClick={() => onDelete(attachment)}
                >
                  <TrashIcon width={14} height={18} fill={'#51369a'} />
                </Button>
            )}
            <Button
                type={'link'}
                href={attachment.path}
                download
                className='downloadBtn'
                title={attachment.name}
            >
              <DownloadIcon width={18} height={18} stroke={'#51369a'} strokeWidth={3} />
            </Button>
          </div>
        </div>
      ))}
    </ProducerJobAttachmentsWrapper>
  );
};

const ContractorJobAttachments = ({ attachments, onDelete }) => {
  return (
    <ContractorJobAttachmentsWrapper>
      {attachments.map((attachment) => (
        <div className='attachmentBox' key={`contractor-attachment-${attachment.id}`}>
          <div className='attachmentDetails'>
            <Icon image={ContractorAttachmentPdfImg} width={16} height={20} />
            <div className='attachmentTitleAndSize'>
              <a
                  href={attachment.path}
                  target='_blank'
                  className='attachmentTitle'
                  title={attachment.name}
              >
                {attachment.name}
              </a>
              <span className='attachmentSize'>({filesize(attachment.size)})</span>
            </div>
          </div>
          <div className="attachmentActions">
            {onDelete && (
                <Button
                    type='link'
                    className='removeBtn'
                    onClick={() => onDelete(attachment)}
                >
                  <Multiply width={14} height={14} fill={'#2f2e50'} />
                </Button>
            )}
          </div>
        </div>
      ))}
    </ContractorJobAttachmentsWrapper>
  );
};

export {ProducerJobAttachments, ContractorJobAttachments};
