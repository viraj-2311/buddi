import * as CONSTANTS from './constants';

// Sign up
export const signupRequest = ({ formData, signUpType, history }) => ({
  type: CONSTANTS.SIGNUP_REQUEST,
  payload: formData,
  signUpType,
  history,
});

export const signupSuccess = (data) => ({
  type: CONSTANTS.SIGNUP_SUCCESS,
  data,
});

export const signupError = (error) => ({
  type: CONSTANTS.SIGNUP_ERROR,
  error,
});

// Resend verification email
export const resendVerificationEmailRequest = (payload) => ({
  type: CONSTANTS.RESEND_VERIFICATION_EMAIL_REQUEST,
  payload,
});

export const resendVerificationEmailSuccess = (data) => ({
  type: CONSTANTS.RESEND_VERIFICATION_EMAIL_SUCCESS,
  data,
});

export const resendVerificationEmailError = (error) => ({
  type: CONSTANTS.RESEND_VERIFICATION_EMAIL_ERROR,
  error,
});

// Register company
export const registerCompanyRequest = ({ formData }) => ({
  type: CONSTANTS.REGISTER_COMPANY_REQUEST,
  payload: formData,
});

export const registerCompanySuccess = (data) => ({
  type: CONSTANTS.REGISTER_COMPANY_SUCCESS,
  data,
});

export const registerCompanyFail = (error) => ({
  type: CONSTANTS.REGISTER_COMPANY_ERROR,
  error,
});

// Fetch company
export const fetchCompanyDetailByEmailRequest = (payload) => ({
  type: CONSTANTS.FETCH_COMPANY_DETAIL_BY_EMAIL_REQUEST,
  payload,
});

export const fetchCompanyDetailByEmailSuccess = (data) => ({
  type: CONSTANTS.FETCH_COMPANY_DETAIL_BY_EMAIL_SUCCESS,
  data,
});

export const fetchCompanyDetailByEmailFail = (error) => ({
  type: CONSTANTS.FETCH_COMPANY_DETAIL_BY_EMAIL_ERROR,
  error,
});

// Sign in
export const signinRequest = (data) => ({
  type: CONSTANTS.SIGNIN_REQUEST,
  payload: data,
});

export const signinSuccess = (data) => ({
  type: CONSTANTS.SIGNIN_SUCCESS,
  payload: data,
});

export const signinError = (error) => ({
  type: CONSTANTS.SIGNIN_ERROR,
  error,
});

export const signout = () => ({
  type: CONSTANTS.SIGNOUT,
});

export const invitationAcceptRequest = (token) => ({
  type: CONSTANTS.INVITATION_ACCEPT_REQUEST,
  payload: token,
});

export const invitationAcceptSuccess = (data) => ({
  type: CONSTANTS.INVITATION_ACCEPT_SUCCESS,
  payload: data,
});

export const invitationAcceptError = (error) => ({
  type: CONSTANTS.INVITATION_ACCEPT_ERROR,
  error,
});

export const acceptCompanyOwnerInvitationRequest = (token) => ({
  type: CONSTANTS.ACCEPT_COMPANY_OWNER_INVITATION_REQUEST,
  payload: token,
});

export const acceptCompanyOwnerInvitationSuccess = (data) => ({
  type: CONSTANTS.ACCEPT_COMPANY_OWNER_INVITATION_SUCCESS,
  payload: data,
});

export const acceptCompanyOwnerInvitationError = (error) => ({
  type: CONSTANTS.ACCEPT_COMPANY_OWNER_INVITATION_ERROR,
  error,
});

// Forgot password actions
export const forgotPasswordRequest = (payload) => ({
  type: CONSTANTS.FORGOT_PASSWORD_REQUEST,
  payload,
});

export const forgotPasswordSuccess = (data) => ({
  type: CONSTANTS.FORGOT_PASSWORD_SUCCESS,
  data,
});

export const forgotPasswordError = (error) => ({
  type: CONSTANTS.FORGOT_PASSWORD_ERROR,
  error,
});

// Reset password actions
export const verifyResetPasswordTokenRequest = (token) => ({
  type: CONSTANTS.VERIFY_RESET_PASSWORD_TOKEN_REQUEST,
  token,
});
export const verifyResetPasswordTokenSuccess = () => ({
  type: CONSTANTS.VERIFY_RESET_PASSWORD_TOKEN_SUCCESS,
});
export const verifyResetPasswordTokenError = (error) => ({
  type: CONSTANTS.VERIFY_RESET_PASSWORD_TOKEN_ERROR,
  error,
});
export const resetPasswordRequest = (payload) => ({
  type: CONSTANTS.RESET_PASSWORD_REQUEST,
  payload,
});
export const resetPasswordSuccess = () => ({
  type: CONSTANTS.RESET_PASSWORD_SUCCESS,
});
export const resetPasswordError = (error) => ({
  type: CONSTANTS.RESET_PASSWORD_ERROR,
  error,
});

export const verifyEmailRequest = (token) => ({
  type: CONSTANTS.VERIFY_EMAIL_REQUEST,
  token,
});

export const verifyEmailSuccess = () => ({
  type: CONSTANTS.VERIFY_EMAIL_SUCCESS,
});

export const verifyEmailError = (error) => ({
  type: CONSTANTS.VERIFY_EMAIL_ERROR,
  error,
});

export const setAuthUser = (data) => ({
  type: CONSTANTS.SET_AUTH_USER,
  data,
});

export const syncAuthUserRequest = () => ({
  type: CONSTANTS.SYNC_AUTH_USER_REQUEST,
});

export const syncAuthUserSuccess = (data) => ({
  type: CONSTANTS.SYNC_AUTH_USER_SUCCESS,
  data,
});

export const syncAuthUserFail = (error) => ({
  type: CONSTANTS.SYNC_AUTH_USER_FAIL,
  error,
});

export const verifyMemoRequest = (payload) => ({
  type: CONSTANTS.VERIFY_MEMO_REQUEST,
  payload,
});

export const verifyMemoSuccess = (data) => ({
  type: CONSTANTS.VERIFY_MEMO_SUCCESS,
  data,
});

export const verifyMemoFail = (error) => ({
  type: CONSTANTS.VERIFY_MEMO_FAIL,
  error,
});

export const checkAuthorization = () => ({
  type: CONSTANTS.CHECK_AUTHORIZATION,
});

export const companySignOutRequest = (companyId) => ({
  type: CONSTANTS.COMPANY_SIGN_OUT_REQUEST,
  companyId,
});

export const companySignOutSuccess = (data) => ({
  type: CONSTANTS.COMPANY_SIGN_OUT_SUCCESS,
  data,
});

export const companySignOutFail = (error) => ({
  type: CONSTANTS.COMPANY_SIGN_OUT_FAIL,
  error,
});

export const refreshSuccess = (data) => ({
  type: CONSTANTS.REFRESH_SUCCESS,
  payload: data,
});

export const refreshError = (error) => ({
  type: CONSTANTS.REFRESH_ERROR,
  error,
});

export const refreshRequest = (payload) => ({
  type: CONSTANTS.REFRESH_REQUEST,
  payload,
});

export const declineBusinessMemberRequest = (companyId,memberId,token) => ({
  type: CONSTANTS.DECLINE_BUSINESS_MEMBERS_REQUEST,
  companyId,
  memberId,
  token
});

export const declineBusinessMemberSuccess = (data) => ({
  type: CONSTANTS.DECLINE_BUSINESS_MEMBERS_SUCCESS,
  data,
});

export const declineBusinessMemberFail = (error) => ({
  type: CONSTANTS.DECLINE_BUSINESS_MEMBERS_FAIL,
  error,
});
export const setDisplayBuddiWallet = (visible) => ({
  type: CONSTANTS.REGISTER_BUDDI_WALLET_MODAL,
  visible
})
export const canOpenBuddiWallet = (visible) => ({
  type: CONSTANTS.CAN_REGISTER_BUDDI_WALLET_MODAL,
  visible
})
export const setIsBuddiWalletRegistered = (value) => ({
  type: CONSTANTS.BUDDI_WALLET_REGISTERED_FLAG,
  value
})
export const triggerSetupBuddiWallet = (value) => ({
  type: CONSTANTS.TRIGGER_BUDDI_WALLET_MODAL,
  value
})