import React from 'react';
import {useSelector} from 'react-redux';
import StaffInvitationConfirm from './Confirm';
import StaffInvitation from './Invite';
import StaffInvitationSuccess from './Success';

export default () => {
  const { confirm: {props: confirmProps}, form: {props: formProps} } = useSelector(state => state.Modal.staffInvitation);

  return (
    <>
      <StaffInvitationConfirm {...confirmProps} />
      <StaffInvitation {...formProps} />
      <StaffInvitationSuccess />
    </>
  );
}
