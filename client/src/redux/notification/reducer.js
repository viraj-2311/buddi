import produce from 'immer';
import * as CONSTANTS from './constants';
import data from "./data";

const initialState = {
  notifications: [],
  list: {
    loading: false,
    error: null
  }
};

const notificationReducer = (state = initialState, action) =>
    produce(state, (draft) => {
      switch (action.type) {
        case CONSTANTS.DELETE_NOTIFICATION:
          draft.notifications = action.data.notifications;
          break;
        case CONSTANTS.FETCH_NOTIFICATION_REQUEST:
          draft.notifications = data;
          draft.list.error = null;
          // draft.list.loading = true;
          break;
        case CONSTANTS.FETCH_NOTIFICATION_SUCCESS:
          draft.notifications = data;
          draft.list.loading = false;
          break;
        case CONSTANTS.FETCH_NOTIFICATION_FAIL:
          draft.list.error = action.error;
          draft.list.loading = false;
          break;
        default:
          break;
      }
    });

export default notificationReducer;
