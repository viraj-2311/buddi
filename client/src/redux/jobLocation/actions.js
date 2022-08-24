import * as CONSTANTS from './constants';

export const fetchJobLocationsRequest = (jobId) => ({
  type: CONSTANTS.FETCH_JOB_LOCATIONS_REQUEST,
  jobId
});

export const fetchJobLocationsSuccess = (data) => ({
  type: CONSTANTS.FETCH_JOB_LOCATIONS_SUCCESS,
  data,
});

export const fetchJobLocationsFail = (error) => ({
  type: CONSTANTS.FETCH_JOB_LOCATIONS_FAIL,
  error,
});

export const createJobLocationRequest = ({jobId, payload}) => ({
  type: CONSTANTS.CREATE_JOB_LOCATION_REQUEST,
  jobId,
  payload
});

export const createJobLocationSuccess = (data) => ({
  type: CONSTANTS.CREATE_JOB_LOCATION_SUCCESS,
  data,
});

export const createJobLocationFail = (error) => ({
  type: CONSTANTS.CREATE_JOB_LOCATION_FAIL,
  error,
});

export const updateJobLocationRequest = ({locationId, payload}) => ({
  type: CONSTANTS.UPDATE_JOB_LOCATION_REQUEST,
  locationId,
  payload
});

export const updateJobLocationSuccess = (data) => ({
  type: CONSTANTS.UPDATE_JOB_LOCATION_SUCCESS,
  data,
});

export const updateJobLocationFail = (error) => ({
  type: CONSTANTS.UPDATE_JOB_LOCATION_FAIL,
  error,
});

export const deleteJobLocationRequest = (locationId) => ({
  type: CONSTANTS.DELETE_JOB_LOCATION_REQUEST,
  locationId
});

export const deleteJobLocationSuccess = (data) => ({
  type: CONSTANTS.DELETE_JOB_LOCATION_SUCCESS,
  data,
});

export const deleteJobLocationFail = (error) => ({
  type: CONSTANTS.DELETE_JOB_LOCATION_FAIL,
  error,
});
