import React from 'react';
import WalletNotSetModal from './WalletNotSetModal.style';
import MultiplyIcon from '@iso/components/icons/Multiply';
import Button from '@iso/components/uielements/button';
import { InfoCircleFilled } from '@ant-design/icons';

export default ({
  visible,
  width,
  bodyStyle,
  title,
  description,
  onSetupWallet,
  onCancel,
  wrapClassName = '',
  hasCompanyOwner
}) => {
  const onSetupWalletClick = (e) => {
    onSetupWallet();
  };

  const onCancelClick = () => {
    onCancel();
  };

  return (
    <WalletNotSetModal
      visible={visible}
      closable={false}
      width={width || 400}
      bodyStyle={bodyStyle}
      onCancel={onCancelClick}
      wrapClassName={wrapClassName}
      footer={null}
    >
      <Button type="link" className="closeBtn" onClick={onCancelClick}>
        <MultiplyIcon width={14} height={14} />
      </Button>
      <p className="modal-icon-wrapper">
        <InfoCircleFilled style={{ color: '#ffa177' }} />
      </p>
      <h2 className="title">{title}</h2>
      <p className="description">{description}</p>
      <div className="actions">
      {hasCompanyOwner ? (
        <Button
          type="primary"
          shape="round"
          onClick={onCancelClick}
          autoFocus
        >
          Done
        </Button>
      ):(
        <Button
          type="primary"
          shape="round"
          onClick={onSetupWalletClick}
          autoFocus
        >
          Setup Wallet
        </Button> )}
      </div>
    </WalletNotSetModal>
  );
};
