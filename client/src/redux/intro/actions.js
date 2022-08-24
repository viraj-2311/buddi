import * as CONSTANTS from './constants';

export const updateUserIntro = (data) => ({
  type: CONSTANTS.USER_INTRO_STEP,
  payload: data,
});

export const updateUserIntroSuccess = (data) => ({
  type: CONSTANTS.USER_INTRO_STEP_SUCCESS,
  data,
});

export const updateUserIntroFail = (error) => ({
  type: CONSTANTS.USER_INTRO_STEP_FAIL,
  error,
});

export const setUserIntroStep = (data) => ({
  type: CONSTANTS.CURRENT_USER_INTRO_STEP,
  payload: data,
});

export const updateCompanyIntro = (data) => ({
  type: CONSTANTS.COMPANY_INTRO_STEP,
  payload: data,
});

export const updateCompanyIntroSuccess = (data) => ({
  type: CONSTANTS.COMPANY_INTRO_STEP_SUCCESS,
  data,
});

export const updateCompanyIntroFail = (error) => ({
  type: CONSTANTS.COMPANY_INTRO_STEP_FAIL,
  error,
});

export const setUserIntroCurrentStepSuccess = (data) => ({
  type: CONSTANTS.CURRENT_USER_INTRO_STEP_SUCCESS,
  data,
});

export const setCompanyIntroStep = (data) => ({
  type: CONSTANTS.CURRENT_COMPANY_INTRO_STEP,
  payload: data,
});

export const setCompanyIntroCurrentStepSuccess = (data) => ({
  type: CONSTANTS.CURRENT_COMPANY_INTRO_STEP_SUCCESS,
  data,
});
