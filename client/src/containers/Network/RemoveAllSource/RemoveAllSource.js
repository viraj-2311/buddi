import React from 'react';
import RemoveAllSourceModal from './RemoveAllSource.style';
import Button from '@iso/components/uielements/button';

export default ({ visible, description, confirm, handleCancel }) => {
  return (
    <RemoveAllSourceModal
      title="Remove all sources?"
      visible={visible}
      width={526}
      onCancel={handleCancel}
      footer={null}
    >
      <p className="description">{description}</p>
      <div className="actions">
        <Button className="continueBtn" shape="round" onClick={handleCancel}>
          Continue
        </Button>
        <Button className="default" shape="round" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </RemoveAllSourceModal>
  );
};
