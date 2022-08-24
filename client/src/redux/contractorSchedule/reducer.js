import produce from 'immer';
import * as CONSTANTS from './constants';

const initState = {
  calendarView: 'month',
  calendarDate: new Date(),
  eventNotes: [],
  shootNotes: [],
  holdMemos: [],
  listEventNote: {
    loading: false,
    error: null,
  },
  listShootNote: {
    loading: false,
    error: null,
  },
  listHoldMemo: {
    loading: false,
    error: null,
  }
};

const contractorScheduleReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.SET_CONTRACTOR_CALENDAR_VIEW:
        draft.calendarView = action.view;
        break;
      case CONSTANTS.SET_CONTRACTOR_CALENDAR_DATE:
        draft.calendarDate = action.date;
        break;
      case CONSTANTS.FETCH_CONTRACTOR_EVENT_NOTE_REQUEST:
        draft.listEventNote = {loading: true, error: null};
        break;
      case CONSTANTS.FETCH_CONTRACTOR_EVENT_NOTE_SUCCESS:
        draft.listEventNote = {loading: false, error: null};
        draft.eventNotes = action.data;
        break;
      case CONSTANTS.FETCH_CONTRACTOR_EVENT_NOTE_FAIL:
        draft.listEventNote = {loading: false, error: action.error};
        break;
      case CONSTANTS.FETCH_CONTRACTOR_SHOOT_NOTE_REQUEST:
        draft.listShootNote = {loading: true, error: null};
        break;
      case CONSTANTS.FETCH_CONTRACTOR_SHOOT_NOTE_SUCCESS:
        draft.listShootNote = {loading: false, error: null};
        draft.shootNotes = action.data;
        break;
      case CONSTANTS.FETCH_CONTRACTOR_SHOOT_NOTE_FAIL:
        draft.listShootNote = {loading: false, error: action.error};
        break;
      case CONSTANTS.FETCH_CONTRACTOR_HOLD_MEMO_REQUEST:
        draft.listHoldMemo = {loading: true, error: null};
        break;
      case CONSTANTS.FETCH_CONTRACTOR_HOLD_MEMO_SUCCESS:
        draft.listHoldMemo = {loading: false, error: null};
        draft.holdMemos = action.data;
        break;
      case CONSTANTS.FETCH_CONTRACTOR_HOLD_MEMO_FAIL:
        draft.listHoldMemo = {loading: false, error: action.err};
        break;
      default:
        return state;
    }
  });

export default contractorScheduleReducer;
