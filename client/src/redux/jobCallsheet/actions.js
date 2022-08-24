import * as CONSTANTS from './constants';

export const fetchProductionContactsRequest = (jobId) => ({
  type: CONSTANTS.FETCH_PRODUCTION_CONTACTS_REQUEST,
  jobId,
});

export const fetchProductionContactsSuccess = (data) => ({
  type: CONSTANTS.FETCH_PRODUCTION_CONTACTS_SUCCESS,
  data,
});

export const fetchProductionContactsFail = (error) => ({
  type: CONSTANTS.FETCH_PRODUCTION_CONTACTS_FAIL,
  error,
});

export const fetchCrewsRequest = (jobId) => ({
  type: CONSTANTS.FETCH_CREWS_REQUEST,
  jobId,
});

export const fetchCrewsSuccess = (data) => ({
  type: CONSTANTS.FETCH_CREWS_SUCCESS,
  data,
});

export const fetchCrewsFail = (error) => ({
  type: CONSTANTS.FETCH_CREWS_FAIL,
  error,
});

export const createCallsheetRequest = ({jobId, payload}) => ({
  type: CONSTANTS.CREATE_CALLSHEET_REQUEST,
  jobId,
  payload
});

export const createCallsheetSuccess = (data) => ({
  type: CONSTANTS.CREATE_CALLSHEET_SUCCESS,
  data
});

export const createCallsheetFail = (error) => ({
  type: CONSTANTS.CREATE_CALLSHEET_FAIL,
  error
});

export const updateCallsheetRequest = (jobId, callsheetId, payload) => ({
  type: CONSTANTS.UPDATE_CALLSHEET_REQUEST,
  jobId,
  callsheetId,
  payload
});

export const updateCallsheetSuccess = (data) => ({
  type: CONSTANTS.UPDATE_CALLSHEET_SUCCESS,
  data
});

export const updateCallsheetFail = (error) => ({
  type: CONSTANTS.UPDATE_CALLSHEET_FAIL,
  error
});

export const deleteCallsheetRequest = (jobId, callsheetId) => ({
  type: CONSTANTS.DELETE_CALLSHEET_REQUEST,
  jobId,
  callsheetId
});

export const deleteCallsheetSuccess = (callsheetId) => ({
  type: CONSTANTS.DELETE_CALLSHEET_SUCCESS,
  callsheetId
});

export const deleteCallsheetFail = (error) => ({
  type: CONSTANTS.DELETE_CALLSHEET_FAIL,
  error
});

export const deleteBulkCallsheetRequest = (jobId, callsheetIds) => ({
  type: CONSTANTS.DELETE_BULK_CALLSHEET_REQUEST,
  jobId,
  callsheetIds
});

export const deleteBulkCallsheetSuccess = (callsheetIds) => ({
  type: CONSTANTS.DELETE_BULK_CALLSHEET_SUCCESS,
  callsheetIds
});

export const deleteBulkCallsheetFail = (error) => ({
  type: CONSTANTS.DELETE_BULK_CALLSHEET_FAIL,
  error
});

export const fetchFullviewRequest = ({jobId, filter}) => ({
  type: CONSTANTS.FETCH_FULLVIEW_REQUEST,
  jobId,
  filter,
});

export const fetchFullviewSuccess = (data) => ({
  type: CONSTANTS.FETCH_FULLVIEW_SUCCESS,
  data,
});

export const fetchFullviewFail = (error) => ({
  type: CONSTANTS.FETCH_FULLVIEW_FAIL,
  error,
});

export const fetchPrintViewRequest = ({jobId, filter}) => ({
  type: CONSTANTS.FETCH_PRINT_VIEW_REQUEST,
  jobId,
  filter,
});

export const fetchPrintViewSuccess = (data) => ({
  type: CONSTANTS.FETCH_PRINT_VIEW_SUCCESS,
  data,
});

export const fetchPrintViewFail = (error) => ({
  type: CONSTANTS.FETCH_PRINT_VIEW_FAIL,
  error,
});

export const sendCallsheetRequest = ({jobId, payload}) => ({
  type: CONSTANTS.SEND_CALLSHEET_REQUEST,
  jobId,
  payload
});

export const sendCallsheetSuccess = (data) => ({
  type: CONSTANTS.SEND_CALLSHEET_SUCCESS,
  data,
});

export const sendCallsheetFail = (error) => ({
  type: CONSTANTS.SEND_CALLSHEET_FAIL,
  error,
});

export const fetchCallsheetDatesRequest = (jobId) => ({
  type: CONSTANTS.FETCH_CALLSHEET_DATES_REQUEST,
  jobId,
});

export const fetchCallsheetDatesSuccess = (data) => ({
  type: CONSTANTS.FETCH_CALLSHEET_DATES_SUCCESS,
  data,
});

export const fetchCallsheetDatesFail = (error) => ({
  type: CONSTANTS.FETCH_CALLSHEET_DATES_FAIL,
  error,
});

export const fetchUserCallsheetsRequest = (userId, filter) => ({
  type: CONSTANTS.FETCH_USER_CALLSHEETS_REQUEST,
  userId,
  filter
});

export const fetchUserCallsheetsSuccess = (data) => ({
  type: CONSTANTS.FETCH_USER_CALLSHEETS_SUCCESS,
  data,
});

export const fetchUserCallsheetsFail = (error) => ({
  type: CONSTANTS.FETCH_USER_CALLSHEETS_FAIL,
  error,
});

export const fetchCallsheetDetailRequest = (callsheetId) => ({
  type: CONSTANTS.FETCH_CALLSHEET_DETAIL_REQUEST,
  callsheetId,
});

export const fetchCallsheetDetailSuccess = (data) => ({
  type: CONSTANTS.FETCH_CALLSHEET_DETAIL_SUCCESS,
  data,
});

export const fetchCallsheetDetailFail = (error) => ({
  type: CONSTANTS.FETCH_CALLSHEET_DETAIL_FAIL,
  error,
});

export const acceptCallsheetRequest = ({callsheetId, payload}) => ({
  type: CONSTANTS.ACCEPT_CALLSHEET_REQUEST,
  callsheetId,
  payload
});

export const acceptCallsheetSuccess = (data) => ({
  type: CONSTANTS.ACCEPT_CALLSHEET_SUCCESS,
  data,
});

export const acceptCallsheetFail = (error) => ({
  type: CONSTANTS.ACCEPT_CALLSHEET_FAIL,
  error,
});

export const setCallsheetFormAction = (data) => ({
  type: CONSTANTS.SET_CALLSHEET_FORM,
  data
});
