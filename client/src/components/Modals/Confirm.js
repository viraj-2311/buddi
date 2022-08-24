import React, { useEffect } from 'react';
import ConfirmModal from './Confirm.style';
import MultiplyIcon from '@iso/components/icons/Multiply';
import Button from '@iso/components/uielements/button';
import { InfoCircleFilled } from '@ant-design/icons';

export default ({
  visible,
  width,
  bodyStyle,
  title,
  description,
  onYes,
  onNo,
  titleYesBtn = 'Yes',
  titleNoBtn = 'No',
  confirmLoading = false,
  wrapClassName = 'hCentered',
}) => {
  const onYesClick = (e) => {
    onYes();
  };

  const onNoClick = () => {
    onNo();
  };

  return (
    <ConfirmModal
      visible={visible}
      closable={false}
      width={width || 470}
      bodyStyle={bodyStyle}
      wrapClassName={wrapClassName}
      footer={null}
    >
      <Button type='link' className='closeBtn' onClick={onNoClick}>
        <MultiplyIcon width={14} height={14} />
      </Button>
      <p className='modal-icon-wrapper'>
        <InfoCircleFilled style={{ color: '#ffa177' }} />
      </p>
      <h2 className='title'>{title}</h2>
      <p className='description'>{description}</p>
      <div className='actions'>
        {titleNoBtn != '' && (
          <Button className='default' shape='round' onClick={onNoClick}>
            {titleNoBtn}
          </Button>
        )}
        {titleYesBtn != '' && (
          <Button
            className='red'
            shape='round'
            onClick={onYesClick}
            loading={confirmLoading}
            autoFocus
          >
            {titleYesBtn}
          </Button>
        )}
      </div>
    </ConfirmModal>
  );
};
