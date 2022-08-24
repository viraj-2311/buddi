import produce from 'immer';
import * as CONSTANTS from './constants';
import * as COMMON_CONSTANTS from '../constants';

const initialState = {
  users: [],
  user: null,
  producers: [],
  skills: [],
  list: {
    loading: false,
    error: null,
  },
  detail: {
    loading: false,
    error: null,
  },
  update: {
    loading: false,
    error: null,
    completed: false,
  },
  profile: {
    loading: false,
    error: null,
    updated: false,
  },
  invite: {
    loading: false,
    error: null,
    invitees: [],
  },
  password: {
    loading: false,
    error: null,
  },
  company: {
    companies: [],
    loading: false,
    error: null,
  },
  producerList: {
    loading: false,
    error: null,
  },
  sectionToRedirect: null,
  userWallet: {
    loading: false,
    error: null,
    wallet: null,
  },
  updateW9Document: {
    loading: false,
    error: null,
    data: null,
  },
  removeW9Document: {
    loading: false,
    error: null,
    success: null,
  },
  silaKYC: {
    loading: false,
    error: null,
    silaKYC: {},
  },
  kycUpload: {
    loading: false,
    error: null,
    success: null,
    data: null,
  },
  silaUser: {
    loading: false,
    error: null,
    userInfo: null,
  },
  plaidLink: {
    token: null,
    loading: false,
    error: null,
    connected: false,
  },
  plaidUserAccount: {
    account: null,
    loading: false,
    error: null,
  },
  accountUserRemove: {
    success: null,
    loading: false,
    error: null,
  },
  documentType: {
    data: null,
    loading: false,
    error: null,
  },
  displayRegister: false,
  userReceivePayment: {
    data: null,
    loading: false,
    error: null,
  },
  transferByBank: {
    error: null,
    loading: false,
    success: null,
  },
  transferByBenji: {
    error: null,
    loading: false,
    success: null,
  },
  transferFromBenjiToBank: {
    error: null,
    loading: false,
    success: null,
  },
  recentlyUserSendPayment: {
    error: null,
    loading: false,
    data: null,
  },
  userHistoryPayment: {
    loading: true,
    error: null,
    data: null,
  },
  requestPayment: {
    loading: true,
    error: null,
    success: null,
  },
  roleMember: {
    loading: false,
    error: null,
    success: null,
  },
  listMembers: {
    loading: true,
    error: null,
    data: null,
  },
  requestingUserWalletBal: {
    loading: false,
    error: null,
    status: null,
  },
  deletedUserAccount: {
    loading: false,
    error: null,
    status: null,
  },
};

const userReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FETCH_USER_SKILLS_SUCCESS:
        draft.skills = action.data;
        break;

      case CONSTANTS.FETCH_USERS_REQUEST:
        draft.list = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_USERS_SUCCESS:
        draft.users = action.users;
        draft.list = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_USERS_FAIL:
        draft.users = [];
        draft.list = { loading: false, error: action.error };
        break;

      case CONSTANTS.REGISTER_SILA_USER:
        draft.silaUser = { loading: true, error: null, userInfo: null };
        break;
      case CONSTANTS.REGISTER_SILA_USER_SUCCESS:
        draft.silaUser = {
          loading: false,
          error: null,
          userInfo: action.data,
        };
        break;
      case CONSTANTS.REGISTER_SILA_USER_FAIL:
        draft.silaUser = {
          loading: false,
          error: action.error,
          userInfo: null,
        };
        break;

      case CONSTANTS.UPDATE_SILA_USER:
        draft.silaUser = { loading: true, error: null, userInfo: null };
        break;
      case CONSTANTS.UPDATE_SILA_USER_SUCCESS:
        draft.silaUser = {
          loading: false,
          error: null,
          userInfo: action.data,
        };
        break;
      case CONSTANTS.UPDATE_SILA_USER_FAIL:
        draft.silaUser = {
          loading: false,
          error: action.error,
          userInfo: null,
        };
        break;

      case CONSTANTS.GET_SILA_USER:
        draft.silaUser = {
          loading: true,
          error: null,
          userInfo: null,
        };
        break;
      case CONSTANTS.GET_SILA_USER_SUCCESS:
        draft.silaUser = {
          loading: false,
          error: null,
          userInfo: action.data,
        };
        break;
      case CONSTANTS.GET_SILA_USER_FAIL:
        draft.silaUser = {
          loading: false,
          error: action.error,
          userInfo: null,
        };
        break;

      case CONSTANTS.GET_USER_WALLET:
        draft.userWallet = { ...draft.userWallet, loading: true, error: null };
        break;
      case CONSTANTS.GET_USER_WALLET_SUCCESS:
        draft.userWallet = {
          loading: false,
          error: null,
          wallet: action.data,
        };
        break;
      case CONSTANTS.GET_USER_WALLET_FAIL:
        draft.userWallet = {
          loading: false,
          error: action.error,
          wallet: null,
        };
        break;

      case CONSTANTS.FETCH_USER_DETAIL_REQUEST:
        draft.detail = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_USER_DETAIL_SUCCESS:
        draft.user = action.user;
        draft.detail = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_USER_DETAIL_FAIL:
        draft.user = null;
        draft.detail = { loading: false, error: action.error };
        break;

      case CONSTANTS.UPDATE_USER_REQUEST:
        draft.update = { loading: true, error: null, updated: false };
        break;
      case CONSTANTS.UPDATE_USER_SUCCESS:
        draft.user = action.user;
        draft.update = { loading: false, error: null, updated: true };
        break;
      case CONSTANTS.UPDATE_USER_FAIL:
        draft.update = { loading: false, error: action.error, updated: false };
        break;
      case CONSTANTS.UPDATE_USER_RESET:
        draft.update = { loading: false, error:null, updated: false };
        break;

      case CONSTANTS.UPDATE_USER_EXPERTISE_REQUEST:
        draft.profile = { loading: true, error: null, updated: false };
        break;
      case CONSTANTS.UPDATE_USER_EXPERTISE_SUCCESS:
        draft.user = { ...draft.user, ...action.data };
        draft.profile = { loading: false, error: null, updated: true };
        break;
      case CONSTANTS.UPDATE_USER_EXPERTISE_FAIL:
        draft.profile = { loading: false, error: action.error, updated: false };
        break;

      case CONSTANTS.CHANGE_PASSWORD_REQUEST:
        draft.password = { loading: true, error: null };
        break;
      case CONSTANTS.CHANGE_PASSWORD_SUCCESS:
        draft.password = { loading: false, error: null };
        break;
      case CONSTANTS.CHANGE_PASSWORD_FAIL:
        draft.password = { loading: false, error: action.error };
        break;

      case CONSTANTS.INVITE_STAFF_REQUEST:
        draft.invite = { loading: true, error: null, invitees: [] };
        break;
      case CONSTANTS.INVITE_STAFF_SUCCESS:
        draft.invite = { loading: false, error: null, invitees: action.users };
        break;
      case CONSTANTS.INVITE_STAFF_FAIL:
        draft.invite = { loading: false, error: action.error, invitees: [] };
        break;

      case CONSTANTS.FETCH_USER_COMPANIES_REQUEST:
        draft.company = { loading: true, error: null, companies: [] };
        break;
      case CONSTANTS.FETCH_USER_COMPANIES_SUCCESS:
        draft.company = { loading: false, error: null, companies: action.data };
        break;
      case CONSTANTS.FETCH_USER_COMPANIES_FAIL:
        draft.company = { loading: false, error: action.error, companies: [] };
        break;

      case CONSTANTS.FETCH_PRODUCERS_REQUEST:
        draft.producerList = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_PRODUCERS_SUCCESS:
        draft.producers = action.users;
        draft.producerList = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_PRODUCERS_FAIL:
        draft.producers = [];
        draft.producerList = { loading: false, error: action.error };
        break;

      case CONSTANTS.SECTION_TO_REDIRECT:
        draft.sectionToRedirect = action.data;
        break;

      case COMMON_CONSTANTS.UPDATE_W9_DOCUMENT_REQUEST:
        draft.updateW9Document = { loading: true, error: null, success: null };
        break;
      case COMMON_CONSTANTS.UPDATE_W9_DOCUMENT_SUCCESS:
        draft.user = { ...draft.user, w9Document: action.data };
        draft.updateW9Document = {
          loading: false,
          error: null,
          success: 'W9 document uploaded successfully!',
          data: action.data,
        };
        break;
      case COMMON_CONSTANTS.UPDATE_W9_DOCUMENT_FAIL:
        draft.updateW9Document = { loading: false, error: action.error };

      case COMMON_CONSTANTS.REMOVE_W9_DOCUMENT_REQUEST:
        draft.removeW9Document = {
          loading: true,
          error: null,
          success: null,
        };
        break;
      case COMMON_CONSTANTS.REMOVE_W9_DOCUMENT_SUCCESS:
        draft.user = { ...draft.user, w9Document: null };
        draft.removeW9Document = {
          loading: false,
          error: null,
          success: 'W9 document deleted successfully!',
        };
        break;
      case COMMON_CONSTANTS.REMOVE_W9_DOCUMENT_FAIL:
        draft.removeW9Document = {
          loading: false,
          error: action.error,
          success: null,
        };
        break;

      case CONSTANTS.GET_USER_SILA_KYC:
        draft.silaKYC = { ...draft.silaKYC, loading: true, error: null };
        break;
      case CONSTANTS.GET_USER_SILA_KYC_SUCCESS:
        draft.silaKYC = {
          loading: false,
          error: null,
          silaKYC: action.data,
        };
        break;
      case CONSTANTS.GET_USER_SILA_KYC_FAIL:
        draft.silaKYC = {
          loading: false,
          error: action.error,
          silaKYC: {},
        };
        break;

      case CONSTANTS.POST_USER_REQUEST_KYC:
        draft.silaKYC = { loading: true, error: null, silaKYC: {} };
        break;
      case CONSTANTS.POST_USER_REQUEST_KYC_SUCCESS:
        draft.silaKYC = {
          loading: false,
          error: null,
          silaKYC: action.data,
        };
        break;
      case CONSTANTS.POST_USER_REQUEST_KYC_FAIL:
        draft.silaKYC = {
          loading: false,
          error: action.error,
          silaKYC: {},
        };
        break;
      case CONSTANTS.UPLOAD_KYC_DOCUMENT_REQUEST:
        draft.kycUpload.loading = true;
        draft.kycUpload.error = null;
        draft.kycUpload.success = null;
        draft.kycUpload.data = null;
        break;
      case CONSTANTS.UPLOAD_KYC_DOCUMENT_SUCCESS:
        draft.kycUpload.loading = false;
        draft.kycUpload.error = null;
        draft.kycUpload.success = 'KYC document uploaded successfully!';
        draft.kycUpload.data = action.payload;
        break;
      case CONSTANTS.UPLOAD_KYC_DOCUMENT_FAIL:
        draft.kycUpload.loading = false;
        draft.kycUpload.error = action.error;
        draft.kycUpload.success = null;
        draft.kycUpload.data = null;
        break;

      case CONSTANTS.SEARCH_USER_PAYMENT:
        draft.userReceivePayment.loading = true;
        draft.userReceivePayment.error = null;
        draft.userReceivePayment.data = null;
        break;
      case CONSTANTS.SEARCH_USER_PAYMENT_SUCCESS:
        draft.userReceivePayment.loading = false;
        draft.userReceivePayment.error = null;
        draft.userReceivePayment.data = action.data;
        break;
      case CONSTANTS.SEARCH_USER_PAYMENT_FAIL:
        draft.userReceivePayment.loading = false;
        draft.userReceivePayment.error = action.error;
        draft.userReceivePayment.data = null;
        break;

      case CONSTANTS.GET_PLAID_LINK_TOKEN_REQUEST:
        draft.plaidLink = {
          loading: true,
          error: null,
          token: null,
          connected: false,
        };
        break;
      case CONSTANTS.GET_PLAID_LINK_TOKEN_SUCCESS:
        draft.plaidLink = {
          loading: false,
          error: null,
          token: action.data,
          connected: false,
        };
        break;
      case CONSTANTS.PLAID_LINK_ACCOUNT_CONNECTED:
        draft.plaidLink = {
          loading: false,
          error: null,
          token: null,
          connected: true,
        };
        break;
      case CONSTANTS.GET_PLAID_LINK_TOKEN_FAIL:
        draft.plaidLink = {
          loading: false,
          error: action.error,
          token: null,
          connected: false,
        };
        break;

      case CONSTANTS.GET_PLAID_ACCOUNT_REQUEST:
        draft.plaidUserAccount = {
          ...draft.plaidUserAccount,
          loading: true,
          error: null,
        };
        break;
      case CONSTANTS.GET_PLAID_ACCOUNT_SUCCESS:
        draft.plaidUserAccount = {
          loading: false,
          error: null,
          account: action.data,
        };
        break;
      case CONSTANTS.GET_PLAID_ACCOUNT_FAIL:
        draft.plaidUserAccount = {
          loading: false,
          error: action.error,
          account: null,
        };
        break;

      case CONSTANTS.REMOVE_PLAID_ACCOUNT:
        draft.accountUserRemove = {
          loading: true,
          success: false,
          error: null,
        };
        break;
      case CONSTANTS.REMOVE_PLAID_ACCOUNT_SUCCESS:
        draft.accountUserRemove = {
          loading: false,
          error: null,
          success: true,
        };
        break;
      case CONSTANTS.REMOVE_PLAID_ACCOUNT_FAIL:
        draft.accountUserRemove = {
          loading: false,
          error: action.error,
          success: false,
        };
        break;

      case CONSTANTS.GET_DOCUMENT_TYPE_USER:
        draft.documentType = { loading: true, error: null };
        break;
      case CONSTANTS.GET_DOCUMENT_TYPE_USER_SUCCESS:
        draft.documentType = {
          loading: false,
          error: null,
          data: action.data,
        };
        break;
      case CONSTANTS.GET_DOCUMENT_TYPE_USER_FAIL:
        draft.documentType = {
          loading: false,
          error: action.error,
          data: null,
        };
        break;

      case CONSTANTS.DISPLAY_REGISTER_USER_WALLET_SUCCESS:
        draft.displayRegister = action.data;
        break;

      case CONSTANTS.TRANSFER_MONEY_BY_BANK_ACCOUNT:
        draft.transferByBank.loading = true;
        draft.transferByBank.error = null;
        draft.transferByBank.success = null;
        break;
      case CONSTANTS.TRANSFER_MONEY_BY_BANK_ACCOUNT_SUCCESS:
        draft.transferByBank.loading = false;
        draft.transferByBank.error = null;
        draft.transferByBank.success = true;
        break;
      case CONSTANTS.TRANSFER_MONEY_BY_BANK_ACCOUNT_FAIL:
        draft.transferByBank.loading = false;
        draft.transferByBank.error = action.error;
        draft.transferByBank.success = null;
        break;

      case CONSTANTS.TRANSFER_MONEY_BY_BENJI_ACCOUNT:
        draft.transferByBenji.loading = true;
        draft.transferByBenji.error = null;
        draft.transferByBenji.success = null;
        break;
      case CONSTANTS.TRANSFER_MONEY_BY_BENJI_ACCOUNT_SUCCESS:
        draft.transferByBenji.loading = false;
        draft.transferByBenji.error = null;
        draft.transferByBenji.success = true;
        break;
      case CONSTANTS.TRANSFER_MONEY_BY_BENJI_ACCOUNT_FAIL:
        draft.transferByBenji.loading = false;
        draft.transferByBenji.error = action.error;
        draft.transferByBenji.success = null;
        break;

      case CONSTANTS.TRANSFER_MONEY_FROM_BENJI_TO_BANK_ACCOUNT:
        draft.transferFromBenjiToBank.loading = true;
        draft.transferFromBenjiToBank.error = null;
        draft.transferFromBenjiToBank.success = null;
        break;
      case CONSTANTS.TRANSFER_MONEY_FROM_BENJI_TO_BANK_ACCOUNT_SUCCESS:
        draft.transferFromBenjiToBank.loading = false;
        draft.transferFromBenjiToBank.error = null;
        draft.transferFromBenjiToBank.success = true;
        break;
      case CONSTANTS.TRANSFER_MONEY_FROM_BENJI_TO_BANK_ACCOUNT_FAIL:
        draft.transferFromBenjiToBank.loading = false;
        draft.transferFromBenjiToBank.error = action.error;
        draft.transferFromBenjiToBank.success = null;
        break;

      case CONSTANTS.RECENTLY_USER_SEND_PAYMENT:
        draft.recentlyUserSendPayment = {
          loading: true,
          error: null,
          data: null,
        };
        break;
      case CONSTANTS.RECENTLY_USER_SEND_PAYMENT_SUCCESS:
        draft.recentlyUserSendPayment = {
          loading: false,
          error: null,
          data: action.data,
        };
        break;
      case CONSTANTS.RECENTLY_USER_SEND_PAYMENT_FAIL:
        draft.recentlyUserSendPayment = {
          loading: false,
          error: action.error,
          data: null,
        };
        break;

      case CONSTANTS.REQUEST_PAYMENT_SILA_FROM_PERSONAL_ACCOUNT:
        draft.requestPayment.loading = true;
        draft.requestPayment.error = null;
        draft.requestPayment.success = null;
        break;

      case CONSTANTS.REQUEST_PAYMENT_SILA_FROM_COMPANY_ACCOUNT:
        draft.requestPayment.loading = true;
        draft.requestPayment.error = null;
        draft.requestPayment.success = null;
        break;

      case CONSTANTS.REQUEST_PAYMENT_SILA_SUCCESS:
        draft.requestPayment.loading = false;
        draft.requestPayment.error = null;
        draft.requestPayment.success = true;
        break;
      case CONSTANTS.REQUEST_PAYMENT_SILA_FAIL:
        draft.requestPayment.loading = false;
        draft.requestPayment.error = action.error;
        draft.requestPayment.success = null;
        break;

      case CONSTANTS.ADD_NEW_ROLE_MEMBER:
        draft.roleMember.loading = true;
        draft.roleMember.error = null;
        draft.roleMember.success = null;
        break;
      case CONSTANTS.ADD_NEW_ROLE_MEMBER_SUCCESS:
        draft.roleMember.loading = false;
        draft.roleMember.error = null;
        draft.roleMember.success = true;
        break;
      case CONSTANTS.ADD_NEW_ROLE_MEMBER_FAIL:
        draft.roleMember.loading = false;
        draft.roleMember.error = action.error;
        draft.roleMember.success = null;
        break;

      case CONSTANTS.UPDATE_ROLE_MEMBER:
        draft.roleMember.loading = true;
        draft.roleMember.error = null;
        draft.roleMember.success = null;
        break;
      case CONSTANTS.UPDATE_ROLE_MEMBER_SUCCESS:
        draft.roleMember.loading = false;
        draft.roleMember.error = null;
        draft.roleMember.success = true;
        break;
      case CONSTANTS.UPDATE_ROLE_MEMBER_FAIL:
        draft.roleMember.loading = false;
        draft.roleMember.error = action.error;
        draft.roleMember.success = null;
        break;

      case CONSTANTS.DELETE_ROLE_MEMBER:
        draft.roleMember.loading = true;
        draft.roleMember.error = null;
        draft.roleMember.success = null;
        break;
      case CONSTANTS.DELETE_ROLE_MEMBER_SUCCESS:
        draft.roleMember.loading = false;
        draft.roleMember.error = null;
        draft.roleMember.success = true;
        break;
      case CONSTANTS.DELETE_ROLE_MEMBER_FAIL:
        draft.roleMember.loading = false;
        draft.roleMember.error = action.error;
        draft.roleMember.success = null;
        break;

      case CONSTANTS.REQUEST_LIST_MEMBERS:
        draft.listMembers.loading = true;
        draft.listMembers.error = null;
        draft.listMembers.data = null;
        break;
      case CONSTANTS.REQUEST_LIST_MEMBERS_SUCCESS:
        draft.listMembers.loading = false;
        draft.listMembers.error = null;
        draft.listMembers.data = action.data;
        break;
      case CONSTANTS.REQUEST_LIST_MEMBERS_FAIL:
        draft.listMembers.loading = false;
        draft.listMembers.error = action.error;
        draft.listMembers.data = null;
        break;

      case CONSTANTS.FETCHING_USER_WALLET_BAL_REQUEST:
        draft.requestingUserWalletBal = {
          loading: true,
          error: null,
          status: null,
        };
        break;
      case CONSTANTS.FETCHING_USER_WALLET_BAL_SUCCESS:
        draft.requestingUserWalletBal = {
          loading: false,
          error: null,
          status: action.data?.status,
        };
        break;
      case CONSTANTS.FETCHING_USER_WALLET_BAL_FAIL:
        draft.requestingUserWalletBal = {
          loading: false,
          error: action.error,
          status: null,
        };
      case CONSTANTS.FETCHING_USER_WALLET_BAL_RESET:
        draft.requestingUserWalletBal = {
          loading: false,
          error: null,
          status: null,
        };
        break;
      case CONSTANTS.DELETE_USER_ACCOUNT_REQUEST:
        draft.deletedUserAccount = {
          loading: true,
          error: null,
          status: null,
        };
        break;
      case CONSTANTS.DELETE_USER_ACCOUNT_SUCCESS:
        draft.deletedUserAccount = {
          loading: false,
          error: null,
          status: action.data?.status,
        };
        break;
      case CONSTANTS.DELETE_USER_ACCOUNT_FAIL:
        draft.deletedUserAccount = {
          loading: false,
          error: action.error,
          status: null,
        };
      case CONSTANTS.DELETE_USER_ACCOUNT_RESET:
        draft.deletedUserAccount = {
          loading: false,
          error: null,
          status: null,
        };
        break;
      default:
        break;
    }
  });

export default userReducer;
