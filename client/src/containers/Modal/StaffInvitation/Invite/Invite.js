import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InvitationModal from './Invite.style';
import Logo from '@iso/assets/images/logo-black.webp';
import StaffInvitationForm from '@iso/containers/Company/Invitation/StaffForm/StaffForm';
import {
  closeStaffInvitation,
  cancelStaffInvitation,
} from '@iso/redux/modal/actions';
import _ from 'lodash';

export default ({ onSubmit, onCancel, cancelButton }) => {
  const dispatch = useDispatch();
  const {
    form: { visible },
    company,
    invitee,
  } = useSelector((state) => state.Modal.staffInvitation);
  const { invitees } = useSelector((state) => state.User.invite);

  useEffect(() => {
    if (invitees.length > 0) {
      if (_.filter(invitees, (invitee) => invitee.error).length > 0) return;
      dispatch(closeStaffInvitation());
    }
  }, [invitees]);

  const handleCancel = () => {
    dispatch(cancelStaffInvitation());
    if (onCancel) onCancel();
  };

  const handleInviteStaff = () => {
    if (onSubmit) onSubmit();
  };

  const staffs = useMemo(() => [{ ...invitee }], [invitee]);

  return (
    <InvitationModal
      visible={visible}
      width={850}
      footer={null}
      className='invitationModal'
      onCancel={handleCancel}
    >
      <div className='logo'>
        <img src={Logo} height={72} />
      </div>
      <div className='title'>Band Staff Invitation Form</div>
      <p className='subTitle'>
        Invite employees of your band into your private workspace. When
        adding talent to the band staff, go to Settings and click "Band
        Staff"
      </p>
      <div className='formWrapper'>
        <StaffInvitationForm
          company={company}
          staffs={staffs}
          onSubmit={handleInviteStaff}
          cancelButton={cancelButton}
        />
      </div>
    </InvitationModal>
  );
};
