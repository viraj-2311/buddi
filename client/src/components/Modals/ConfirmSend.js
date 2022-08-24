import React, { useEffect } from 'react';
import ConfirmModal from './ConfirmSend.style';
import MultiplyIcon from '@iso/components/icons/Multiply';
import Button from '@iso/components/uielements/button';
import { InfoCircleFilled } from '@ant-design/icons';
import { formatMoney } from '@iso/lib/helpers/numberUtil';

export default ({
  visible,
  width,
  bodyStyle,
  title,
  amount,
  userSend,
  onYes,
  onNo,
  titleYesBtn = 'Confirm',
  titleNoBtn = 'Cancel',
  confirmLoading = false,
  wrapClassName = 'hCentered',
}) => {
  const onYesClick = (e) => {
    onYes();
  };

  const onNoClick = () => {
    onNo();
  };

  let moneyFormat = formatMoney(amount);

  return (
    <ConfirmModal
      visible={visible}
      closable={false}
      width={width || 350}
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

      <div className='success-message'>
        <p>
          <span className='even-number'>${moneyFormat.evenMoney}</span>
          <span className='small-number'>.{moneyFormat.pence}</span>
        </p>
      </div>
      <span>to </span>
      <span className='user-send'>{userSend}</span>
      <div className='actions'>
        {titleYesBtn != '' && (
          <Button
            className='confirm'
            shape='round'
            onClick={onYesClick}
            loading={confirmLoading}
            autoFocus
          >
            {titleYesBtn}
          </Button>
        )}
        {titleNoBtn != '' && (
          <Button className='default' shape='round' onClick={onNoClick}>
            {titleNoBtn}
          </Button>
        )}
      </div>
    </ConfirmModal>
  );
};
