import produce from 'immer';
import * as CONSTANTS from './constants';

const initState = {
  locations: [],
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

const jobLocationReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FETCH_JOB_LOCATIONS_REQUEST:
        draft.list = {loading: true, error: null};
        break;
      case CONSTANTS.FETCH_JOB_LOCATIONS_SUCCESS:
        draft.locations = action.data;
        draft.list = {loading: false, error: null};
        break;
      case CONSTANTS.FETCH_JOB_LOCATIONS_FAIL:
        draft.list = {loading: false, error: action.error};
        break;

      case CONSTANTS.CREATE_JOB_LOCATION_REQUEST:
        draft.create = {loading: true, error: null};
        break;
      case CONSTANTS.CREATE_JOB_LOCATION_SUCCESS:
        draft.locations = [...draft.locations, action.data];
        draft.create = {loading: false, error: null};
        break;
      case CONSTANTS.CREATE_JOB_LOCATION_FAIL:
        draft.create = {loading: false, error: action.error};
        break;

      case CONSTANTS.UPDATE_JOB_LOCATION_REQUEST:
        draft.update = {loading: true, error: null};
        break;
      case CONSTANTS.UPDATE_JOB_LOCATION_SUCCESS:
        draft.locations = draft.locations.map(location => {
          if (location.id === action.data.id) return action.data;
          return location;
        });
        draft.update = {loading: false, error: null};
        break;
      case CONSTANTS.UPDATE_JOB_LOCATION_FAIL:
        draft.update = {loading: false, error: action.error};
        break;

      case CONSTANTS.DELETE_JOB_LOCATION_REQUEST:
        draft.delete = {loading: true, error: null};
        break;
      case CONSTANTS.DELETE_JOB_LOCATION_SUCCESS:
        draft.locations = draft.locations.filter(location => location.id !== action.data);
        draft.delete = {loading: false, error: null};
        break;
      case CONSTANTS.DELETE_JOB_LOCATION_FAIL:
        draft.delete = {loading: false, error: action.error};
        break;

      default:
        return state;
    }
  });

export default jobLocationReducer;
