import * as CONSTANTS from './constants';

export const fetchJobAgencyRequest = (jobId) => ({
  type: CONSTANTS.FETCH_JOB_AGENCY_REQUEST,
  jobId,
});

export const fetchJobAgencySuccess = (data) => ({
  type: CONSTANTS.FETCH_JOB_AGENCY_SUCCESS,
  data,
});

export const fetchJobAgencyFail = (error) => ({
  type: CONSTANTS.FETCH_JOB_AGENCY_FAIL,
  error,
});

export const createJobAgencyRequest = ({jobId, payload}) => ({
  type: CONSTANTS.CREATE_JOB_AGENCY_REQUEST,
  jobId,
  payload
});

export const createJobAgencySuccess = (data) => ({
  type: CONSTANTS.CREATE_JOB_AGENCY_SUCCESS,
  data,
});

export const createJobAgencyFail = (error) => ({
  type: CONSTANTS.CREATE_JOB_AGENCY_FAIL,
  error,
});

export const updateJobAgencyRequest = ({agencyId, payload}) => ({
  type: CONSTANTS.UPDATE_JOB_AGENCY_REQUEST,
  agencyId,
  payload
});

export const updateJobAgencySuccess = (data) => ({
  type: CONSTANTS.UPDATE_JOB_AGENCY_SUCCESS,
  data,
});

export const updateJobAgencyFail = (error) => ({
  type: CONSTANTS.UPDATE_JOB_AGENCY_FAIL,
  error,
});
