import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ConfirmModal from './Confirm.style';
import Button from '@iso/components/uielements/button';
import {
  showStaffInvitation,
  closeStaffInvitationConfirm,
  cancelStaffInvitationConfirm
} from '@iso/redux/modal/actions';

export default ({onYes, onNo, onCancel, onSkip}) => {
  const dispatch = useDispatch();
  const { confirm: { visible }, invitee } = useSelector(state => state.Modal.staffInvitation);

  const yesInvite = (e) => {
    dispatch(closeStaffInvitationConfirm());
    dispatch(showStaffInvitation({props: {}}));
    if (onYes) onYes();
  };

  const noInvite = () => {
    dispatch(cancelStaffInvitationConfirm());
    if (onNo) onNo();
  };

  const skipInvite = () => {
    dispatch(cancelStaffInvitationConfirm());
    if (onSkip) onSkip();
  }

  const handleCancel = () => {
    dispatch(cancelStaffInvitationConfirm());
    if (onCancel) onCancel();
  };


  return (
    <ConfirmModal
      visible={visible}
      width={600}
      onCancel={handleCancel}
      footer={null}
      maskClosable={false}
    >
      <h2 className="title">Are you sure?</h2>
      <p className="description">
        Would you like to add <span className="inviteeName">{invitee?.fullName}</span> to your Company roster? This will acknowledge that these users are employees of your company.
      </p>
      <div className="actions">
        <Button className="default" onClick={yesInvite}>Yes</Button>
        <Button className="red" onClick={noInvite}>No</Button>
        {onSkip && <Button type="link" className="skipBtn" onClick={skipInvite}>Don't show me again</Button>}
      </div>
    </ConfirmModal>
  );
}
