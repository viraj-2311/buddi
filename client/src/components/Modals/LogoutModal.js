import React from 'react';
import LogoutModal from './LogoutModal.style';
import cn from 'classnames';
import MultiplyIcon from '@iso/components/icons/Multiply';
import Button from '@iso/components/uielements/button';
import PowerOff from '@iso/components/icons/Power';

export default ({
  visible,
  width,
  bodyStyle,
  title,
  description,
  onContinue,
  onClose,
  loading = false,
  wrapClassName = '',
}) => {
  const onContinueClick = (e) => {
    onContinue();
  };

  const onCloseClick = () => {
    onClose();
  };

  return (
    <LogoutModal
      visible={visible}
      closable={false}
      width={width || 400}
      bodyStyle={bodyStyle}
      wrapClassName={wrapClassName}
      footer={null}
    >
      <Button type='link' className='closeBtn' onClick={onCloseClick}>
        <MultiplyIcon width={14} height={14} />
      </Button>
      <p className='modal-icon-wrapper'>
        <PowerOff fill='#eb5757' />
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
        <Button
          shape='round'
          type='primary'
          onClick={onContinueClick}
          loading={loading}
        >
          Continue to your Personal profile
        </Button>
      </div>
    </LogoutModal>
  );
};
