import React from 'react';
import SuccessModal from './Success.style';
import MultiplyIcon from '@iso/components/icons/Multiply';
import Button from '@iso/components/uielements/button';
import SuccessIcon from '@iso/components/icons/Success';

export default ({visible, width, bodyStyle, title, description, onClose, ...rest}) => {
  const { customIcon } = rest;
  const handleCancel = () => {
    onClose();
  };

  return (
    <SuccessModal
      visible={visible}
      width={width || 405}
      bodyStyle={bodyStyle}
      closable={false}
      footer={null}
    >
      <Button type="link" className="closeBtn" onClick={handleCancel}><MultiplyIcon width={14} height={14}/></Button>
      <p className="modal-icon-wrapper">
        {customIcon ? customIcon : <SuccessIcon width={50} height={50} />}
      </p>
      <h2 className="title">{title}</h2>
      <p className="description">
        {description}
      </p>
      <div className="actions">
        <Button type="primary" shape="round" onClick={handleCancel}>Continue</Button>
      </div>
    </SuccessModal>
  );
}
