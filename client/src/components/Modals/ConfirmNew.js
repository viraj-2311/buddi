import React from 'react';
import ConfirmModal, { OkButton } from './ConfirmNew.style';
import cn from 'classnames';
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
  confirmLoading = false,
  wrapClassName = '',
  yesButtonColor = '#19913d',
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
      width={width || 400}
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
      <p
        className={cn('description', {
          boldDescription: !title,
        })}
      >
        {description}
      </p>
      <div className='actions'>
        <Button className='default noBtn' shape='round' onClick={onNoClick}>
          No
        </Button>
        <OkButton
          className='yesBtn'
          color={yesButtonColor}
          shape='round'
          onClick={onYesClick}
          loading={confirmLoading}
          autoFocus
        >
          Yes
        </OkButton>
      </div>
    </ConfirmModal>
  );
};
