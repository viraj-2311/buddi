import produce from 'immer';
import * as CONSTANTS from './constants';

const initState = {
  events: [],
  loading: false,
  error: null
};

const jobEventReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FETCH_JOB_EVENTS_SUCCESS:
        draft.events = action.data;
        break;
      case CONSTANTS.CREATE_JOB_EVENT_REQUEST:
        draft.loading = true;
        draft.error = null;
        break;
      case CONSTANTS.CREATE_JOB_EVENT_SUCCESS:
        draft.loading = false;
        draft.error = null;
        draft.events = [...draft.events, action.data];
        break;
      case CONSTANTS.CREATE_JOB_EVENT_FAIL:
        draft.loading = false;
        draft.error = action.error;
        break;
      case CONSTANTS.UPDATE_EVENT_REQUEST:
        draft.loading = true;
        draft.error = null;
        break;
      case CONSTANTS.UPDATE_EVENT_SUCCESS:
        draft.loading = false;
        draft.error = null;
        draft.events = draft.events.map(event => {
          if (event.id === action.data.id) return action.data;
          return event;
        });
        break;
      case CONSTANTS.UPDATE_EVENT_FAIL:
        draft.loading = false;
        draft.error = action.error;
        break;
      case CONSTANTS.DELETE_EVENT_REQUEST:
        draft.loading = true;
        draft.error = null;
        break;
      case CONSTANTS.DELETE_EVENT_SUCCESS:
        draft.events = draft.events.filter(event => event.id !== action.eventId);
        draft.loading = false;
        draft.error = null;
        break;
      case CONSTANTS.DELETE_EVENT_FAIL:
        draft.loading = false;
        draft.error = action.error;
        break;
      default:
        return state;
    }
  });

export default jobEventReducer;
