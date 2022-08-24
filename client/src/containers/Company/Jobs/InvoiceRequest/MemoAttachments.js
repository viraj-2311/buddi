import React from 'react';
import MemoAttachmentsWrapper from './MemoAttachments.style';
import filesize from 'filesize.js';
import MultiplyIcon from '@iso/components/icons/Multiply';
import Button from '@iso/components/uielements/button';

const MemoAttachments = ({attachments, onDelete}) => {
  return (
    <MemoAttachmentsWrapper>
      {attachments.map((attachment, index) => (
        <div className="attachment" key={`attachment-${index}`}>
          <div className="nameAndSize">
            <a href={attachment.path} target="_blank" className="name" title={attachment.name}>
              {attachment.name}
            </a>
            <span>({filesize(attachment.size)})</span>
          </div>
          <Button type="link" icon={<MultiplyIcon width={14} height={14} />} onClick={() => onDelete(index)} />
        </div>
      ))}
    </MemoAttachmentsWrapper>
  );
};

export default MemoAttachments;