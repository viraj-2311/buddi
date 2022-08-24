import produce from 'immer';
import * as CONSTANTS from './constants';
import * as COMMON_CONSTANTS from '../constants';

const initialState = {
  userIntroStep: {
    loading: true,
    error: null,
    success: null,
  },
  userStepIntro: {
    currentStepIntro: -1,
    latestStep: -1,
  },
  companyStepIntro: {
    currentCompanyStepIntro: -1,
    latestStep: -1,
  },
};

const userIntroReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.USER_INTRO_STEP:
        draft.userIntroStep = {
          loading: true,
          error: null,
          success: null,
        };
        break;
      case CONSTANTS.USER_INTRO_STEP_SUCCESS:
        draft.userIntroStep = {
          loading: false,
          error: null,
          success: true,
        };
        break;
      case CONSTANTS.USER_INTRO_STEP_FAIL:
        draft.userIntroStep = {
          loading: false,
          error: action.error,
          success: false,
        };
        break;

      case CONSTANTS.CURRENT_USER_INTRO_STEP:
        break;

      case CONSTANTS.CURRENT_USER_INTRO_STEP_SUCCESS:
        draft.userStepIntro = action.data;
        break;

      case CONSTANTS.CURRENT_COMPANY_INTRO_STEP:
        break;

      case CONSTANTS.CURRENT_COMPANY_INTRO_STEP_SUCCESS:
        draft.companyStepIntro = action.data;
        break;

      default:
        break;
    }
  });

export default userIntroReducer;
