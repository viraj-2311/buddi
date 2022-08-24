import produce from 'immer';
import * as CONSTANTS from './constants';

const initState = {
  bid: null,
  detail: {
    loading: false,
    error: null
  },
  create: {
    loading: false,
    error: null,
  },
  update: {
    loading: false,
    error: null
  },
  delete: {
    loading: false,
    error: null
  }
};

const jobBidReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FETCH_JOB_BID_REQUEST:
        draft.detail = {loading: true, error: null};
        break;
      case CONSTANTS.FETCH_JOB_BID_SUCCESS:
        draft.bid = action.data;
        draft.detail = {loading: false, error: null};
        break;
      case CONSTANTS.FETCH_JOB_BID_FAIL:
        draft.detail = {loading: false, error: action.error};
        break;

      case CONSTANTS.CREATE_JOB_BID_REQUEST:
        draft.create = {loading: true, error: null};
        break;
      case CONSTANTS.CREATE_JOB_BID_SUCCESS:
        draft.bid = action.data;
        draft.create = {loading: false, error: null};
        break;
      case CONSTANTS.CREATE_JOB_BID_FAIL:
        draft.create = {loading: false, error: action.error};
        break;

      case CONSTANTS.UPDATE_JOB_BID_REQUEST:
        draft.update = {loading: true, error: null};
        break;
      case CONSTANTS.UPDATE_JOB_BID_SUCCESS:
        draft.bid = action.data;
        draft.update = {loading: false, error: null};
        break;
      case CONSTANTS.UPDATE_JOB_BID_FAIL:
        draft.update = {loading: false, error: action.error};
        break;

      case CONSTANTS.DELETE_JOB_BID_REQUEST:
        draft.delete = {loading: true, error: null};
        break;
      case CONSTANTS.DELETE_JOB_BID_SUCCESS:
        draft.bid = null;
        draft.delete = {loading: false, error: null};
        break;
      case CONSTANTS.DELETE_JOB_BID_FAIL:
        draft.delete = {loading: false, error: action.error};
        break;

      default:
        return state;
    }
  });

export default jobBidReducer;
