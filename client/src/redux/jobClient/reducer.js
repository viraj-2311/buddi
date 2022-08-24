import produce from 'immer';
import * as CONSTANTS from './constants';

const initState = {
  client: null,
  create: {
    loading: false,
    error: null,
  },
  update: {
    loading: false,
    error: null
  }
};

const jobClientReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FETCH_JOB_CLIENT_SUCCESS:
        draft.client = action.data;
        break;

      case CONSTANTS.CREATE_JOB_CLIENT_REQUEST:
        draft.create = {loading: true, error: null};
        break;
      case CONSTANTS.CREATE_JOB_CLIENT_SUCCESS:
        draft.client = action.data;
        draft.create = {loading: false, error: null};
        break;
      case CONSTANTS.CREATE_JOB_CLIENT_FAIL:
        draft.create = {loading: false, error: action.error};
        break;

      case CONSTANTS.UPDATE_JOB_CLIENT_REQUEST:
        draft.update = {loading: true, error: null};
        break;
      case CONSTANTS.UPDATE_JOB_CLIENT_SUCCESS:
        draft.client = action.data;
        draft.update = {loading: false, error: null};
        break;
      case CONSTANTS.UPDATE_JOB_CLIENT_FAIL:
        draft.update = {loading: false, error: action.error};
        break;

      default:
        return state;
    }
  });

export default jobClientReducer;
