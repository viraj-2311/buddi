import produce from 'immer';
import * as CONSTANTS from './constants';

const initialState = {
  companyId: null,
  jobs: {},
  callsheets: [],
  networkInvitations: []
};

const accountBoardReducer = (state = initialState, action) =>
    produce(state, (draft) => {
      switch (action.type) {
        case CONSTANTS.SET_WORKSPACE_COMPANY:
          draft.companyId = action.id;
          break;
        case CONSTANTS.FETCH_ACCOUNT_JOBS_SUCCESS:
          draft.jobs[action.jobType] = action.data;
          break;

        case CONSTANTS.FETCH_ACCOUNT_CALLSHEETS_SUCCESS:
          draft.callsheets = action.data;
          break;

        case CONSTANTS.FETCH_ACCOUNT_NETWORK_INVITATIONS_SUCCESS:
          draft.networkInvitations = action.data;
          break;

        default:
          break;
      }
    });


export default accountBoardReducer;
