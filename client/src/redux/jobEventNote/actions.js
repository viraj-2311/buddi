import * as CONSTANTS from './constants';

export const fetchJobEventNoteGroupsRequest = (jobId) => ({
  type: CONSTANTS.FETCH_JOB_EVENT_NOTE_GROUPS_REQUEST,
  jobId,
});

export const fetchJobEventNoteGroupsSuccess = (data) => ({
  type: CONSTANTS.FETCH_JOB_EVENT_NOTE_GROUPS_SUCCESS,
  data,
});

export const fetchJobEventNoteGroupsFail = (error) => ({
  type: CONSTANTS.FETCH_JOB_EVENT_NOTE_GROUPS_FAIL,
  error,
});

export const fetchJobEventNotesRequest = ({jobId, filter}) => ({
  type: CONSTANTS.FETCH_JOB_EVENT_NOTES_REQUEST,
  jobId,
  filter
});

export const fetchJobEventNotesSuccess = (data) => ({
  type: CONSTANTS.FETCH_JOB_EVENT_NOTES_SUCCESS,
  data,
});

export const fetchJobEventNotesFail = (error) => ({
  type: CONSTANTS.FETCH_JOB_EVENT_NOTES_FAIL,
  error,
});

export const createJobEventNoteRequest = ({jobId, payload}) => ({
  type: CONSTANTS.CREATE_JOB_EVENT_NOTE_REQUEST,
  jobId,
  payload
});

export const createJobEventNoteSuccess = (data) => ({
  type: CONSTANTS.CREATE_JOB_EVENT_NOTE_SUCCESS,
  data,
});

export const createJobEventNoteFail = (error) => ({
  type: CONSTANTS.CREATE_JOB_EVENT_NOTE_FAIL,
  error,
});

export const updateEventNoteRequest = ({noteId, payload}) => ({
  type: CONSTANTS.UPDATE_EVENT_NOTE_REQUEST,
  noteId,
  payload
});

export const updateEventNoteSuccess = (data) => ({
  type: CONSTANTS.UPDATE_EVENT_NOTE_SUCCESS,
  data,
});

export const updateEventNoteFail = (error) => ({
  type: CONSTANTS.UPDATE_EVENT_NOTE_FAIL,
  error,
});

export const deleteEventNoteRequest = (noteId) => ({
  type: CONSTANTS.DELETE_EVENT_NOTE_REQUEST,
  noteId
});

export const deleteEventNoteSuccess = (noteId) => ({
  type: CONSTANTS.DELETE_EVENT_NOTE_SUCCESS,
  noteId,
});

export const deleteEventNoteFail = (error) => ({
  type: CONSTANTS.DELETE_EVENT_NOTE_FAIL,
  error,
});

export const addEventCrewRequest = (jobId, eventId, payload) => ({
  type: CONSTANTS.ADD_EVENT_CREW_REQUEST,
  jobId,
  eventId,
  payload
});

export const addEventCrewSuccess = (data) => ({
  type: CONSTANTS.ADD_EVENT_CREW_SUCCESS,
  data
});

export const addEventCrewFail = (error) => ({
  type: CONSTANTS.ADD_EVENT_CREW_FAIL,
  error,
});


export const deleteEventNoteImageRequest = (noteId, imageIndex) => ({
  type: CONSTANTS.DELETE_EVENT_NOTE_IMAGE_REQUEST,
  noteId,
  imageIndex
});

export const deleteEventNoteImageSuccess = (noteId) => ({
  type: CONSTANTS.DELETE_EVENT_NOTE_IMAGE_SUCCESS,
  noteId,
});

export const deleteEventNoteImageFail = (error) => ({
  type: CONSTANTS.DELETE_EVENT_NOTE_IMAGE_FAIL,
  error,
});
