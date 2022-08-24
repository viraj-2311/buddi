import * as contants from './constants'

export const showStaffInvitationConfirm = ({company, invitee, props}) => ({
  type: contants.SHOW_STAFF_INVITATION_CONFIRM,
  company,
  invitee,
  props
});
export const cancelStaffInvitationConfirm = () => ({
  type: contants.CANCEL_STAFF_INVITATION_CONFIRM,
});
export const closeStaffInvitationConfirm = () => ({
  type: contants.CLOSE_STAFF_INVITATION_CONFIRM,
});

export const showStaffInvitation = ({props}) => ({
  type: contants.SHOW_STAFF_INVITATION,
  props
});
export const cancelStaffInvitation = () => ({
  type: contants.CANCEL_STAFF_INVITATION
});
export const closeStaffInvitation = () => ({
  type: contants.CLOSE_STAFF_INVITATION
});


export const showStaffInvitationSuccess = () => ({
  type: contants.SHOW_STAFF_INVITATION_SUCCESS
});
export const closeStaffInvitationSuccess = () => ({
  type: contants.CLOSE_STAFF_INVITATION_SUCCESS
});


export const showBookCrewConfirm = ({props}) => ({
  type: contants.SHOW_BOOK_CREW_CONFIRM,
  props
});
export const closeBookCrewConfirm = () => ({
  type: contants.CLOSE_BOOK_CREW_CONFIRM,
});


export const showSuccess = ({props}) => ({
  type: contants.SHOW_SUCCESS,
  props
});
export const closeSuccess = () => ({
  type: contants.CLOSE_SUCCESS
});