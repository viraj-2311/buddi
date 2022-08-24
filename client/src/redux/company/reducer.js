import produce from 'immer';
import * as CONSTANTS from './constants';

const initialState = {
  loading: false,
  companies: [],
  company: null,
  profile: null,
  create: {
    loading: false,
    error: null,
  },
  update: {
    loading: false,
    error: null,
  },
  detail: {
    loading: false,
    error: null,
  },
  fetchProfile: {
    loading: true,
    error: null,
  },
  updateProfile: {
    loading: true,
    error: null,
  },
  accept: {
    loading: true,
    error: null,
  },
  decline: {
    loading: true,
    error: null,
  },
  companyType: {
    loading: false,
    error: null,
  },
  companyTypeList: [],
  businessType: {
    loading: false,
    error: null,
  },
  businessTypeList: [],
  companyWallet: {
    loading: false,
    error: null,
    wallet: null,
  },
  silaKYB: {
    loading: false,
    error: null,
    silaKYB: {},
  },
  silaCompany: {
    loading: false,
    error: null,
    companyInfo: null,
  },
  kybUpload: {
    loading: false,
    error: null,
    success: null,
    data: null,
  },
  plaidLinkKYB: {
    token: null,
    loading: false,
    error: null,
    connected: false,
  },
  plaidCompanyAccount: {
    account: null,
    loading: false,
    error: null,
  },
  accountCompanyRemove: {
    success: false,
    loading: false,
    error: null,
  },
  paidInvoices: {
    loading: false,
    error: null,
    success: false,
  },
  requestSignIntoCompany: {
    loading: false,
    error: null,
    success: false,
  },
  companyWalletBal: {
    loading: false,
    error: null,
    status: null
  },
  deletedCompanyAccount: {
    loading: false,
    error: null,
    status: null
  },
  displayWalletNotSetModal: false,
};

const companyReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FETCH_COMPANIES_REQUEST:
        draft.loading = true;
        break;
      case CONSTANTS.FETCH_COMPANIES_SUCCESS:
        draft.companies = action.companies;
        draft.loading = false;
        break;
      case CONSTANTS.FETCH_COMPANIES_FAIL:
        draft.loading = false;
        break;

      case CONSTANTS.FETCH_COMPANY_DETAIL_REQUEST:
        draft.detail = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_COMPANY_DETAIL_SUCCESS:
        draft.company = action.data;
        draft.detail = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_COMPANY_DETAIL_FAIL:
        draft.detail = { loading: false, error: action.error };
        break;

      case CONSTANTS.FETCH_COMPANY_PROFILE_REQUEST:
        draft.fetchProfile = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_COMPANY_PROFILE_SUCCESS:
        draft.profile = action.data;
        draft.fetchProfile = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_COMPANY_PROFILE_FAIL:
        draft.fetchProfile = { loading: false, error: action.error };
        break;

      case CONSTANTS.UPDATE_COMPANY_PROFILE_REQUEST:
        draft.updateProfile = { loading: true, error: null };
        break;
      case CONSTANTS.UPDATE_COMPANY_PROFILE_SUCCESS:
        draft.profile = action.data;
        draft.updateProfile = { loading: false, error: null };
        break;
      case CONSTANTS.UPDATE_COMPANY_PROFILE_FAIL:
        draft.updateProfile = { loading: false, error: action.error };
        break;

      case CONSTANTS.CREATE_COMPANY_REQUEST:
        draft.create = { loading: true, error: null };
        break;
      case CONSTANTS.CREATE_COMPANY_SUCCESS:
        draft.create = { loading: false, error: null };
        draft.company = action.data;
        break;
      case CONSTANTS.CREATE_COMPANY_FAIL:
        draft.create = { loading: false, error: action.error };
        break;

      case CONSTANTS.UPDATE_COMPANY_REQUEST:
        draft.update = { loading: true, error: null };
        break;
      case CONSTANTS.UPDATE_COMPANY_SUCCESS:
        draft.company = action.data;
        draft.update = { loading: false, error: null };
        break;
      case CONSTANTS.UPDATE_COMPANY_FAIL:
        draft.update = { loading: false, error: action.error };
        break;

      case CONSTANTS.ACCEPT_COMPANY_PERMISSION_BY_OWNER_REQUEST:
        draft.accept = { loading: true, error: null };
        break;
      case CONSTANTS.ACCEPT_COMPANY_PERMISSION_BY_OWNER_SUCCESS:
        draft.accept = { loading: false, error: null };
        break;
      case CONSTANTS.ACCEPT_COMPANY_PERMISSION_BY_OWNER_FAIL:
        draft.accept = { loading: false, error: action.error };
        break;

      case CONSTANTS.DECLINE_COMPANY_PERMISSION_BY_OWNER_REQUEST:
        draft.decline = { loading: true, error: null };
        break;
      case CONSTANTS.DECLINE_COMPANY_PERMISSION_BY_OWNER_SUCCESS:
        draft.decline = { loading: false, error: null };
      case CONSTANTS.DECLINE_COMPANY_PERMISSION_BY_OWNER_FAIL:
        draft.decline = { loading: false, error: action.error };
        break;

      case CONSTANTS.FETCH_COMPANY_TYPE_REQUEST:
        draft.companyType = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_COMPANY_TYPE_SUCCESS:
        draft.companyTypeList = action.data;
        draft.companyType = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_COMPANY_TYPE_FAIL:
        draft.companyType = { loading: false, error: action.error };
        break;

      case CONSTANTS.FETCH_BUSINESS_TYPE_REQUEST:
        draft.businessType = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_BUSINESS_TYPE_SUCCESS:
        draft.businessTypeList = action.data;
        draft.businessType = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_BUSINESS_TYPE_FAIL:
        draft.businessType = { loading: false, error: action.error };
        break;

      case CONSTANTS.REGISTER_SILA_COMPANY:
        draft.silaCompany = {
          loading: true,
          error: null,
          companyInfo: null,
        };
        break;
      case CONSTANTS.REGISTER_SILA_COMPANY_SUCCESS:
        draft.silaCompany = {
          loading: false,
          error: null,
          companyInfo: action.data,
        };
        break;
      case CONSTANTS.REGISTER_SILA_COMPANY_FAIL:
        draft.silaCompany = {
          loading: false,
          error: action.error,
          companyInfo: null,
        };
        break;

      case CONSTANTS.UPDATE_SILA_COMPANY:
        draft.silaCompany = {
          loading: true,
          error: null,
          companyInfo: null,
        };
        break;
      case CONSTANTS.UPDATE_SILA_COMPANY_SUCCESS:
        draft.silaCompany = {
          loading: false,
          error: null,
          companyInfo: action.data,
        };
        break;
      case CONSTANTS.UPDATE_SILA_COMPANY_FAIL:
        draft.silaCompany = {
          loading: false,
          error: action.error,
          companyInfo: null,
        };
        break;

      case CONSTANTS.GET_COMPANY_WALLET:
        draft.companyWallet = {
          ...draft.companyWallet,
          loading: true,
          error: null,
        };
        break;
      case CONSTANTS.GET_COMPANY_WALLET_SUCCESS:
        draft.companyWallet = {
          loading: false,
          error: null,
          wallet: action.data,
        };
        break;
      case CONSTANTS.GET_COMPANY_WALLET_FAIL:
        draft.companyWallet = {
          loading: false,
          error: action.error,
          wallet: null,
        };
        break;

      case CONSTANTS.GET_SILA_COMPANY:
        draft.silaCompany = {
          loading: true,
          error: null,
          companyInfo: null,
        };
        break;
      case CONSTANTS.GET_SILA_COMPANY_SUCCESS:
        draft.silaCompany = {
          loading: false,
          error: null,
          companyInfo: action.data,
        };
        break;
      case CONSTANTS.GET_SILA_COMPANY_FAIL:
        draft.silaCompany = {
          loading: false,
          error: action.error,
          companyInfo: null,
        };
        break;

      case CONSTANTS.GET_COMPANY_SILA_VERIFICATION:
        draft.silaKYB = { ...draft.silaKYB, loading: true, error: null };
        break;
      case CONSTANTS.GET_COMPANY_SILA_VERIFICATION_SUCCESS:
        draft.silaKYB = {
          loading: false,
          error: null,
          silaKYB: action.data,
        };
        break;
      case CONSTANTS.GET_COMPANY_SILA_VERIFICATION_FAIL:
        draft.silaKYB = {
          loading: false,
          error: action.error,
          silaKYB: {},
        };
        break;

      case CONSTANTS.POST_COMPANY_REQUEST_KYB:
        draft.silaKYB = { loading: true, error: null, silaKYB: {} };
        break;
      case CONSTANTS.POST_COMPANY_REQUEST_KYB_SUCCESS:
        draft.silaKYB = {
          loading: false,
          error: null,
          silaKYB: action.data,
        };
        break;
      case CONSTANTS.POST_COMPANY_REQUEST_KYB_FAIL:
        draft.silaKYB = {
          loading: false,
          error: action.error,
          silaKYB: {},
        };
        break;

      case CONSTANTS.UPLOAD_KYB_DOCUMENT_REQUEST:
        draft.kybUpload.loading = true;
        draft.kybUpload.error = null;
        draft.kybUpload.success = null;
        draft.kybUpload.data = null;
        break;
      case CONSTANTS.UPLOAD_KYB_DOCUMENT_SUCCESS:
        draft.kybUpload.loading = false;
        draft.kybUpload.error = null;
        draft.kybUpload.success = 'KYB document uploaded successfully!';
        draft.kybUpload.data = action.payload;
        break;
      case CONSTANTS.UPLOAD_KYB_DOCUMENT_FAIL:
        draft.kybUpload.loading = false;
        draft.kybUpload.error = action.error;
        draft.kybUpload.success = null;
        draft.kybUpload.data = null;
        break;

      case CONSTANTS.GET_PLAID_LINK_COMPANY_TOKEN_REQUEST:
        draft.plaidLinkKYB = {
          loading: true,
          error: null,
          token: null,
          connected: false,
        };
        break;
      case CONSTANTS.GET_PLAID_LINK_COMPANY_TOKEN_SUCCESS:
        draft.plaidLinkKYB = {
          loading: false,
          error: null,
          token: action.data,
          connected: false,
        };
        break;
      case CONSTANTS.PLAID_LINK_COMPANY_ACCOUNT_CONNECTED:
        draft.plaidLinkKYB = {
          loading: false,
          error: null,
          token: null,
          connected: true,
        };
        break;
      case CONSTANTS.GET_PLAID_LINK_COMPANY_TOKEN_FAIL:
        draft.plaidLinkKYB = {
          loading: false,
          error: action.error,
          token: null,
          connected: false,
        };
        break;

      case CONSTANTS.GET_PLAID_COMPANY_ACCOUNT_REQUEST:
        draft.plaidCompanyAccount = {
          ...draft.plaidCompanyAccount,
          loading: true,
          error: null,
        };
        break;
      case CONSTANTS.GET_PLAID_COMPANY_ACCOUNT_SUCCESS:
        draft.plaidCompanyAccount = {
          loading: false,
          error: null,
          account: action.data,
        };
        break;
      case CONSTANTS.GET_PLAID_COMPANY_ACCOUNT_FAIL:
        draft.plaidCompanyAccount = {
          loading: false,
          error: action.error,
          account: null,
        };
        break;

      case CONSTANTS.REMOVE_PLAID_COMPANY_ACCOUNT:
        draft.accountCompanyRemove = {
          loading: true,
          error: null,
          success: false,
        };
        break;
      case CONSTANTS.REMOVE_PLAID_COMPANY_ACCOUNT_SUCCESS:
        draft.accountCompanyRemove = {
          loading: false,
          error: null,
          success: true,
        };
        break;
      case CONSTANTS.REMOVE_PLAID_COMPANY_ACCOUNT_FAIL:
        draft.accountCompanyRemove = {
          loading: false,
          error: action.error,
          success: false,
        };
        break;

      case CONSTANTS.PAID_INVOICES_BY_BANK_ACCOUNT:
        draft.paidInvoices.loading = true;
        draft.paidInvoices.error = null;
        draft.paidInvoices.success = null;
        break;
      case CONSTANTS.PAID_INVOICES_BY_BANK_ACCOUNT_SUCCESS:
        draft.paidInvoices.loading = false;
        draft.paidInvoices.error = null;
        draft.paidInvoices.success = true;
        break;
      case CONSTANTS.PAID_INVOICES_BY_BANK_ACCOUNT_FAIL:
        draft.paidInvoices.loading = false;
        draft.paidInvoices.error = action.error;
        draft.paidInvoices.success = null;
        break;

      case CONSTANTS.REQUEST_SIGN_INTO_COMPANY_REQUEST:
        draft.requestSignIntoCompany = {
          loading: true,
          error: null,
          success: null,
        };
        break;
      case CONSTANTS.REQUEST_SIGN_INTO_COMPANY_SUCCESS:
        draft.requestSignIntoCompany = {
          loading: false,
          error: null,
          success: true,
        };
        break;
      case CONSTANTS.REQUEST_SIGN_INTO_COMPANY_FAIL:
        draft.requestSignIntoCompany = {
          loading: false,
          error: action.error,
          success: null,
        };
        break;
      case CONSTANTS.FETCHING_COMPANY_WALLET_BAL_REQUEST:
        draft.companyWalletBal = {
          loading: true,
          error: null,
          status: null,
        };
        break;
      case CONSTANTS.FETCHING_COMPANY_WALLET_BAL_SUCCESS:
        draft.companyWalletBal = {
          loading: false,
          error: null,
          status: action.data?.status,
        };
        break;
      case CONSTANTS.FETCHING_COMPANY_WALLET_BAL_FAIL:
        draft.companyWalletBal = {
          loading: false,
          error: action.error,
          status: null,
        };
        break;
      case CONSTANTS.FETCHED_COMPANY_WALLET_BAL_RESET:
        draft.companyWalletBal = {
          loading: false,
          error: null,
          status: null,
        };
        break;
      case CONSTANTS.DELETE_COMPANY_ACCOUNT_REQUEST:
        draft.deletedCompanyAccount = {
          loading: true,
          error: null,
          status: null,
        };
        break;
      case CONSTANTS.DELETE_COMPANY_ACCOUNT_SUCCESS:
        draft.deletedCompanyAccount = {
          loading: false,
          error: null,
          status: action.data?.status,
        };
        break;
      case CONSTANTS.DELETE_COMPANY_ACCOUNT_FAIL:
        draft.deletedCompanyAccount = {
          loading: false,
          error: action.error,
          status: null,
        };
        break;
      case CONSTANTS.DELETE_COMPANY_ACCOUNT_RESET:
        draft.deletedCompanyAccount = {
          loading: false,
          error: null,
          status: null,
        };
        break;
      case CONSTANTS.TOGGLE_WALLET_NOT_SET_MODAL:
        draft.displayWalletNotSetModal = action.visible;
        break;
      default:
        break;
    }
  });

export default companyReducer;
