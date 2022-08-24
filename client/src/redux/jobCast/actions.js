import * as CONSTANTS from './constants';

export const fetchJobCastsRequest = (jobId) => ({
  type: CONSTANTS.FETCH_JOB_CASTS_REQUEST,
  jobId
});

export const fetchJobCastsSuccess = (data) => ({
  type: CONSTANTS.FETCH_JOB_CASTS_SUCCESS,
  data,
});

export const fetchJobCastsFail = (error) => ({
  type: CONSTANTS.FETCH_JOB_CASTS_FAIL,
  error,
});

export const createJobCastRequest = ({jobId, payload}) => ({
  type: CONSTANTS.CREATE_JOB_CAST_REQUEST,
  jobId,
  payload
});

export const createJobCastSuccess = (data) => ({
  type: CONSTANTS.CREATE_JOB_CAST_SUCCESS,
  data,
});

export const createJobCastFail = (error) => ({
  type: CONSTANTS.CREATE_JOB_CAST_FAIL,
  error,
});

export const updateJobCastRequest = ({castId, payload}) => ({
  type: CONSTANTS.UPDATE_JOB_CAST_REQUEST,
  castId,
  payload
});

export const updateJobCastSuccess = (data) => ({
  type: CONSTANTS.UPDATE_JOB_CAST_SUCCESS,
  data,
});

export const updateJobCastFail = (error) => ({
  type: CONSTANTS.UPDATE_JOB_CAST_FAIL,
  error,
});

export const deleteJobCastRequest = (castId) => ({
  type: CONSTANTS.DELETE_JOB_CAST_REQUEST,
  castId
});

export const deleteJobCastSuccess = (data) => ({
  type: CONSTANTS.DELETE_JOB_CAST_SUCCESS,
  data,
});

export const deleteJobCastFail = (error) => ({
  type: CONSTANTS.DELETE_JOB_CAST_FAIL,
  error,
});

export const createCastWardrobeRequest = (castId, payload) => ({
  type: CONSTANTS.CREATE_CAST_WARDROBE_REQUEST,
  castId,
  payload
});

export const createCastWardrobeSuccess = (castId, data) => ({
  type: CONSTANTS.CREATE_CAST_WARDROBE_SUCCESS,
  castId,
  wardrobe: data,
});

export const createCastWardrobeFail = (error) => ({
  type: CONSTANTS.CREATE_CAST_WARDROBE_FAIL,
  error,
});

export const updateCastWardrobeRequest = (castId, wardrobeId, payload) => ({
  type: CONSTANTS.UPDATE_CAST_WARDROBE_REQUEST,
  castId,
  wardrobeId,
  payload
});

export const updateCastWardrobeSuccess = (castId, data) => ({
  type: CONSTANTS.UPDATE_CAST_WARDROBE_SUCCESS,
  castId,
  wardrobe: data,
});

export const updateCastWardrobeFail = (error) => ({
  type: CONSTANTS.UPDATE_CAST_WARDROBE_FAIL,
  error,
});

export const deleteCastWardrobeRequest = (castId, wardrobeId) => ({
  type: CONSTANTS.DELETE_CAST_WARDROBE_REQUEST,
  castId,
  wardrobeId
});

export const deleteWardrobeSuccess = (castId, wardrobeId) => ({
  type: CONSTANTS.DELETE_CAST_WARDROBE_SUCCESS,
  castId,
  wardrobeId,
});

export const deleteCastWardrobeFail = (error) => ({
  type: CONSTANTS.DELETE_CAST_WARDROBE_FAIL,
  error,
});

