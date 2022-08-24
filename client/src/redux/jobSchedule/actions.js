import * as CONSTANTS from './constants';

export const setCalendarView = (view) => ({
  type: CONSTANTS.SET_CALENDAR_VIEW,
  view
});

export const setScheduleView = (view) => ({
  type: CONSTANTS.SET_SCHEDULE_VIEW,
  view
});

export const setCalendarDate = (date) => ({
  type: CONSTANTS.SET_CALENDAR_DATE,
  date
});

export const setScheduleFilter = (filter) => ({
  type: CONSTANTS.SET_SCHEDULE_FILTER,
  filter
});
