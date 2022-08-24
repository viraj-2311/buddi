import React from 'react';
import UserProfileBody from './UserProfileBody';
import UserProfileModal from './UserProfile.style';

export default ({ userId, visible, handleCancel }) => {
  return (
    <UserProfileModal
      visible={visible}
      width={1080}
      footer={null}
      onCancel={handleCancel}
    >
      <UserProfileBody userId={userId} />
    </UserProfileModal>
  );
};
