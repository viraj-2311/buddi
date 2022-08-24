import * as CONSTANTS from './constants';

export const fetchJobClientRequest = (jobId) => ({
  type: CONSTANTS.FETCH_JOB_CLIENT_REQUEST,
  jobId,
});

export const fetchJobClientSuccess = (data) => ({
  type: CONSTANTS.FETCH_JOB_CLIENT_SUCCESS,
  data,
});

export const fetchJobClientFail = (error) => ({
  type: CONSTANTS.FETCH_JOB_CLIENT_FAIL,
  error,
});

export const createJobClientRequest = ({jobId, payload}) => ({
  type: CONSTANTS.CREATE_JOB_CLIENT_REQUEST,
  jobId,
  payload
});

export const createJobClientSuccess = (data) => ({
  type: CONSTANTS.CREATE_JOB_CLIENT_SUCCESS,
  data,
});

export const createJobClientFail = (error) => ({
  type: CONSTANTS.CREATE_JOB_CLIENT_FAIL,
  error,
});

export const updateJobClientRequest = ({clientId, payload}) => ({
  type: CONSTANTS.UPDATE_JOB_CLIENT_REQUEST,
  clientId,
  payload
});

export const updateJobClientSuccess = (data) => ({
  type: CONSTANTS.UPDATE_JOB_CLIENT_SUCCESS,
  data,
});

export const updateJobClientFail = (error) => ({
  type: CONSTANTS.UPDATE_JOB_CLIENT_FAIL,
  error,
});
