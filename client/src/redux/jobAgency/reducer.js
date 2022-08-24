import produce from 'immer';
import * as CONSTANTS from './constants';

const initState = {
  agency: null,
  create: {
    loading: false,
    error: null,
  },
  update: {
    loading: false,
    error: null
  }
};

const jobAgencyReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FETCH_JOB_AGENCY_SUCCESS:
        draft.agency = action.data;
        break;

      case CONSTANTS.CREATE_JOB_AGENCY_REQUEST:
        draft.create = {loading: true, error: null};
        break;
      case CONSTANTS.CREATE_JOB_AGENCY_SUCCESS:
        draft.agency = action.data;
        draft.create = {loading: false, error: null};
        break;
      case CONSTANTS.CREATE_JOB_AGENCY_FAIL:
        draft.create = {loading: false, error: action.error};
        break;

      case CONSTANTS.UPDATE_JOB_AGENCY_REQUEST:
        draft.update = {loading: true, error: null};
        break;
      case CONSTANTS.UPDATE_JOB_AGENCY_SUCCESS:
        draft.agency = action.data;
        draft.update = {loading: false, error: null};
        break;
      case CONSTANTS.UPDATE_JOB_AGENCY_FAIL:
        draft.update = {loading: false, error: action.error};
        break;

      default:
        return state;
    }
  });

export default jobAgencyReducer;
