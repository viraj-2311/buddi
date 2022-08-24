import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import produce from 'immer';
import * as CONSTANTS from './constants';
import * as COMMON_CONSTANTS from '../constants';

const initialState = {
  token: {
    access: null,
    refresh: null,
  },
  user: null,
  signin: {
    loading: false,
    error: null,
  },
  signup: {
    user: null,
    loading: false,
    error: null,
  },
  resendVerification: {
    loading: false,
    error: null,
  },
  forgotPassword: {
    loading: false,
    error: null,
  },
  verifyResetPasswordToken: {
    loading: false,
    error: null,
  },
  resetPassword: {
    loading: false,
    error: null,
  },
  invitation: {
    loading: false,
    user: null,
    error: null,
  },
  verification: {
    loading: false,
    error: null,
  },
  memoVerification: {
    loading: false,
    error: null,
  },
  declineBusinessMember: {
    loading: false,
    error: null,
  },
  registerCompany: {
    company: null,
    loading: false,
    error: null,
  },
  fetchCompanyDetail: {
    company: null,
    loading: false,
    error: null,
  },
  syncUser: {
    loading: false,
    error: null,
  },
  companySignOut: {
    companyId: null,
    loading: false,
    error: null,
  },
  isBuddiWalletRegister: false,
  displayRegisterBuddiWallet: false,
  canOpenRegisterBuddiWallet:true,
  triggers: {
    setupBuddiWallet: false,
  },
};

const authReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.SIGNIN_REQUEST:
        draft.signin.loading = true;
        draft.signin.error = null;
        break;
      case CONSTANTS.SIGNIN_SUCCESS:
        draft.token = {
          access: action.payload.access,
          refresh: action.payload.refresh,
        };
        draft.user = {
          ...action.payload.user,
          companies: action.payload.company,
        };
        draft.signin.loading = false;
        break;
      case CONSTANTS.SIGNIN_ERROR:
        draft.signin.loading = false;
        draft.signin.error = action.error;
        draft.token = {};
        break;
      case CONSTANTS.SIGNUP_REQUEST:
        draft.signup.user = null;
        draft.signup.loading = true;
        draft.signup.error = null;
        break;
      case CONSTANTS.SIGNUP_SUCCESS:
        draft.signup.user = action.data;
        draft.signup.loading = false;
        draft.signup.error = null;
        break;
      case CONSTANTS.SIGNUP_ERROR:
        draft.signup.error = action.error;
        draft.signup.loading = false;
        draft.signup.user = null;
        break;

      case CONSTANTS.RESEND_VERIFICATION_EMAIL_REQUEST:
        draft.resendVerification = { loading: true, error: null };
        break;
      case CONSTANTS.RESEND_VERIFICATION_EMAIL_SUCCESS:
        draft.resendVerification = { loading: false, error: null };
        break;
      case CONSTANTS.RESEND_VERIFICATION_EMAIL_ERROR:
        draft.resendVerification = { loading: false, error: action.error };
        break;

      case CONSTANTS.FORGOT_PASSWORD_REQUEST:
        draft.forgotPassword = { loading: true, error: null };
        break;
      case CONSTANTS.FORGOT_PASSWORD_SUCCESS:
        draft.forgotPassword = { loading: false, error: null };
        break;
      case CONSTANTS.FORGOT_PASSWORD_ERROR:
        draft.forgotPassword = { loading: false, error: action.error };
        break;

      case CONSTANTS.VERIFY_RESET_PASSWORD_TOKEN_REQUEST:
        draft.verifyResetPasswordToken = { loading: true, error: null };
        break;
      case CONSTANTS.VERIFY_RESET_PASSWORD_TOKEN_SUCCESS:
        draft.verifyResetPasswordToken = { loading: false, error: null };
        break;
      case CONSTANTS.VERIFY_RESET_PASSWORD_TOKEN_ERROR:
        draft.verifyResetPasswordToken = {
          loading: false,
          error: action.error,
        };
        break;

      case CONSTANTS.RESET_PASSWORD_REQUEST:
        draft.resetPassword = { loading: true, error: null };
        break;
      case CONSTANTS.RESET_PASSWORD_SUCCESS:
        draft.resetPassword = { loading: false, error: null };
        break;
      case CONSTANTS.RESET_PASSWORD_ERROR:
        draft.resetPassword = { loading: false, error: action.error };
        break;

      case CONSTANTS.REGISTER_COMPANY_REQUEST:
        draft.registerCompany = { loading: true, error: null, company: null };
        break;
      case CONSTANTS.REGISTER_COMPANY_SUCCESS:
        draft.registerCompany = {
          loading: false,
          error: null,
          company: action.data,
        };
        break;
      case CONSTANTS.REGISTER_COMPANY_ERROR:
        draft.registerCompany = {
          loading: false,
          error: action.error,
          company: null,
        };
        break;
      case CONSTANTS.FETCH_COMPANY_DETAIL_BY_EMAIL_REQUEST:
        draft.fetchCompanyDetail = {
          loading: true,
          error: null,
          company: null,
        };
        break;
      case CONSTANTS.FETCH_COMPANY_DETAIL_BY_EMAIL_SUCCESS:
        draft.fetchCompanyDetail = {
          loading: false,
          error: null,
          company: action.data,
        };
        break;
      case CONSTANTS.FETCH_COMPANY_DETAIL_BY_EMAIL_ERROR:
        draft.fetchCompanyDetail = {
          loading: false,
          error: action.error,
          company: null,
        };
        break;
      case CONSTANTS.SIGNOUT:
        draft.token = {
          access: null,
          refresh: null,
        };
        draft.user = null;
        storage.removeItem('persist:auth');
        break;

      case CONSTANTS.INVITATION_ACCEPT_REQUEST:
        draft.invitation.loading = true;
        break;
      case CONSTANTS.INVITATION_ACCEPT_SUCCESS:
        draft.invitation.user = action.payload;
        draft.invitation.loading = false;
        draft.invitation.error = null;
        break;
      case CONSTANTS.INVITATION_ACCEPT_ERROR:
        draft.invitation.user = null;
        draft.invitation.error = action.error;
        draft.invitation.loading = false;
        break;

      case CONSTANTS.ACCEPT_COMPANY_OWNER_INVITATION_REQUEST:
        draft.invitation = { loading: true, error: null, user: null };
        break;
      case CONSTANTS.ACCEPT_COMPANY_OWNER_INVITATION_SUCCESS:
        draft.invitation = {
          loading: false,
          error: null,
          user: action.payload,
        };
        break;
      case CONSTANTS.ACCEPT_COMPANY_OWNER_INVITATION_ERROR:
        draft.invitation = { loading: false, error: action.error, user: null };
        break;

      case CONSTANTS.VERIFY_EMAIL_REQUEST:
        draft.verification = { loading: true, error: null };
        break;
      case CONSTANTS.VERIFY_EMAIL_SUCCESS:
        draft.verification = { loading: false, error: null };
        break;
      case CONSTANTS.VERIFY_EMAIL_ERROR:
        draft.verification = { loading: false, error: action.error };
        break;

      case CONSTANTS.SET_AUTH_USER:
        draft.user = { ...draft.user, ...action.data };
        break;

      case CONSTANTS.SYNC_AUTH_USER_REQUEST:
        draft.syncUser = { loading: true, error: null };
        break;
      case CONSTANTS.SYNC_AUTH_USER_SUCCESS:
        draft.syncUser = { loading: false, error: null };
        draft.user = { ...action.data.user, companies: action.data.company };
        break;
      case CONSTANTS.SYNC_AUTH_USER_FAIL:
        draft.syncUser = { loading: false, error: action.error };
        break;

      case CONSTANTS.VERIFY_MEMO_REQUEST:
        draft.memoVerification.loading = true;
        draft.memoVerification.error = null;
        break;
      case CONSTANTS.VERIFY_MEMO_SUCCESS:
        draft.memoVerification.loading = false;
        draft.memoVerification.error = null;
        break;
      case CONSTANTS.VERIFY_MEMO_FAIL:
        draft.memoVerification.loading = false;
        draft.memoVerification.error = action.error;
        break;
      case COMMON_CONSTANTS.UPDATE_W9_DOCUMENT_SUCCESS:
        draft.user = { ...draft.user, w9Document: action.data };
        break;
      case COMMON_CONSTANTS.REMOVE_W9_DOCUMENT_SUCCESS:
        draft.user = { ...draft.user, w9Document: null };
        break;

      case CONSTANTS.COMPANY_SIGN_OUT_REQUEST:
        draft.companySignOut = {
          loading: true,
          error: null,
          companyId: action.companyId,
        };
        break;
      case CONSTANTS.COMPANY_SIGN_OUT_SUCCESS:
        draft.companySignOut = { loading: false, error: null, companyId: null };
        break;
      case CONSTANTS.COMPANY_SIGN_OUT_FAIL:
        draft.companySignOut = {
          loading: false,
          error: action.error,
          companyId: null,
        };
        break;
      case CONSTANTS.REFRESH_SUCCESS:
        draft.token = {
          access: action.payload,
          refresh:  draft.token.refresh,
        };
        break;
      case CONSTANTS.REFRESH_ERROR:
        draft.signin.error = action.error;
        draft.token = {};
        break;
      case CONSTANTS.DECLINE_BUSINESS_MEMBERS_REQUEST:
        draft.declineBusinessMember.loading = true;
        draft.declineBusinessMember.error = null;
        break;
      case CONSTANTS.DECLINE_BUSINESS_MEMBERS_SUCCESS:
        draft.declineBusinessMember.loading = false;
        draft.declineBusinessMember.error = null;
        break;
      case CONSTANTS.DECLINE_BUSINESS_MEMBERS_FAIL:
        draft.declineBusinessMember.loading = false;
        draft.declineBusinessMember.error = action.error;
        break;
      case CONSTANTS.REGISTER_BUDDI_WALLET_MODAL:
        draft.displayRegisterBuddiWallet = action.visible;
        break;
      case CONSTANTS.CAN_REGISTER_BUDDI_WALLET_MODAL:
        draft.canOpenRegisterBuddiWallet = action.visible;
        break;
      case CONSTANTS.BUDDI_WALLET_REGISTERED_FLAG:
        draft.isBuddiWalletRegister = action.value;
        break;
      case CONSTANTS.TRIGGER_BUDDI_WALLET_MODAL:
        draft.triggers.setupBuddiWallet = action.value;
        break;
      default:
        break;
    }
  });

const authPersistConfig = {
  key: 'auth',
  storage: storage,
  whitelist: ['token', 'user'],
};

export default persistReducer(authPersistConfig, authReducer);
