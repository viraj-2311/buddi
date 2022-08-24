import * as CONSTANTS from './constants';

export const fetchJobEventsRequest = (jobId) => ({
  type: CONSTANTS.FETCH_JOB_EVENTS_REQUEST,
  jobId,
});

export const fetchJobEventsSuccess = (data) => ({
  type: CONSTANTS.FETCH_JOB_EVENTS_SUCCESS,
  data,
});

export const fetchJobEventsFail = (error) => ({
  type: CONSTANTS.FETCH_JOB_EVENTS_FAIL,
  error,
});

export const createJobEventRequest = ({jobId, payload}) => ({
  type: CONSTANTS.CREATE_JOB_EVENT_REQUEST,
  jobId,
  payload
});

export const createJobEventSuccess = (data) => ({
  type: CONSTANTS.CREATE_JOB_EVENT_SUCCESS,
  data,
});

export const createJobEventFail = (error) => ({
  type: CONSTANTS.CREATE_JOB_EVENT_FAIL,
  error,
});

export const updateEventRequest = ({eventId, payload}) => ({
  type: CONSTANTS.UPDATE_EVENT_REQUEST,
  eventId,
  payload
});

export const updateEventSuccess = (data) => ({
  type: CONSTANTS.UPDATE_EVENT_SUCCESS,
  data,
});

export const updateEventFail = (error) => ({
  type: CONSTANTS.UPDATE_EVENT_FAIL,
  error,
});

export const deleteEventRequest = (eventId) => ({
  type: CONSTANTS.DELETE_EVENT_REQUEST,
  eventId
});

export const deleteEventSuccess = (eventId) => ({
  type: CONSTANTS.DELETE_EVENT_SUCCESS,
  eventId,
});

export const deleteEventFail = (error) => ({
  type: CONSTANTS.DELETE_EVENT_FAIL,
  error,
});

