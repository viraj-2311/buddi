import * as CONSTANTS from './constants';

export const setContractorCalendarView = (view) => ({
  type: CONSTANTS.SET_CONTRACTOR_CALENDAR_VIEW,
  view
});

export const setContractorCalendarDate = (date) => ({
  type: CONSTANTS.SET_CONTRACTOR_CALENDAR_DATE,
  date
});

export const fetchContractorEventNotesRequest = ({userId, filter}) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_EVENT_NOTE_REQUEST,
  userId,
  filter
});

export const fetchContractorEventNotesSuccess = (data) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_EVENT_NOTE_SUCCESS,
  data,
});

export const fetchContractorEventNotesFail = (error) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_EVENT_NOTE_FAIL,
  error,
});

export const fetchContractorShootNotesRequest = ({userId, filter}) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_SHOOT_NOTE_REQUEST,
  userId,
  filter
});

export const fetchContractorShootNotesSuccess = (data) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_SHOOT_NOTE_SUCCESS,
  data,
});

export const fetchContractorShootNotesFail = (error) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_SHOOT_NOTE_FAIL,
  error,
});

export const fetchContractorHoldMemosRequest = ({userId, filter}) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_HOLD_MEMO_REQUEST,
  userId,
  filter
});

export const fetchContractorHoldMemosSuccess = (data) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_HOLD_MEMO_SUCCESS,
  data,
});

export const fetchContractorHoldMemosFail = (error) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_HOLD_MEMO_FAIL,
  error,
});
