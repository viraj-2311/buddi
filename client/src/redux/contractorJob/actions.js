import * as CONSTANTS from './constants';

export const acceptOrDeclineJobRequest = ({id, payload}) => ({
  type: CONSTANTS.ACCEPT_OR_DECLINE_JOB_REQUEST,
  id,
  payload
});

export const acceptOrDeclineJobSuccess = (data) => ({
  type: CONSTANTS.ACCEPT_OR_DECLINE_JOB_SUCCESS,
  data,
});

export const acceptOrDeclineJobFail = (error) => ({
  type: CONSTANTS.ACCEPT_OR_DECLINE_JOB_FAIL,
  error,
});

export const cancelJobRequest = ({ id, payload }) => ({
  type: CONSTANTS.CANCEL_JOB_REQUEST,
  id,
  payload,
});

export const cancelJobSuccess = (data) => ({
  type: CONSTANTS.CANCEL_JOB_SUCCESS,
  data,
});

export const cancelJobFail = (error) => ({
  type: CONSTANTS.CANCEL_JOB_FAIL,
  error,
});

export const fetchContractorJobsRequest = (contractorId, filter) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_JOBS_REQUEST,
  contractorId,
  filter
});

export const fetchContractorJobsSuccess = (data) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_JOBS_SUCCESS,
  data,
});

export const fetchContractorJobsFail = (error) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_JOBS_FAIL,
  error,
});

export const fetchContractorJobDetailRequest = (id) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_JOB_DETAIL_REQUEST,
  id,
});

export const fetchContractorJobDetailSuccess = (data) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_JOB_DETAIL_SUCCESS,
  data,
});

export const fetchContractorJobDetailFail = (error) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_JOB_DETAIL_FAIL,
  error,
});

export const updateContractorJobRequest = (jobId, payload) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_JOB_REQUEST,
  jobId,
  payload,
});

export const updateContractorJobSuccess = (data) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_JOB_SUCCESS,
  data,
});

export const updateContractorJobFail = (error) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_JOB_FAIL,
  error,
});

export const deleteBulkContractorJobRequest = (jobIds) => ({
  type: CONSTANTS.DELETE_BULK_CONTRACTOR_JOB_REQUEST,
  jobIds,
});

export const deleteBulkContractorJobSuccess = (data) => ({
  type: CONSTANTS.DELETE_BULK_CONTRACTOR_JOB_SUCCESS,
  data,
});

export const deleteBulkContractorJobFail = (error) => ({
  type: CONSTANTS.DELETE_BULK_CONTRACTOR_JOB_FAIL,
  error,
});
