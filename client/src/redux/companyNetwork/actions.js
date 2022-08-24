import * as CONSTANTS from './constants';

export const fetchCompanyNetworkUsersRequest = (companyId) => ({
  type: CONSTANTS.FETCH_COMPANY_NETWORK_USERS_REQUEST,
  companyId
});

export const fetchCompanyNetworkUsersSuccess = (data) => ({
  type: CONSTANTS.FETCH_COMPANY_NETWORK_USERS_SUCCESS,
  data,
});

export const fetchCompanyNetworkUsersFail = (error) => ({
  type: CONSTANTS.FETCH_COMPANY_NETWORK_USERS_FAIL,
  error,
});

export const fetchCompanyNetworkUserDetailRequest = (userId) => ({
  type: CONSTANTS.FETCH_COMPANY_NETWORK_USER_DETAIL_REQUEST,
  userId
});

export const fetchCompanyNetworkUserDetailSuccess = (data) => ({
  type: CONSTANTS.FETCH_COMPANY_NETWORK_USER_DETAIL_SUCCESS,
  data,
});

export const fetchCompanyNetworkUserDetailFail = (error) => ({
  type: CONSTANTS.FETCH_COMPANY_NETWORK_USER_DETAIL_FAIL,
  error,
});

export const inviteCompanyNetworkUserRequest = (companyId, payload) => ({
  type: CONSTANTS.INVITE_COMPANY_NETWORK_USER_REQUEST,
  companyId,
  payload
});

export const inviteCompanyNetworkUserSuccess = (data) => ({
  type: CONSTANTS.INVITE_COMPANY_NETWORK_USER_SUCCESS,
  data
});

export const inviteCompanyNetworkUserFail = (error) => ({
  type: CONSTANTS.INVITE_COMPANY_NETWORK_USER_FAIL,
  error,
});

export const fetchCompanyNetworkSentInvitationRequest = (companyId, filter) => ({
  type: CONSTANTS.FETCH_COMPANY_NETWORK_SENT_INVITATION_REQUEST,
  companyId,
  filter
});

export const fetchCompanyNetworkSentInvitationSuccess = (data) => ({
  type: CONSTANTS.FETCH_COMPANY_NETWORK_SENT_INVITATION_SUCCESS,
  data,
});

export const fetchCompanyNetworkSentInvitationFail = (error) => ({
  type: CONSTANTS.FETCH_COMPANY_NETWORK_SENT_INVITATION_FAIL,
  error,
});

export const fetchCompanyNetworkReceivedInvitationRequest = (companyId, filter) => ({
  type: CONSTANTS.FETCH_COMPANY_NETWORK_RECEIVED_INVITATION_REQUEST,
  companyId,
  filter
});

export const fetchCompanyNetworkReceivedInvitationSuccess = (data) => ({
  type: CONSTANTS.FETCH_COMPANY_NETWORK_RECEIVED_INVITATION_SUCCESS,
  data,
});

export const fetchCompanyNetworkReceivedInvitationFail = (error) => ({
  type: CONSTANTS.FETCH_COMPANY_NETWORK_RECEIVED_INVITATION_FAIL,
  error,
});

export const fetchCompanyNetworkConnectionsRequest = (companyId, filter) => ({
  type: CONSTANTS.FETCH_COMPANY_NETWORK_CONNECTION_REQUEST,
  companyId,
  filter,
});

export const fetchCompanyNetworkConnectionsSuccess = (data) => ({
  type: CONSTANTS.FETCH_COMPANY_NETWORK_CONNECTION_SUCCESS,
  data,
});

export const fetchCompanyNetworkConnectionsFail = (error) => ({
  type: CONSTANTS.FETCH_COMPANY_NETWORK_CONNECTION_FAIL,
  error,
});

export const acceptCompanyNetworkInvitationRequest = (invitationId) => ({
  type: CONSTANTS.ACCEPT_COMPANY_NETWORK_INVITATION_REQUEST,
  invitationId,
});

export const acceptCompanyNetworkInvitationSuccess = (data) => ({
  type: CONSTANTS.ACCEPT_COMPANY_NETWORK_INVITATION_SUCCESS,
  data,
});

export const acceptCompanyNetworkInvitationSuccessNotify = (invitation) => ({
  type: CONSTANTS.ACCEPT_COMPANY_NETWORK_INVITATION_SUCCESS_NOTIFY,
  invitation,
});

export const acceptCompanyNetworkInvitationFail = (error) => ({
  type: CONSTANTS.ACCEPT_COMPANY_NETWORK_INVITATION_FAIL,
  error,
});

export const rejectCompanyNetworkInvitationRequest = (invitationId) => ({
  type: CONSTANTS.REJECT_COMPANY_NETWORK_INVITATION_REQUEST,
  invitationId,
});

export const rejectCompanyNetworkInvitationSuccess = (data) => ({
  type: CONSTANTS.REJECT_COMPANY_NETWORK_INVITATION_SUCCESS,
  data,
});

export const rejectCompanyNetworkInvitationSuccessNotify = (invitation) => ({
  type: CONSTANTS.REJECT_COMPANY_NETWORK_INVITATION_SUCCESS_NOTIFY,
  invitation,
});

export const rejectCompanyNetworkInvitationFail = (error) => ({
  type: CONSTANTS.REJECT_COMPANY_NETWORK_INVITATION_FAIL,
  error,
});

export const deleteCompanyNetworkUserRequest = (userId) => ({
  type: CONSTANTS.DELETE_COMPANY_NETWORK_USER_REQUEST,
  userId,
});

export const deleteCompanyNetworkUserSuccess = (data) => ({
  type: CONSTANTS.DELETE_COMPANY_NETWORK_USER_SUCCESS,
  data,
});

export const deleteCompanyNetworkUserFail = (error) => ({
  type: CONSTANTS.DELETE_COMPANY_NETWORK_USER_FAIL,
  error,
});

export const setFavoriteCompanyNetworkUserRequest = (companyId, payload) => ({
  type: CONSTANTS.SET_FAVORITE_COMPANY_NETWORK_USER_REQUEST,
  companyId,
  payload
});

export const setFavoriteCompanyNetworkUserSuccess = (data) => ({
  type: CONSTANTS.SET_FAVORITE_COMPANY_NETWORK_USER_SUCCESS,
  data
});

export const setFavoriteCompanyNetworkUserFail = (error) => ({
  type: CONSTANTS.SET_FAVORITE_COMPANY_NETWORK_USER_FAIL,
  error,
});

export const deleteCompanyNetworkConnectionRequest = (connectionId) => ({
  type: CONSTANTS.DELETE_COMPANY_NETWORK_CONNECTION_REQUEST,
  connectionId,
});

export const deleteCompanyNetworkConnectionSuccess = (data) => ({
  type: CONSTANTS.DELETE_COMPANY_NETWORK_CONNECTION_SUCCESS,
  data,
});

export const deleteCompanyNetworkConnectionFail = (error) => ({
  type: CONSTANTS.DELETE_COMPANY_NETWORK_CONNECTION_FAIL,
  error,
});

export const deleteCompanyNetworkConnectionSuccessNotify = () => ({
  type: CONSTANTS.DELETE_COMPANY_NETWORK_CONNECTION_SUCCESS_NOTIFY,
});
