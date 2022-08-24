import React from 'react';
import Button from '@iso/components/uielements/button';
import RemoveConnectionModal from './RemoveConnection.style';

export default ({ visible, description, onYes, onCancel }) => {
  return (
    <RemoveConnectionModal
      title="Remove Connection"
      visible={visible}
      width={758}
      footer={null}
      onCancel={onCancel}
    >
      <p className="description">{description}</p>
      <div className="actions">
        <Button className="default" shape="round" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="red" shape="round" onClick={onYes}>
          Remove
        </Button>
      </div>
    </RemoveConnectionModal>
  );
};
