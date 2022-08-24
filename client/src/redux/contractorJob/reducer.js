import produce from 'immer';
import * as CONSTANTS from './constants';

/**
  @CAUTION need to separate the loading state unless it might cause infinite loop
 */

const initialState = {
  jobs: [],
  job: null,
  list: {
    loading: true,
    error: null
  },
  detail: {
    loading: true,
    error: null
  },
  update: {
    loading: true,
    error: null
  },
  acceptOrDecline: {
    loading: false,
    error: null
  },
  deleteBulk: {
    loading: false,
    error: null
  },
  canceljob: {
    loading: false,
    error: null
  },
};

const contractorJobReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.ACCEPT_OR_DECLINE_JOB_REQUEST:
        draft.acceptOrDecline = {loading: true, error: null};
        break;
      case CONSTANTS.ACCEPT_OR_DECLINE_JOB_SUCCESS:
        draft.acceptOrDecline = {loading: false, error: null};
        break;
      case CONSTANTS.ACCEPT_OR_DECLINE_JOB_FAIL:
        draft.acceptOrDecline = {loading: false, error: action.error};
        break;

      case CONSTANTS.FETCH_CONTRACTOR_JOBS_REQUEST:
        draft.list = {loading: true, error: null};
        break;
      case CONSTANTS.FETCH_CONTRACTOR_JOBS_SUCCESS:
        draft.jobs = action.data;
        draft.list = {loading: false, error: null};
        break;
      case CONSTANTS.FETCH_CONTRACTOR_JOBS_FAIL:
        draft.list = {loading: false, error: action.error};
        break;

      case CONSTANTS.FETCH_CONTRACTOR_JOB_DETAIL_REQUEST:
        draft.detail = {loading: true, error: null};
        break;
      case CONSTANTS.FETCH_CONTRACTOR_JOB_DETAIL_SUCCESS:
        draft.job = action.data;
        draft.detail = {loading: false, error: null};
        break;
      case CONSTANTS.FETCH_CONTRACTOR_JOB_DETAIL_FAIL:
        draft.detail = {loading: false, error: action.error};
        break;

      case CONSTANTS.UPDATE_CONTRACTOR_JOB_REQUEST:
        draft.update = {loading: true, error: null};
        break;
      case CONSTANTS.UPDATE_CONTRACTOR_JOB_SUCCESS:
        draft.job = action.data;
        draft.jobs = draft.jobs.map(job => job.id === action.data.id ? action.data : job)
        draft.update = {loading: false, error: null};
        break;
      case CONSTANTS.UPDATE_CONTRACTOR_JOB_FAIL:
        draft.update = {loading: false, error: action.error};
        break;

      case CONSTANTS.DELETE_BULK_CONTRACTOR_JOB_REQUEST:
        draft.deleteBulk = {loading: true, error: null};
        break;
      case CONSTANTS.DELETE_BULK_CONTRACTOR_JOB_SUCCESS:
        draft.jobs = draft.jobs.filter(job => !action.data.includes(job.id))
        draft.deleteBulk = {loading: false, error: null};
        break;
      case CONSTANTS.DELETE_BULK_CONTRACTOR_JOB_FAIL:
        draft.deleteBulk = {loading: false, error: action.error};
        break;

      default:
        break;
    }
  });

export default contractorJobReducer;
