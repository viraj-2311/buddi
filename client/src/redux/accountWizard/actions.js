import * as CONSTANTS from './constants';

export const setWizardAccountType = (accountType) => ({
  type: CONSTANTS.SET_WIZARD_ACCOUNT_TYPE,
  accountType
});


export const nextWizardStep = () => ({
  type: CONSTANTS.NEXT_WIZARD_STEP,
});

export const prevWizardStep = () => ({
  type: CONSTANTS.PREV_WIZARD_STEP
});

export const setWizardStep = (step) => ({
  type: CONSTANTS.SET_WIZARD_STEP,
  step
});

export const setCompletedLastWizardStep = (step) => ({
  type: CONSTANTS.SET_WIZARD_COMPLETED_LAST_WIZARD_STEP,
  step
});

export const updateWizardUserRequest = (userId, payload) => ({
  type: CONSTANTS.UPDATE_WIZARD_USER_REQUEST,
  userId,
  payload
});

export const updateWizardUserSuccess = (data) => ({
  type: CONSTANTS.UPDATE_WIZARD_USER_SUCCESS,
  data
});

export const updateWizardUserFail = (error) => ({
  type: CONSTANTS.UPDATE_WIZARD_USER_FAIL,
  error,
});

export const updateWizardProducerRequest = (userId, payload) => ({
  type: CONSTANTS.UPDATE_WIZARD_PRODUCER_REQUEST,
  userId,
  payload
});

export const updateWizardProducerSuccess = (data) => ({
  type: CONSTANTS.UPDATE_WIZARD_PRODUCER_SUCCESS,
  data
});

export const updateWizardProducerFail = (error) => ({
  type: CONSTANTS.UPDATE_WIZARD_PRODUCER_FAIL,
  error,
});

export const fetchCompanyDetailByEmailRequest = (email) => ({
  type: CONSTANTS.FETCH_WIZARD_COMPANY_DETAIL_BY_EMAIL_REQUEST,
  email
});

export const fetchCompanyDetailByEmailSuccess = (data) => ({
  type: CONSTANTS.FETCH_WIZARD_COMPANY_DETAIL_BY_EMAIL_SUCCESS,
  data
});

export const fetchCompanyDetailByEmailFail = (error) => ({
  type: CONSTANTS.FETCH_WIZARD_COMPANY_DETAIL_BY_EMAIL_FAIL,
  error
});

export const createWizardCompanyRequest = (payload) => ({
  type: CONSTANTS.CREATE_WIZARD_COMPANY_REQUEST,
  payload
});

export const createWizardCompanySuccess = (data) => ({
  type: CONSTANTS.CREATE_WIZARD_COMPANY_SUCCESS,
  data
});

export const createWizardCompanyFail = (error) => ({
  type: CONSTANTS.CREATE_WIZARD_COMPANY_FAIL,
  error
});

export const updateWizardCompanyRequest = (id, payload) => ({
  type: CONSTANTS.UPDATE_WIZARD_COMPANY_REQUEST,
  id,
  payload
});

export const updateWizardCompanySuccess = (data) => ({
  type: CONSTANTS.UPDATE_WIZARD_COMPANY_SUCCESS,
  data
});

export const updateWizardCompanyFail = (error) => ({
  type: CONSTANTS.UPDATE_WIZARD_COMPANY_FAIL,
  error
});

export const completeWizardRequest = (userId, accountType) => ({
  type: CONSTANTS.COMPLETE_WIZARD_REQUEST,
  userId,
  accountType
}); 

export const completeWizardSuccess = (data) => ({
  type: CONSTANTS.COMPLETE_WIZARD_SUCCESS,
  data
});

export const completeWizardFail = (error) => ({
  type: CONSTANTS.COMPLETE_WIZARD_FAIL,
  error
});

