import produce from 'immer';
import * as CONSTANTS from './constants';

const initState = {
  scripts: [],
  list: {
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

const jobScriptReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FETCH_JOB_SCRIPTS_REQUEST:
        draft.list = {loading: true, error: null};
        break;
      case CONSTANTS.FETCH_JOB_SCRIPTS_SUCCESS:
        draft.scripts = action.data;
        draft.list = {loading: false, error: null};
        break;
      case CONSTANTS.FETCH_JOB_SCRIPTS_FAIL:
        draft.list = {loading: false, error: action.error};
        break;

      case CONSTANTS.CREATE_JOB_SCRIPT_REQUEST:
        draft.create = {loading: true, error: null};
        break;
      case CONSTANTS.CREATE_JOB_SCRIPT_SUCCESS:
        draft.scripts = [...draft.scripts, action.data];
        draft.create = {loading: false, error: null};
        break;
      case CONSTANTS.CREATE_JOB_SCRIPT_FAIL:
        draft.create = {loading: false, error: action.error};
        break;

      case CONSTANTS.UPDATE_JOB_SCRIPT_REQUEST:
        draft.update = {loading: true, error: null};
        break;
      case CONSTANTS.UPDATE_JOB_SCRIPT_SUCCESS:
        draft.scripts = draft.scripts.map(script => {
          if (script.id === action.data.id) return action.data;
          return script;
        });
        draft.update = {loading: false, error: null};
        break;
      case CONSTANTS.UPDATE_JOB_SCRIPT_FAIL:
        draft.update = {loading: false, error: action.error};
        break;

      case CONSTANTS.DELETE_JOB_SCRIPT_REQUEST:
        draft.delete = {loading: true, error: null};
        break;
      case CONSTANTS.DELETE_JOB_SCRIPT_SUCCESS:
        draft.scripts = draft.scripts.filter(script => script.id !== action.data);
        draft.delete = {loading: false, error: null};
        break;
      case CONSTANTS.DELETE_JOB_SCRIPT_FAIL:
        draft.delete = {loading: false, error: action.error};
        break;

      default:
        return state;
    }
  });

export default jobScriptReducer;
