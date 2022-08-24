import * as CONSTANTS from './constants';

export const fetchJobPPBSettingsRequest = (jobId) => ({
  type: CONSTANTS.FETCH_JOB_PPB_SETTINGS_REQUEST,
  jobId
});

export const fetchJobPPBSettingsSuccess = (data) => ({
  type: CONSTANTS.FETCH_JOB_PPB_SETTINGS_SUCCESS,
  data,
});

export const fetchJobPPBSettingsFail = (error) => ({
  type: CONSTANTS.FETCH_JOB_PPB_SETTINGS_FAIL,
  error,
});

export const setJobPPBSettingsRequest = (jobId, settings) => ({
  type: CONSTANTS.SET_JOB_PPB_SETTINGS_REQUEST,
  jobId,
  settings
});

export const setJobPPBSettingsSuccess = (data) => ({
  type: CONSTANTS.SET_JOB_PPB_SETTINGS_SUCCESS,
  data,
});

export const setJobPPBSettingsFail = (error) => ({
  type: CONSTANTS.SET_JOB_PPB_SETTINGS_FAIL,
  error,
});

export const deleteJobPPBPageRequest = (jobId, pageKey) => ({
  type: CONSTANTS.DELETE_JOB_PPB_PAGE_REQUEST,
  jobId,
  pageKey,
});

export const deleteJobPPBPageSuccess = (data) => ({
  type: CONSTANTS.DELETE_JOB_PPB_PAGE_SUCCESS,
  data,
});

export const deleteJobPPBPageFail = (error) => ({
  type: CONSTANTS.DELETE_JOB_PPB_PAGE_FAIL,
  error,
});

export const fetchJobPPBContentRequest = (jobId) => ({
  type: CONSTANTS.FETCH_JOB_PPB_CONTENT_REQUEST,
  jobId,
});

export const fetchJobPPBContentSuccess = (data) => ({
  type: CONSTANTS.FETCH_JOB_PPB_CONTENT_SUCCESS,
  data,
});

export const fetchJobPPBContentFail = (error) => ({
  type: CONSTANTS.FETCH_JOB_PPB_CONTENT_FAIL,
  error,
});

export const updateJobPPBPageRequest = (jobId, payload) => ({
  type: CONSTANTS.UPDATE_JOB_PPB_PAGE_REQUEST,
  jobId,
  payload,
});

export const updateJobPPBPageSuccess = (data) => ({
  type: CONSTANTS.UPDATE_JOB_PPB_PAGE_SUCCESS,
  data,
});

export const updateJobPPBPageFail = (error) => ({
  type: CONSTANTS.UPDATE_JOB_PPB_PAGE_FAIL,
  error,
});

export const setJobPPBPageOrderRequest = (jobId, order) => ({
  type: CONSTANTS.SET_JOB_PPB_PAGE_ORDER_REQUEST,
  jobId,
  order
});

export const setJobPPBPageOrderSuccess = (data) => ({
  type: CONSTANTS.SET_JOB_PPB_PAGE_ORDER_SUCCESS,
  data,
});

export const setJobPPBPageOrderFail = (error) => ({
  type: CONSTANTS.SET_JOB_PPB_PAGE_ORDER_FAIL,
  error,
});

export const setJobPPBTextStyle = (style) => ({
  type: CONSTANTS.SET_JOB_PPB_TEXT_STYLE,
  style,
});

export const resetJobPPBTextStyleRequest = (jobId) => ({
  type: CONSTANTS.RESET_JOB_PPB_TEXT_STYLE_REQUEST,
  jobId
});

export const resetJobPPBTextStyleSuccess = (data) => ({
  type: CONSTANTS.RESET_JOB_PPB_TEXT_STYLE_SUCCESS,
  data,
});

export const resetJobPPBTextStyleFail = (error) => ({
  type: CONSTANTS.RESET_JOB_PPB_TEXT_STYLE_FAIL,
  error,
});

export const updateJobPPBWatermarkRequest = (jobId, payload) => ({
  type: CONSTANTS.UPDATE_JOB_PPB_WATERMARK_REQUEST,
  jobId,
  payload,
});

export const updateJobPPBWatermarkSuccess = (data) => ({
  type: CONSTANTS.UPDATE_JOB_PPB_WATERMARK_SUCCESS,
  data,
});

export const updateJobPPBWatermarkFail = (error) => ({
  type: CONSTANTS.UPDATE_JOB_PPB_WATERMARK_FAIL,
  error,
});
