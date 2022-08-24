import * as CONSTANTS from './constants';
import * as COMMON_CONSTANTS from '../constants';

export const fetchUserSkillsRequest = () => ({
  type: CONSTANTS.FETCH_USER_SKILLS_REQUEST,
});

export const fetchUserSkillsSuccess = (data) => ({
  type: CONSTANTS.FETCH_USER_SKILLS_SUCCESS,
  data,
});

export const fetchUserSkillsFail = (error) => ({
  type: CONSTANTS.FETCH_USER_SKILLS_FAIL,
  error,
});

export const fetchUsersRequest = () => ({
  type: CONSTANTS.FETCH_USERS_REQUEST,
});

export const fetchUsersSuccess = (users) => ({
  type: CONSTANTS.FETCH_USERS_SUCCESS,
  users,
});

export const fetchUsersFail = (error) => ({
  type: CONSTANTS.FETCH_USERS_FAIL,
  error,
});

export const fetchUserDetailRequest = (id) => ({
  type: CONSTANTS.FETCH_USER_DETAIL_REQUEST,
  id,
});

export const fetchUserDetailSuccess = (user) => ({
  type: CONSTANTS.FETCH_USER_DETAIL_SUCCESS,
  user,
});

export const fetchUserDetailFail = (error) => ({
  type: CONSTANTS.FETCH_USER_DETAIL_FAIL,
  error,
});

export const updateUserRequest = (id, data) => ({
  type: CONSTANTS.UPDATE_USER_REQUEST,
  id,
  payload: data,
});

export const updateUserSuccess = (user) => ({
  type: CONSTANTS.UPDATE_USER_SUCCESS,
  user,
});

export const updateUserFail = (error) => ({
  type: CONSTANTS.UPDATE_USER_FAIL,
  error,
});

export const updateUserReset = (error) => ({
  type: CONSTANTS.UPDATE_USER_RESET,
  error,
});

export const updateUserExpertiseRequest = (id, payload) => ({
  type: CONSTANTS.UPDATE_USER_EXPERTISE_REQUEST,
  id,
  payload,
});

export const updateUserExpertiseSuccess = (data) => ({
  type: CONSTANTS.UPDATE_USER_EXPERTISE_SUCCESS,
  data,
});

export const updateUserExpertiseFail = (error) => ({
  type: CONSTANTS.UPDATE_USER_EXPERTISE_FAIL,
  error,
});

export const changePasswordRequest = (data) => ({
  type: CONSTANTS.CHANGE_PASSWORD_REQUEST,
  payload: data,
});

export const changePasswordSuccess = (user) => ({
  type: CONSTANTS.CHANGE_PASSWORD_SUCCESS,
});

export const changePasswordFail = (error) => ({
  type: CONSTANTS.CHANGE_PASSWORD_FAIL,
  error,
});

export const inviteStaffRequest = (data) => ({
  type: CONSTANTS.INVITE_STAFF_REQUEST,
  payload: data,
});

export const inviteStaffSuccess = (users) => ({
  type: CONSTANTS.INVITE_STAFF_SUCCESS,
  users,
});

export const inviteStaffFail = (error) => ({
  type: CONSTANTS.INVITE_STAFF_FAIL,
  error,
});

export const fetchUserCompaniesRequest = (userId) => ({
  type: CONSTANTS.FETCH_USER_COMPANIES_REQUEST,
  userId,
});

export const fetchUserCompaniesSuccess = (data) => ({
  type: CONSTANTS.FETCH_USER_COMPANIES_SUCCESS,
  data,
});

export const fetchUserCompaniesFail = (error) => ({
  type: CONSTANTS.FETCH_USER_COMPANIES_FAIL,
  error,
});

export const fetchProducersRequest = () => ({
  type: CONSTANTS.FETCH_PRODUCERS_REQUEST,
});

export const fetchProducersSuccess = (users) => ({
  type: CONSTANTS.FETCH_PRODUCERS_SUCCESS,
  users,
});

export const fetchProducersFail = (error) => ({
  type: CONSTANTS.FETCH_PRODUCERS_FAIL,
  error,
});

export const checkSectionToRedirect = (data) => ({
  type: CONSTANTS.SECTION_TO_REDIRECT,
  data,
});

export const registerSilaUser = (data) => ({
  type: CONSTANTS.REGISTER_SILA_USER,
  payload: data,
});

export const registerSilaUserSuccess = (data) => ({
  type: CONSTANTS.REGISTER_SILA_USER_SUCCESS,
  data,
});

export const registerSilaUserFail = (error) => ({
  type: CONSTANTS.REGISTER_SILA_USER_FAIL,
  error,
});

export const updateSilaUser = (data) => ({
  type: CONSTANTS.UPDATE_SILA_USER,
  payload: data,
});

export const updateSilaUserSuccess = (data) => ({
  type: CONSTANTS.UPDATE_SILA_USER_SUCCESS,
  data,
});

export const updateSilaUserFail = (error) => ({
  type: CONSTANTS.UPDATE_SILA_USER_FAIL,
  error,
});

export const getCorporateSilaUser = (data) => ({
  type: CONSTANTS.GET_SILA_USER,
  payload: data,
});

export const getCorporateSilaUserSuccess = (data) => ({
  type: CONSTANTS.GET_SILA_USER_SUCCESS,
  data,
});

export const getCorporateSilaUserFail = (error) => ({
  type: CONSTANTS.GET_SILA_USER_FAIL,
  error,
});

export const getUserWallet = (data) => ({
  type: CONSTANTS.GET_USER_WALLET,
  payload: data,
});

export const getUserWalletSuccess = (data) => ({
  type: CONSTANTS.GET_USER_WALLET_SUCCESS,
  data,
});

export const getUserWalletFail = (error) => ({
  type: CONSTANTS.GET_USER_WALLET_FAIL,
  error,
});

export const updateContractorW9DocumentRequest = (userId, data) => ({
  type: COMMON_CONSTANTS.UPDATE_W9_DOCUMENT_REQUEST,
  userId,
  payload: data,
});

export const updateContractorW9DocumentSuccess = (data) => ({
  type: COMMON_CONSTANTS.UPDATE_W9_DOCUMENT_SUCCESS,
  data,
});

export const updateContractorW9DocumentFail = (error) => ({
  type: COMMON_CONSTANTS.UPDATE_W9_DOCUMENT_FAIL,
  error,
});

export const removeContractorW9DocumentRequest = (userId, documentId) => ({
  type: COMMON_CONSTANTS.REMOVE_W9_DOCUMENT_REQUEST,
  userId,
  documentId,
});

export const removeContractorW9DocumentSuccess = () => ({
  type: COMMON_CONSTANTS.REMOVE_W9_DOCUMENT_SUCCESS,
});

export const removeContractorW9DocumentFail = (error) => ({
  type: COMMON_CONSTANTS.REMOVE_W9_DOCUMENT_FAIL,
  error,
});

export const getUserSilaKYC = (data) => ({
  type: CONSTANTS.GET_USER_SILA_KYC,
  payload: data,
});

export const getUserSilaKYCSuccess = (data) => ({
  type: CONSTANTS.GET_USER_SILA_KYC_SUCCESS,
  data,
});

export const getUserSilaKYCFail = (error) => ({
  type: CONSTANTS.GET_USER_SILA_KYC_FAIL,
  error,
});

export const postUserRequestKYC = (data) => ({
  type: CONSTANTS.POST_USER_REQUEST_KYC,
  payload: data,
});

export const postUserRequestKYCSuccess = (data) => ({
  type: CONSTANTS.POST_USER_REQUEST_KYC_SUCCESS,
  data,
});

export const postUserRequestKYCFail = (error) => ({
  type: CONSTANTS.POST_USER_REQUEST_KYC_FAIL,
  error,
});

export const uploadKYCDocument = (formData) => ({
  type: CONSTANTS.UPLOAD_KYC_DOCUMENT_REQUEST,
  payload: {
    formData,
  },
});

export const uploadKYCDocumentSuccess = (data) => ({
  type: CONSTANTS.UPLOAD_KYC_DOCUMENT_SUCCESS,
  payload: data,
});

export const uploadKYCDocumentFail = (error) => ({
  type: CONSTANTS.UPLOAD_KYC_DOCUMENT_FAIL,
  error,
});

export const getPlaidLinkUserToken = (data) => ({
  type: CONSTANTS.GET_PLAID_LINK_TOKEN_REQUEST,
  payload: data,
});

export const getPlaidLinkUserTokenSuccess = (data) => ({
  type: CONSTANTS.GET_PLAID_LINK_TOKEN_SUCCESS,
  data,
});

export const getPlaidLinkAccountConnected = () => ({
  type: CONSTANTS.PLAID_LINK_ACCOUNT_CONNECTED,
});

export const getPlaidLinkUserTokenFail = (error) => ({
  type: CONSTANTS.GET_PLAID_LINK_TOKEN_FAIL,
  error,
});

export const getPlaidUserAccount = (data) => ({
  type: CONSTANTS.GET_PLAID_ACCOUNT_REQUEST,
  payload: data,
});

export const getPlaidUserAccountSuccess = (data) => ({
  type: CONSTANTS.GET_PLAID_ACCOUNT_SUCCESS,
  data,
});

export const getPlaidUserAccountFail = (error) => ({
  type: CONSTANTS.GET_PLAID_ACCOUNT_FAIL,
  error,
});

export const removePlaidUserAccount = (data) => ({
  type: CONSTANTS.REMOVE_PLAID_ACCOUNT,
  payload: data,
});

export const removePlaidUserAccountSuccess = (data) => ({
  type: CONSTANTS.REMOVE_PLAID_ACCOUNT_SUCCESS,
  data,
});

export const removePlaidUserAccountFail = (error) => ({
  type: CONSTANTS.REMOVE_PLAID_ACCOUNT_FAIL,
  error,
});

export const getDocumentTypeUser = (data) => ({
  type: CONSTANTS.GET_DOCUMENT_TYPE_USER,
  payload: data,
});

export const getDocumentTypeUserSuccess = (data) => ({
  type: CONSTANTS.GET_DOCUMENT_TYPE_USER_SUCCESS,
  data,
});

export const getDocumentTypeUserFail = (error) => ({
  type: CONSTANTS.GET_DOCUMENT_TYPE_USER_FAIL,
  error,
});

export const displayRegisterUserWallet = (data) => ({
  type: CONSTANTS.DISPLAY_REGISTER_USER_WALLET,
  payload: data,
});

export const displayRegisterUserWalletSuccess = (data) => ({
  type: CONSTANTS.DISPLAY_REGISTER_USER_WALLET_SUCCESS,
  data,
});

export const searchUserPayment = (data) => ({
  type: CONSTANTS.SEARCH_USER_PAYMENT,
  payload: data,
});

export const searchUserPaymentSuccess = (data) => ({
  type: CONSTANTS.SEARCH_USER_PAYMENT_SUCCESS,
  data,
});

export const searchUserPaymentFail = (error) => ({
  type: CONSTANTS.SEARCH_USER_PAYMENT_FAIL,
  error,
});

export const transferMoneyByBankAccount = (data) => ({
  type: CONSTANTS.TRANSFER_MONEY_BY_BANK_ACCOUNT,
  payload: data,
});

export const transferMoneyByBankAccountSuccess = (data) => ({
  type: CONSTANTS.TRANSFER_MONEY_BY_BANK_ACCOUNT_SUCCESS,
  data,
});

export const transferMoneyByBankAccountFail = (error) => ({
  type: CONSTANTS.TRANSFER_MONEY_BY_BANK_ACCOUNT_FAIL,
  error,
});

export const transferMoneyByBenjiWalletAccount = (data) => ({
  type: CONSTANTS.TRANSFER_MONEY_BY_BENJI_ACCOUNT,
  payload: data,
});

export const transferMoneyByBenjiWalletAccountSuccess = (data) => ({
  type: CONSTANTS.TRANSFER_MONEY_BY_BENJI_ACCOUNT_SUCCESS,
  data,
});

export const transferMoneyByBenjiWalletAccountFail = (error) => ({
  type: CONSTANTS.TRANSFER_MONEY_BY_BENJI_ACCOUNT_FAIL,
  error,
});

export const transferFromBenjiToBankAccount = (data) => ({
  type: CONSTANTS.TRANSFER_MONEY_FROM_BENJI_TO_BANK_ACCOUNT,
  payload: data,
});

export const transferFromBenjiToBankAccountSuccess = (data) => ({
  type: CONSTANTS.TRANSFER_MONEY_FROM_BENJI_TO_BANK_ACCOUNT_SUCCESS,
  data,
});

export const transferFromBenjiToBankAccountFail = (error) => ({
  type: CONSTANTS.TRANSFER_MONEY_FROM_BENJI_TO_BANK_ACCOUNT_FAIL,
  error,
});

export const getRecentlySendPayment = (data) => ({
  type: CONSTANTS.RECENTLY_USER_SEND_PAYMENT,
  payload: data,
});

export const getRecentlySendPaymentSuccess = (data) => ({
  type: CONSTANTS.RECENTLY_USER_SEND_PAYMENT_SUCCESS,
  data,
});

export const getRecentlySendPaymentFail = (error) => ({
  type: CONSTANTS.RECENTLY_USER_SEND_PAYMENT_FAIL,
  error,
});

export const requestPaymentSilaFromPersonalAccount = (data) => ({
  type: CONSTANTS.REQUEST_PAYMENT_SILA_FROM_PERSONAL_ACCOUNT,
  payload: data,
});

export const requestPaymentSilaFromCompanyAccount = (company_id, data) => ({
  type: CONSTANTS.REQUEST_PAYMENT_SILA_FROM_COMPANY_ACCOUNT,
  company_id: company_id,
  payload: data,
});

export const requestPaymentSilaSuccess = (data) => ({
  type: CONSTANTS.REQUEST_PAYMENT_SILA_SUCCESS,
  data,
});
export const requestPaymentSilaFail = (error) => ({
  type: CONSTANTS.REQUEST_PAYMENT_SILA_FAIL,
  error,
});

export const addNewMember = (data, companyId) => ({
  type: CONSTANTS.ADD_NEW_ROLE_MEMBER,
  payload: data,
  companyId: companyId,
});
export const addNewMemberSuccess = (data) => ({
  type: CONSTANTS.ADD_NEW_ROLE_MEMBER_SUCCESS,
  data,
});
export const addNewMemberFail = (error) => ({
  type: CONSTANTS.ADD_NEW_ROLE_MEMBER_FAIL,
  error,
});

export const updateMember = (data, companyId, memberId) => ({
  type: CONSTANTS.UPDATE_ROLE_MEMBER,
  payload: data,
  companyId: companyId,
  memberId: memberId,
});
export const updateMemberSuccess = (data) => ({
  type: CONSTANTS.UPDATE_ROLE_MEMBER_SUCCESS,
  data,
});
export const updateMemberFail = (error) => ({
  type: CONSTANTS.UPDATE_ROLE_MEMBER_FAIL,
  error,
});

export const deleteMember = (companyId, memberId) => ({
  type: CONSTANTS.DELETE_ROLE_MEMBER,
  companyId: companyId,
  memberId: memberId,
});
export const deleteMemberSuccess = (data) => ({
  type: CONSTANTS.DELETE_ROLE_MEMBER_SUCCESS,
  data,
});
export const deleteMemberFail = (error) => ({
  type: CONSTANTS.DELETE_ROLE_MEMBER_FAIL,
  error,
});

export const requestListMembers = (data, companyId) => ({
  type: CONSTANTS.REQUEST_LIST_MEMBERS,
  payload: data,
});
export const requestListMembersSuccess = (data) => ({
  type: CONSTANTS.REQUEST_LIST_MEMBERS_SUCCESS,
  data,
});
export const requestListMembersFail = (error) => ({
  type: CONSTANTS.REQUEST_LIST_MEMBERS_FAIL,
  error,
});

export const fetchUserWalletBalRequest = () => ({
  type: CONSTANTS.FETCHING_USER_WALLET_BAL_REQUEST,
});

export const fetchUserWalletBalSuccess = (data) => ({
  type: CONSTANTS.FETCHING_USER_WALLET_BAL_SUCCESS,
  data,
});

export const fetchUserWalletBalFail = (error) => ({
  type: CONSTANTS.FETCHING_USER_WALLET_BAL_FAIL,
  error,
});

export const fetchUserWalletBalReset = () => ({
  type: CONSTANTS.FETCHING_USER_WALLET_BAL_RESET,
});

export const deleteUserAccountRequest = (payload) => ({
  type: CONSTANTS.DELETE_USER_ACCOUNT_REQUEST,
  payload,
});

export const deleteUserAccountSuccess = (data) => ({
  type: CONSTANTS.DELETE_USER_ACCOUNT_SUCCESS,
  data,
});

export const deleteUserAccountFail = (error) => ({
  type: CONSTANTS.DELETE_USER_ACCOUNT_FAIL,
  error,
});

export const deleteUserAccountReset = () => ({
  type: CONSTANTS.DELETE_USER_ACCOUNT_RESET,
});
