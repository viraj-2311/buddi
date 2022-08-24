import * as CONSTANTS from './constants';

export const fetchPersonalNetworkUsersRequest = (userId) => ({
  type: CONSTANTS.FETCH_PERSONAL_NETWORK_USERS_REQUEST,
  userId,
});

export const fetchPersonalNetworkUsersSuccess = (data) => ({
  type: CONSTANTS.FETCH_PERSONAL_NETWORK_USERS_SUCCESS,
  data,
});

export const fetchPersonalNetworkUsersFail = (error) => ({
  type: CONSTANTS.FETCH_PERSONAL_NETWORK_USERS_FAIL,
  error,
});

export const fetchPersonalNetworkUserDetailRequest = (userId) => ({
  type: CONSTANTS.FETCH_PERSONAL_NETWORK_USER_DETAIL_REQUEST,
  userId,
});

export const fetchPersonalNetworkUserDetailSuccess = (data) => ({
  type: CONSTANTS.FETCH_PERSONAL_NETWORK_USER_DETAIL_SUCCESS,
  data,
});

export const fetchPersonalNetworkUserDetailFail = (error) => ({
  type: CONSTANTS.FETCH_PERSONAL_NETWORK_USER_DETAIL_FAIL,
  error,
});

export const invitePersonalNetworkUserRequest = (userId, payload) => ({
  type: CONSTANTS.INVITE_PERSONAL_NETWORK_USER_REQUEST,
  userId,
  payload,
});

export const invitePersonalNetworkUserSuccess = (data) => ({
  type: CONSTANTS.INVITE_PERSONAL_NETWORK_USER_SUCCESS,
  data,
});

export const invitePersonalNetworkUserFail = (error) => ({
  type: CONSTANTS.INVITE_PERSONAL_NETWORK_USER_FAIL,
  error,
});

export const fetchPersonalNetworkSentInvitationRequest = (userId, filter) => ({
  type: CONSTANTS.FETCH_PERSONAL_NETWORK_SENT_INVITATION_REQUEST,
  userId,
  filter,
});

export const fetchPersonalNetworkSentInvitationSuccess = (data) => ({
  type: CONSTANTS.FETCH_PERSONAL_NETWORK_SENT_INVITATION_SUCCESS,
  data,
});

export const fetchPersonalNetworkSentInvitationFail = (error) => ({
  type: CONSTANTS.FETCH_PERSONAL_NETWORK_SENT_INVITATION_FAIL,
  error,
});

export const fetchPersonalNetworkReceivedInvitationRequest = (
  userId,
  filter
) => ({
  type: CONSTANTS.FETCH_PERSONAL_NETWORK_RECEIVED_INVITATION_REQUEST,
  userId,
  filter,
});

export const fetchPersonalNetworkReceivedInvitationSuccess = (data) => ({
  type: CONSTANTS.FETCH_PERSONAL_NETWORK_RECEIVED_INVITATION_SUCCESS,
  data,
});

export const fetchPersonalNetworkReceivedInvitationFail = (error) => ({
  type: CONSTANTS.FETCH_PERSONAL_NETWORK_RECEIVED_INVITATION_FAIL,
  error,
});

export const fetchPersonalNetworkConnectionsRequest = (userId, filter) => ({
  type: CONSTANTS.FETCH_PERSONAL_NETWORK_CONNECTION_REQUEST,
  userId,
  filter,
});

export const fetchPersonalNetworkConnectionsSuccess = (data) => ({
  type: CONSTANTS.FETCH_PERSONAL_NETWORK_CONNECTION_SUCCESS,
  data,
});

export const fetchPersonalNetworkConnectionsFail = (error) => ({
  type: CONSTANTS.FETCH_PERSONAL_NETWORK_CONNECTION_FAIL,
  error,
});

export const acceptPersonalNetworkInvitationRequest = (
  invitationId,
  source
) => ({
  type: CONSTANTS.ACCEPT_PERSONAL_NETWORK_INVITATION_REQUEST,
  invitationId,
  source,
});

export const acceptPersonalNetworkInvitationSuccess = (data) => ({
  type: CONSTANTS.ACCEPT_PERSONAL_NETWORK_INVITATION_SUCCESS,
  data,
});

export const acceptPersonalNetworkInvitationNotify = (
  invitation,
  isSuccess
) => ({
  type: CONSTANTS.ACCEPT_PERSONAL_NETWORK_INVITATION_NOTIFY,
  invitation,
  isSuccess,
});

export const acceptPersonalNetworkInvitationFail = ({
  error,
  invitationId,
}) => ({
  type: CONSTANTS.ACCEPT_PERSONAL_NETWORK_INVITATION_FAIL,
  error,
  invitationId,
});

export const rejectPersonalNetworkInvitationRequest = (
  invitationId,
  source
) => ({
  type: CONSTANTS.REJECT_PERSONAL_NETWORK_INVITATION_REQUEST,
  invitationId,
  source,
});

export const rejectPersonalNetworkInvitationSuccess = (data) => ({
  type: CONSTANTS.REJECT_PERSONAL_NETWORK_INVITATION_SUCCESS,
  data,
});

export const rejectPersonalNetworkInvitationNotify = (
  invitation,
  isSuccess
) => ({
  type: CONSTANTS.REJECT_PERSONAL_NETWORK_INVITATION_NOTIFY,
  invitation,
  isSuccess,
});

export const rejectPersonalNetworkInvitationFail = ({
  error,
  invitationId,
}) => ({
  type: CONSTANTS.REJECT_PERSONAL_NETWORK_INVITATION_FAIL,
  error,
  invitationId,
});

export const deletePersonalNetworkUserRequest = (userId) => ({
  type: CONSTANTS.DELETE_PERSONAL_NETWORK_USER_REQUEST,
  userId,
});

export const deletePersonalNetworkUserSuccess = (data) => ({
  type: CONSTANTS.DELETE_PERSONAL_NETWORK_USER_SUCCESS,
  data,
});

export const deletePersonalNetworkUserFail = (error) => ({
  type: CONSTANTS.DELETE_PERSONAL_NETWORK_USER_FAIL,
  error,
});

export const setFavoritePersonalNetworkUserRequest = (userId, payload) => ({
  type: CONSTANTS.SET_FAVORITE_PERSONAL_NETWORK_USER_REQUEST,
  userId,
  payload,
});

export const setFavoritePersonalNetworkUserSuccess = (data) => ({
  type: CONSTANTS.SET_FAVORITE_PERSONAL_NETWORK_USER_SUCCESS,
  data,
});

export const setFavoritePersonalNetworkUserFail = (error) => ({
  type: CONSTANTS.SET_FAVORITE_PERSONAL_NETWORK_USER_FAIL,
  error,
});

export const deletePersonalNetworkConnectionRequest = (connectionId) => ({
  type: CONSTANTS.DELETE_PERSONAL_NETWORK_CONNECTION_REQUEST,
  connectionId,
});

export const deletePersonalNetworkConnectionSuccess = (data) => ({
  type: CONSTANTS.DELETE_PERSONAL_NETWORK_CONNECTION_SUCCESS,
  data,
});

export const deletePersonalNetworkConnectionFail = (error) => ({
  type: CONSTANTS.DELETE_PERSONAL_NETWORK_CONNECTION_FAIL,
  error,
});

export const deletePersonalNetworkConnectionSuccessNotify = () => ({
  type: CONSTANTS.DELETE_PERSONAL_NETWORK_CONNECTION_SUCCESS_NOTIFY,
});

export const deleteCorporateNetworkConnectionRequest = (connectionId) => ({
  type: CONSTANTS.DELETE_CORPORATE_NETWORK_CONNECTION_REQUEST,
  connectionId,
});

export const deleteCorporateNetworkConnectionSuccess = (data) => ({
  type: CONSTANTS.DELETE_CORPORATE_NETWORK_CONNECTION_SUCCESS,
  data,
});

export const deleteCorporateNetworkConnectionFail = (error) => ({
  type: CONSTANTS.DELETE_CORPORATE_NETWORK_CONNECTION_FAIL,
  error,
});

export const fetchPersonalNetworkContactsRequest = (userId) => ({
  type: CONSTANTS.FETCH_PERSONAL_NETWORK_CONTACTS_REQUEST,
  userId,
});

export const fetchPersonalNetworkContactsSuccess = (data) => ({
  type: CONSTANTS.FETCH_PERSONAL_NETWORK_CONTACTS_SUCCESS,
  data,
});

export const fetchPersonalNetworkContactsFail = (error) => ({
  type: CONSTANTS.FETCH_PERSONAL_NETWORK_CONTACTS_FAIL,
  error,
});

export const bulkPersonalNetworkAddContactsRequest = (payload) => ({
  type: CONSTANTS.BULK_ADD_PERSONAL_NETWORK_CONTACTS_REQUEST,
  payload,
});

export const bulkPersonalNetworkAddContactsSuccess = (data) => ({
  type: CONSTANTS.BULK_ADD_PERSONAL_NETWORK_CONTACTS_SUCCESS,
  data,
});

export const bulkPersonalNetworkAddContactsFail = (error) => ({
  type: CONSTANTS.BULK_ADD_PERSONAL_NETWORK_CONTACTS_FAIL,
  error,
});

export const deletePersonalNetworkContactRequest = (id) => ({
  type: CONSTANTS.DELETE_PERSONAL_NETWORK_CONTACT_REQUEST,
  id,
});

export const deletePersonalNetworkContactSuccess = (data) => ({
  type: CONSTANTS.DELETE_PERSONAL_NETWORK_CONTACT_SUCCESS,
  data,
});

export const deletePersonalNetworkContactFail = (error) => ({
  type: CONSTANTS.DELETE_PERSONAL_NETWORK_CONTACT_FAIL,
  error,
});
