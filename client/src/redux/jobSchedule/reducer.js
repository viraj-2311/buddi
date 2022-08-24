import produce from 'immer';
import * as CONSTANTS from './constants';

const initState = {
  calendarView: 'month',
  calendarDate: new Date(),
  scheduleView: 'pre-pro',
  scheduleFilter: {
    events: null,
    shootDays: null
  }

};

const jobScheduleReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.SET_CALENDAR_VIEW:
        draft.calendarView = action.view;
        break;
      case CONSTANTS.SET_SCHEDULE_VIEW:
        draft.scheduleView = action.view;
        break;
      case CONSTANTS.SET_CALENDAR_DATE:
        draft.calendarDate = action.date;
        break;
      case CONSTANTS.SET_SCHEDULE_FILTER:
        draft.scheduleFilter = {...draft.scheduleFilter, ...action.filter};
        break;
      default:
        return state;
    }
  });

export default jobScheduleReducer;
