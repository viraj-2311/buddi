import * as CONSTANTS from './constants';

export const fetchJobDocumentsRequest = (jobId) => ({
  type: CONSTANTS.FETCH_JOB_DOCUMENTS_REQUEST,
  jobId
});

export const fetchJobDocumentsSuccess = (data) => ({
  type: CONSTANTS.FETCH_JOB_DOCUMENTS_SUCCESS,
  data,
});

export const fetchJobDocumentsFail = (error) => ({
  type: CONSTANTS.FETCH_JOB_DOCUMENTS_FAIL,
  error,
});

export const createJobDocumentRequest = ({jobId, payload}) => ({
  type: CONSTANTS.CREATE_JOB_DOCUMENT_REQUEST,
  jobId,
  payload
});

export const createJobDocumentSuccess = (data) => ({
  type: CONSTANTS.CREATE_JOB_DOCUMENT_SUCCESS,
  data,
});

export const createJobDocumentFail = (error) => ({
  type: CONSTANTS.CREATE_JOB_DOCUMENT_FAIL,
  error,
});

export const updateJobDocumentRequest = ({documentId, payload}) => ({
  type: CONSTANTS.UPDATE_JOB_DOCUMENT_REQUEST,
  documentId,
  payload
});

export const updateJobDocumentSuccess = (data) => ({
  type: CONSTANTS.UPDATE_JOB_DOCUMENT_SUCCESS,
  data,
});

export const updateJobDocumentFail = (error) => ({
  type: CONSTANTS.UPDATE_JOB_DOCUMENT_FAIL,
  error,
});

export const deleteJobDocumentRequest = (documentId) => ({
  type: CONSTANTS.DELETE_JOB_DOCUMENT_REQUEST,
  documentId
});

export const deleteJobDocumentSuccess = (data) => ({
  type: CONSTANTS.DELETE_JOB_DOCUMENT_SUCCESS,
  data,
});

export const deleteJobDocumentFail = (error) => ({
  type: CONSTANTS.DELETE_JOB_DOCUMENT_FAIL,
  error,
});
