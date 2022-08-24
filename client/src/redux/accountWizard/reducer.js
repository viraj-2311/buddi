import produce from 'immer';
import * as CONSTANTS from './constants';

const initialState = {
  accountType: null,
  step: 0,
  completedLastStep: 0,
  company: null,
  wizard: {
    loading: false,
    error: null,
  },
  complete: {
    loading: false,
    error: null,
    data: false,
  },
};

const accountWizardReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.SET_WIZARD_ACCOUNT_TYPE:
        draft.accountType = action.accountType;
        break;

      case CONSTANTS.NEXT_WIZARD_STEP:
        draft.step += 1;
        if (draft.step > draft.completedLastStep) {
          draft.completedLastStep = draft.step;
        }
        break;

      case CONSTANTS.PREV_WIZARD_STEP:
        draft.step -= 1;
        break;

      case CONSTANTS.SET_WIZARD_STEP:
        draft.step = action.step;
        break;

      case CONSTANTS.SET_WIZARD_COMPLETED_LAST_WIZARD_STEP:
        draft.completedLastStep = action.step;
        break;

      case CONSTANTS.UPDATE_WIZARD_USER_REQUEST:
        draft.wizard = { loading: true, error: null };
        break;
      case CONSTANTS.UPDATE_WIZARD_USER_SUCCESS:
        draft.wizard = { loading: false, error: null };
        break;
      case CONSTANTS.UPDATE_WIZARD_USER_FAIL:
        draft.wizard = { loading: false, error: action.error };
        break;

      case CONSTANTS.UPDATE_WIZARD_PRODUCER_REQUEST:
        draft.wizard = { loading: true, error: null };
        break;
      case CONSTANTS.UPDATE_WIZARD_PRODUCER_SUCCESS:
        draft.wizard = { loading: false, error: null };
        break;
      case CONSTANTS.UPDATE_WIZARD_PRODUCER_FAIL:
        draft.wizard = { loading: false, error: action.error };
        break;

      case CONSTANTS.FETCH_WIZARD_COMPANY_DETAIL_BY_EMAIL_REQUEST:
        draft.company = action.data;
        draft.wizard = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_WIZARD_COMPANY_DETAIL_BY_EMAIL_SUCCESS:
        draft.company = action.data;
        draft.wizard = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_WIZARD_COMPANY_DETAIL_BY_EMAIL_FAIL:
        draft.wizard = { loading: false, error: action.error };
        break;

      case CONSTANTS.CREATE_WIZARD_COMPANY_REQUEST:
        draft.wizard = { loading: true, error: null };
        break;
      case CONSTANTS.CREATE_WIZARD_COMPANY_SUCCESS:
        draft.company = action.data;
        draft.wizard = { loading: false, error: null };
        break;
      case CONSTANTS.CREATE_WIZARD_COMPANY_FAIL:
        draft.wizard = { loading: false, error: action.error };
        break;

      case CONSTANTS.UPDATE_WIZARD_COMPANY_REQUEST:
        draft.wizard = { loading: true, error: null };
        break;
      case CONSTANTS.UPDATE_WIZARD_COMPANY_SUCCESS:
        draft.company = action.data;
        draft.wizard = { loading: false, error: null };
        break;
      case CONSTANTS.UPDATE_WIZARD_COMPANY_FAIL:
        draft.wizard = { loading: false, error: action.error };
        break;

      case CONSTANTS.COMPLETE_WIZARD_REQUEST:
        draft.complete = { loading: true, error: null, data: false };
        break;
      case CONSTANTS.COMPLETE_WIZARD_SUCCESS:
        draft.step = 0;
        draft.completedLastStep = 0;
        draft.complete = { loading: false, error: null, data: true };
        break;
      case CONSTANTS.COMPLETE_WIZARD_FAIL:
        draft.complete = { loading: false, error: action.error, data: false };
        break;

      default:
        break;
    }
  });

export default accountWizardReducer;
