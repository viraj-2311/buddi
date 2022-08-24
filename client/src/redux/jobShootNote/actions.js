import * as CONSTANTS from './constants';

export const fetchJobShootNotesRequest = ({jobId, filter}) => ({
  type: CONSTANTS.FETCH_JOB_SHOOT_NOTES_REQUEST,
  jobId,
  filter
});

export const fetchJobShootNotesSuccess = (data) => ({
  type: CONSTANTS.FETCH_JOB_SHOOT_NOTES_SUCCESS,
  data,
});

export const fetchJobShootNotesFail = (error) => ({
  type: CONSTANTS.FETCH_JOB_SHOOT_NOTES_FAIL,
  error,
});

export const createJobShootNoteRequest = ({jobId, payload}) => ({
  type: CONSTANTS.CREATE_JOB_SHOOT_NOTE_REQUEST,
  jobId,
  payload
});

export const createJobShootNoteSuccess = (data) => ({
  type: CONSTANTS.CREATE_JOB_SHOOT_NOTE_SUCCESS,
  data,
});

export const createJobShootNoteFail = (error) => ({
  type: CONSTANTS.CREATE_JOB_SHOOT_NOTE_FAIL,
  error,
});

export const updateShootNoteRequest = ({noteId, payload}) => ({
  type: CONSTANTS.UPDATE_SHOOT_NOTE_REQUEST,
  noteId,
  payload
});

export const updateShootNoteSuccess = (data) => ({
  type: CONSTANTS.UPDATE_SHOOT_NOTE_SUCCESS,
  data,
});

export const updateShootNoteFail = (error) => ({
  type: CONSTANTS.UPDATE_SHOOT_NOTE_FAIL,
  error,
});

export const deleteShootNoteRequest = (noteId) => ({
  type: CONSTANTS.DELETE_SHOOT_NOTE_REQUEST,
  noteId
});

export const deleteShootNoteSuccess = (noteId) => ({
  type: CONSTANTS.DELETE_SHOOT_NOTE_SUCCESS,
  noteId,
});

export const deleteShootNoteFail = (error) => ({
  type: CONSTANTS.DELETE_SHOOT_NOTE_FAIL,
  error,
});

export const deleteShootNoteImageRequest = (noteId, imageIndex) => ({
  type: CONSTANTS.DELETE_SHOOT_NOTE_IMAGE_REQUEST,
  noteId,
  imageIndex
});

export const deleteShootNoteImageSuccess = (noteId) => ({
  type: CONSTANTS.DELETE_SHOOT_NOTE_IMAGE_SUCCESS,
  noteId,
});

export const deleteShootNoteImageFail = (error) => ({
  type: CONSTANTS.DELETE_SHOOT_NOTE_IMAGE_FAIL,
  error,
});

