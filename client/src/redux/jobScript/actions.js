import * as CONSTANTS from './constants';

export const fetchJobScriptsRequest = (jobId) => ({
  type: CONSTANTS.FETCH_JOB_SCRIPTS_REQUEST,
  jobId
});

export const fetchJobScriptsSuccess = (data) => ({
  type: CONSTANTS.FETCH_JOB_SCRIPTS_SUCCESS,
  data,
});

export const fetchJobScriptsFail = (error) => ({
  type: CONSTANTS.FETCH_JOB_SCRIPTS_FAIL,
  error,
});

export const createJobScriptRequest = ({jobId, payload}) => ({
  type: CONSTANTS.CREATE_JOB_SCRIPT_REQUEST,
  jobId,
  payload
});

export const createJobScriptSuccess = (data) => ({
  type: CONSTANTS.CREATE_JOB_SCRIPT_SUCCESS,
  data,
});

export const createJobScriptFail = (error) => ({
  type: CONSTANTS.CREATE_JOB_SCRIPT_FAIL,
  error,
});

export const updateJobScriptRequest = ({scriptId, payload}) => ({
  type: CONSTANTS.UPDATE_JOB_SCRIPT_REQUEST,
  scriptId,
  payload
});

export const updateJobScriptSuccess = (data) => ({
  type: CONSTANTS.UPDATE_JOB_SCRIPT_SUCCESS,
  data,
});

export const updateJobScriptFail = (error) => ({
  type: CONSTANTS.UPDATE_JOB_SCRIPT_FAIL,
  error,
});

export const deleteJobScriptRequest = (scriptId) => ({
  type: CONSTANTS.DELETE_JOB_SCRIPT_REQUEST,
  scriptId
});

export const deleteJobScriptSuccess = (data) => ({
  type: CONSTANTS.DELETE_JOB_SCRIPT_SUCCESS,
  data,
});

export const deleteJobScriptFail = (error) => ({
  type: CONSTANTS.DELETE_JOB_SCRIPT_FAIL,
  error,
});
