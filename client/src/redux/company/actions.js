import * as CONSTANTS from './constants';

export const fetchCompaniesRequest = () => ({
  type: CONSTANTS.FETCH_COMPANIES_REQUEST,
});

export const fetchCompaniesSuccess = (companies) => ({
  type: CONSTANTS.FETCH_COMPANIES_SUCCESS,
  companies,
});

export const fetchCompaniesFail = (error) => ({
  type: CONSTANTS.FETCH_COMPANIES_FAIL,
  error,
});

export const fetchCompanyDetailRequest = (id) => ({
  type: CONSTANTS.FETCH_COMPANY_DETAIL_REQUEST,
  id,
});

export const fetchCompanyDetailSuccess = (data) => ({
  type: CONSTANTS.FETCH_COMPANY_DETAIL_SUCCESS,
  data,
});

export const fetchCompanyDetailFail = (error) => ({
  type: CONSTANTS.FETCH_COMPANY_DETAIL_FAIL,
  error,
});

export const createCompanyRequest = (payload) => ({
  type: CONSTANTS.CREATE_COMPANY_REQUEST,
  payload,
});

export const createCompanySuccess = (data) => ({
  type: CONSTANTS.CREATE_COMPANY_SUCCESS,
  data,
});

export const createCompanyFail = (error) => ({
  type: CONSTANTS.CREATE_COMPANY_FAIL,
  error,
});

export const updateCompanyRequest = (id, payload) => ({
  type: CONSTANTS.UPDATE_COMPANY_REQUEST,
  id,
  payload,
});

export const updateCompanySuccess = (data) => ({
  type: CONSTANTS.UPDATE_COMPANY_SUCCESS,
  data,
});

export const updateCompanyFail = (error) => ({
  type: CONSTANTS.UPDATE_COMPANY_FAIL,
  error,
});

export const fetchCompanyProfileRequest = (id) => ({
  type: CONSTANTS.FETCH_COMPANY_PROFILE_REQUEST,
  id,
});

export const fetchCompanyProfileSuccess = (data) => ({
  type: CONSTANTS.FETCH_COMPANY_PROFILE_SUCCESS,
  data,
});

export const fetchCompanyProfileFail = (error) => ({
  type: CONSTANTS.FETCH_COMPANY_PROFILE_FAIL,
  error,
});

export const updateCompanyProfileRequest = (id, payload) => ({
  type: CONSTANTS.UPDATE_COMPANY_PROFILE_REQUEST,
  id,
  payload,
});

export const updateCompanyProfileSuccess = (data) => ({
  type: CONSTANTS.UPDATE_COMPANY_PROFILE_SUCCESS,
  data,
});

export const updateCompanyProfileFail = (error) => ({
  type: CONSTANTS.UPDATE_COMPANY_PROFILE_FAIL,
  error,
});

export const acceptCompanyPermissionByOwnerRequest = (token) => ({
  type: CONSTANTS.ACCEPT_COMPANY_PERMISSION_BY_OWNER_REQUEST,
  token,
});

export const acceptCompanyPermissionByOwnerSuccess = () => ({
  type: CONSTANTS.ACCEPT_COMPANY_PERMISSION_BY_OWNER_SUCCESS,
});

export const acceptCompanyPermissionByOwnerFail = (error) => ({
  type: CONSTANTS.ACCEPT_COMPANY_PERMISSION_BY_OWNER_FAIL,
  error,
});

export const declineCompanyPermissionByOwnerRequest = (token) => ({
  type: CONSTANTS.DECLINE_COMPANY_PERMISSION_BY_OWNER_REQUEST,
  token,
});

export const declineCompanyPermissionByOwnerSuccess = (data) => ({
  type: CONSTANTS.DECLINE_COMPANY_PERMISSION_BY_OWNER_SUCCESS,
});

export const declineCompanyPermissionByOwnerFail = (error) => ({
  type: CONSTANTS.DECLINE_COMPANY_PERMISSION_BY_OWNER_FAIL,
  error,
});

export const fetchCompanyTypeRequest = () => ({
  type: CONSTANTS.FETCH_COMPANY_TYPE_REQUEST,
});

export const fetchCompanyTypeSuccess = (data) => ({
  type: CONSTANTS.FETCH_COMPANY_TYPE_SUCCESS,
  data,
});

export const fetchCompanyTypeFail = (error) => ({
  type: CONSTANTS.FETCH_COMPANY_TYPE_FAIL,
  error,
});

export const fetchBusinessTypeRequest = () => ({
  type: CONSTANTS.FETCH_BUSINESS_TYPE_REQUEST,
});

export const fetchBusinessTypeSuccess = (data) => ({
  type: CONSTANTS.FETCH_BUSINESS_TYPE_SUCCESS,
  data,
});

export const fetchBusinessTypeFail = (error) => ({
  type: CONSTANTS.FETCH_BUSINESS_TYPE_FAIL,
  error,
});

export const registerSilaCompany = (data) => ({
  type: CONSTANTS.REGISTER_SILA_COMPANY,
  payload: data,
});

export const registerSilaCompanySuccess = (data) => ({
  type: CONSTANTS.REGISTER_SILA_COMPANY_SUCCESS,
  data,
});

export const registerSilaCompanyFail = (error) => ({
  type: CONSTANTS.REGISTER_SILA_COMPANY_FAIL,
  error,
});

export const updateSilaCompany = (data) => ({
  type: CONSTANTS.UPDATE_SILA_COMPANY,
  payload: data,
});

export const updateSilaCompanySuccess = (data) => ({
  type: CONSTANTS.UPDATE_SILA_COMPANY_SUCCESS,
  data,
});

export const updateSilaCompanyFail = (error) => ({
  type: CONSTANTS.UPDATE_SILA_COMPANY_FAIL,
  error,
});

export const getCompanyWallet = (data) => ({
  type: CONSTANTS.GET_COMPANY_WALLET,
  payload: data,
});

export const getCompanyWalletSuccess = (data) => ({
  type: CONSTANTS.GET_COMPANY_WALLET_SUCCESS,
  data,
});

export const getCompanyWalletFail = (error) => ({
  type: CONSTANTS.GET_COMPANY_WALLET_FAIL,
  error,
});

export const getCompanySilaKYB = (data) => ({
  type: CONSTANTS.GET_COMPANY_SILA_VERIFICATION,
  payload: data,
});

export const getCompanySilaKYBSuccess = (data) => ({
  type: CONSTANTS.GET_COMPANY_SILA_VERIFICATION_SUCCESS,
  data,
});

export const getCompanySilaKYBFail = (error) => ({
  type: CONSTANTS.GET_COMPANY_SILA_VERIFICATION_FAIL,
  error,
});

export const postCompanyRequestKYB = (data) => ({
  type: CONSTANTS.POST_COMPANY_REQUEST_KYB,
  payload: data,
});

export const postCompanyRequestKYBSuccess = (data) => ({
  type: CONSTANTS.POST_COMPANY_REQUEST_KYB_SUCCESS,
  data,
});

export const postCompanyRequestKYBFail = (error) => ({
  type: CONSTANTS.POST_COMPANY_REQUEST_KYB_FAIL,
  error,
});

export const uploadKYBDocument = (formData, companyId) => ({
  type: CONSTANTS.UPLOAD_KYB_DOCUMENT_REQUEST,
  payload: {
    formData,
    companyId,
  },
});

export const uploadKYBDocumentSuccess = (data) => ({
  type: CONSTANTS.UPLOAD_KYB_DOCUMENT_SUCCESS,
  payload: data,
});

export const uploadKYBDocumentFail = (error) => ({
  type: CONSTANTS.UPLOAD_KYB_DOCUMENT_FAIL,
  error,
});

export const getPlaidLinkCompanyToken = (data) => ({
  type: CONSTANTS.GET_PLAID_LINK_COMPANY_TOKEN_REQUEST,
  payload: data,
});

export const getPlaidLinkCompanyTokenSuccess = (data) => ({
  type: CONSTANTS.GET_PLAID_LINK_COMPANY_TOKEN_SUCCESS,
  data,
});

export const getPlaidLinkCompanyAccountConnected = () => ({
  type: CONSTANTS.PLAID_LINK_COMPANY_ACCOUNT_CONNECTED,
});

export const getPlaidLinkCompanyTokenFail = (error) => ({
  type: CONSTANTS.GET_PLAID_LINK_COMPANY_TOKEN_FAIL,
  error,
});

export const getPlaidCompanyAccount = (data) => ({
  type: CONSTANTS.GET_PLAID_COMPANY_ACCOUNT_REQUEST,
  payload: data,
});

export const getPlaidCompanyAccountSuccess = (data) => ({
  type: CONSTANTS.GET_PLAID_COMPANY_ACCOUNT_SUCCESS,
  data,
});

export const getPlaidCompanyAccountFail = (error) => ({
  type: CONSTANTS.GET_PLAID_COMPANY_ACCOUNT_FAIL,
  error,
});

export const removePlaidCompanyAccount = (data) => ({
  type: CONSTANTS.REMOVE_PLAID_COMPANY_ACCOUNT,
  payload: data,
});

export const removePlaidCompanyAccountSuccess = (data) => ({
  type: CONSTANTS.REMOVE_PLAID_COMPANY_ACCOUNT_SUCCESS,
  data,
});

export const removePlaidCompanyAccountFail = (error) => ({
  type: CONSTANTS.REMOVE_PLAID_COMPANY_ACCOUNT_FAIL,
  error,
});

export const getCorporateSilaCompany = (data) => ({
  type: CONSTANTS.GET_SILA_COMPANY,
  payload: data,
});

export const getCorporateSilaCompanySuccess = (data) => ({
  type: CONSTANTS.GET_SILA_COMPANY_SUCCESS,
  data,
});

export const getCorporateSilaCompanyFail = (error) => ({
  type: CONSTANTS.GET_SILA_COMPANY_FAIL,
  error,
});

export const paidInvoicesByBankAccount = (data) => ({
  type: CONSTANTS.PAID_INVOICES_BY_BANK_ACCOUNT,
  payload: data,
});

export const paidInvoicesByBankAccountSuccess = (data) => ({
  type: CONSTANTS.PAID_INVOICES_BY_BANK_ACCOUNT_SUCCESS,
  data,
});

export const paidInvoicesByBankAccountFail = (error) => ({
  type: CONSTANTS.PAID_INVOICES_BY_BANK_ACCOUNT_FAIL,
  error,
});

export const requestSignIntoCompanyRequest = (id) => ({
  type: CONSTANTS.REQUEST_SIGN_INTO_COMPANY_REQUEST,
  id,
});

export const requestSignIntoCompanySuccess = (data) => ({
  type: CONSTANTS.REQUEST_SIGN_INTO_COMPANY_SUCCESS,
  data,
});

export const requestSignIntoCompanyFail = (error) => ({
  type: CONSTANTS.REQUEST_SIGN_INTO_COMPANY_FAIL,
  error,
});


export const fetchCompanyWalletBalRequest = (companyID) => ({
  type: CONSTANTS.FETCHING_COMPANY_WALLET_BAL_REQUEST,
  companyID,
});

export const fetchCompanyWalletBalSuccess = (data) => ({
  type: CONSTANTS.FETCHING_COMPANY_WALLET_BAL_SUCCESS,
  data,
});

export const fetchCompanyWalletBalFail = (error) => ({
  type: CONSTANTS.FETCHING_COMPANY_WALLET_BAL_FAIL,
  error,
});

export const fetchedCompanyWalletBalReset = () => ({
  type: CONSTANTS.FETCHED_COMPANY_WALLET_BAL_RESET,
});

export const deleteCompanyAccountRequest = (companyID, payload) => ({
  type: CONSTANTS.DELETE_COMPANY_ACCOUNT_REQUEST,
  companyID,
  payload
});

export const deleteCompanyAccountSuccess = (data) => ({
  type: CONSTANTS.DELETE_COMPANY_ACCOUNT_SUCCESS,
  data,
});

export const deleteCompanyAccountFail = (error) => ({
  type: CONSTANTS.DELETE_COMPANY_ACCOUNT_FAIL,
  error,
});

export const deleteCompanyAccountReset = () => ({
  type: CONSTANTS.DELETE_COMPANY_ACCOUNT_RESET,
});

export const toggleWalletNotSetModal = (visible) => ({
  type: CONSTANTS.TOGGLE_WALLET_NOT_SET_MODAL,
  visible
});
