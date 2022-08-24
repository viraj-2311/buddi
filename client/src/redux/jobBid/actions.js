import * as CONSTANTS from './constants';

export const fetchJobBidRequest = (jobId) => ({
  type: CONSTANTS.FETCH_JOB_BID_REQUEST,
  jobId
});

export const fetchJobBidSuccess = (data) => ({
  type: CONSTANTS.FETCH_JOB_BID_SUCCESS,
  data,
});

export const fetchJobBidFail = (error) => ({
  type: CONSTANTS.FETCH_JOB_BID_FAIL,
  error,
});

export const createJobBidRequest = ({jobId, payload}) => ({
  type: CONSTANTS.CREATE_JOB_BID_REQUEST,
  jobId,
  payload
});

export const createJobBidSuccess = (data) => ({
  type: CONSTANTS.CREATE_JOB_BID_SUCCESS,
  data,
});

export const createJobBidFail = (error) => ({
  type: CONSTANTS.CREATE_JOB_BID_FAIL,
  error,
});

export const updateJobBidRequest = ({bidId, payload}) => ({
  type: CONSTANTS.UPDATE_JOB_BID_REQUEST,
  bidId,
  payload
});

export const updateJobBidSuccess = (data) => ({
  type: CONSTANTS.UPDATE_JOB_BID_SUCCESS,
  data,
});

export const updateJobBidFail = (error) => ({
  type: CONSTANTS.UPDATE_JOB_BID_FAIL,
  error,
});

export const deleteJobBidRequest = (bidId) => ({
  type: CONSTANTS.DELETE_JOB_BID_REQUEST,
  bidId
});

export const deleteJobBidSuccess = (data) => ({
  type: CONSTANTS.DELETE_JOB_BID_SUCCESS,
  data,
});

export const deleteJobBidFail = (error) => ({
  type: CONSTANTS.DELETE_JOB_BID_FAIL,
  error,
});
