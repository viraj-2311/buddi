import * as CONSTANTS from './constants';

export const setWorkspaceCompany = (id) => ({
  type: CONSTANTS.SET_WORKSPACE_COMPANY,
  id,
});

export const fetchAccountJobsRequest = (accountId, jobType) => ({
  type: CONSTANTS.FETCH_ACCOUNT_JOBS_REQUEST,
  accountId,
  jobType
});

export const fetchAccountJobsSuccess = (jobType, data) => ({
  type: CONSTANTS.FETCH_ACCOUNT_JOBS_SUCCESS,
  jobType,
  data,
});

export const fetchAccountJobsFail = (error) => ({
  type: CONSTANTS.FETCH_ACCOUNT_JOBS_FAIL,
  error
});

export const fetchAccountCallsheetsRequest = (accountId, filter) => ({
  type: CONSTANTS.FETCH_ACCOUNT_CALLSHEETS_REQUEST,
  accountId,
  filter
});

export const fetchAccountCallsheetsSuccess = (data) => ({
  type: CONSTANTS.FETCH_ACCOUNT_CALLSHEETS_SUCCESS,
  data,
});

export const fetchAccountCallsheetsFail = (error) => ({
  type: CONSTANTS.FETCH_ACCOUNT_CALLSHEETS_FAIL,
  error
});

export const fetchAccountNetworkInvitationsRequest = (accountId, filter) => ({
  type: CONSTANTS.FETCH_ACCOUNT_NETWORK_INVITATIONS_REQUEST,
  accountId,
  filter
});

export const fetchAccountNetworkInvitationsSuccess = (data) => ({
  type: CONSTANTS.FETCH_ACCOUNT_NETWORK_INVITATIONS_SUCCESS,
  data,
});

export const fetchAccountNetworkInvitationsFail = (error) => ({
  type: CONSTANTS.FETCH_ACCOUNT_NETWORK_INVITATIONS_FAIL,
  error
});
