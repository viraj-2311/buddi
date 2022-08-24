import { put, takeEvery, takeLatest, call, select } from 'redux-saga/effects';
import { deserializeKeys, serializeKeys } from '@iso/lib/helpers/keyNormalizer';
import { USER_SIGNUP, INVITE_SIGNUP } from './constants';
import history from '@iso/lib/helpers/history';
import storage from 'redux-persist/lib/storage';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';
import cloneDeep from 'lodash/cloneDeep';
import { persistor } from '../store';

function* signin(action) {
  try {
    persistor.persist();
    const data = yield call(request, '/token/', 'POST', action.payload, false);
    yield put(ACTIONS.signinSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.signinError(error));
  }
}

function* refreshToken(action) {
  try {
    yield put(ACTIONS.refreshSuccess(serializeKeys(action.payload)));
  } catch (error) {
    yield put(ACTIONS.refreshError(error));
  }
}

function* signout(action) {
  storage.removeItem('persist:auth');
  history.push('/');
}

function* signup(action) {
  try {
    const { payload, signUpType, history } = action;
    const body = cloneDeep(payload);
    if (signUpType === USER_SIGNUP) {
      const data = yield call(
        request,
        `/signup/`,
        'POST',
        deserializeKeys(body),
        false
      );
      yield put(ACTIONS.signupSuccess(serializeKeys(data)));
    } else if (signUpType === INVITE_SIGNUP) {
      yield call(
        request,
        `/user_registration/${payload.id}/`,
        'PATCH',
        deserializeKeys(body),
        false
      );

      history.push('/login');
    }
  } catch (error) {
    yield put(ACTIONS.signupError(error));
  }
}

function* resendVerificationEmail({ payload }) {
  try {
    const data = yield call(
      request,
      `/resend_email/`,
      'POST',
      deserializeKeys(payload),
      false
    );
    yield put(ACTIONS.resendVerificationEmailSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.resendVerificationEmailError(error));
  }
}

function* forgotPassword({ payload }) {
  try {
    const data = yield call(
      request,
      `/forgot_password/`,
      'POST',
      deserializeKeys(payload),
      false
    );
    yield put(ACTIONS.forgotPasswordSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.forgotPasswordError(error));
  }
}

function* verifyResetPasswordToken({ token }) {
  try {
    const data = yield call(
      request,
      `/reset_password/${token}/`,
      'GET',
      null,
      false
    );
    yield put(ACTIONS.verifyResetPasswordTokenSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.verifyResetPasswordTokenError(error));
  }
}

function* resetPassword({ payload }) {
  try {
    const data = yield call(
      request,
      `/reset_password/`,
      'POST',
      deserializeKeys(payload),
      false
    );
    yield put(ACTIONS.resetPasswordSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.resetPasswordError(error));
  }
}

function* registerCompany({ payload }) {
  try {
    const data = yield call(
      request,
      `/company_registration/`,
      'POST',
      deserializeKeys(payload),
      false
    );
    yield put(ACTIONS.registerCompanySuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.registerCompanyFail(error));
  }
}

function* fetchCompanyDetailByEmail({ payload }) {
  try {
    const data = yield call(
      request,
      `/get_production_company_by_email/`,
      'POST',
      deserializeKeys(payload),
      false
    );
    yield put(ACTIONS.fetchCompanyDetailByEmailSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchCompanyDetailByEmailFail(error));
  }
}

function* acceptInvitation(action) {
  try {
    const data = yield call(
      request,
      `/validation/user_signup_token/${action.payload}/`,
      'GET',
      null,
      false
    );
    yield put(ACTIONS.invitationAcceptSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.invitationAcceptError(error.error));
  }
}

function* acceptCompanyOwnerInvitation(action) {
  try {
    const data = yield call(
      request,
      `/invite/verification/${action.payload}/`,
      'GET',
      null,
      false
    );
    yield put(ACTIONS.acceptCompanyOwnerInvitationSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.acceptCompanyOwnerInvitationError(error.error));
  }
}

function* verifyEmail({ token }) {
  try {
    const data = yield call(
      request,
      `/signup/verification/${token}/`,
      'GET',
      null,
      false
    );
    yield put(ACTIONS.verifyEmailSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.verifyEmailError(error.error));
  }
}

function* syncAuthUser(action) {
  try {
    const data = yield call(request, `/auth/profile/`, 'GET', null, true);

    yield put(ACTIONS.syncAuthUserSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.syncAuthUserFail(error.code ?? error.error));
  }
}

function* verifyMemo({ payload }) {
  try {
    const data = yield call(
      request,
      `/validate_memo_invitation_token/`,
      'GET',
      payload,
      false
    );
    yield put(ACTIONS.verifyMemoSuccess(serializeKeys(data)));
    window.location.href = data;
  } catch (error) {
    yield put(ACTIONS.verifyMemoFail(error));
  }
}

function* declineBusinessMembers({ companyId,memberId,token }) {
  try {    
    const data = yield call(
      request,
      `/company/${companyId}/sila/member/${memberId}/${token}`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.declineBusinessMemberSuccess(serializeKeys(data)));
    window.location.href = '/';
  } catch (error) {
    setTimeout(()=>{
      window.location.href = '/';
    },5000)
    yield put(ACTIONS.declineBusinessMemberFail(error));
  }
}

function* companySignOut({ companyId }) {
  console.log('companySignOut');
  try {
    const data = yield call(request, `/company/${companyId}/logout`, 'POST');
    yield put(ACTIONS.companySignOutSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.companySignOutFail(error));
  }
}

export default function* authSaga() {
  yield takeLatest(CONSTANTS.SIGNIN_REQUEST, signin);
  yield takeLatest(CONSTANTS.SIGNUP_REQUEST, signup);
  yield takeLatest(
    CONSTANTS.RESEND_VERIFICATION_EMAIL_REQUEST,
    resendVerificationEmail
  );
  yield takeLatest(CONSTANTS.FORGOT_PASSWORD_REQUEST, forgotPassword);
  yield takeEvery(
    CONSTANTS.VERIFY_RESET_PASSWORD_TOKEN_REQUEST,
    verifyResetPasswordToken
  );
  yield takeLatest(CONSTANTS.RESET_PASSWORD_REQUEST, resetPassword);
  yield takeLatest(CONSTANTS.REGISTER_COMPANY_REQUEST, registerCompany);
  yield takeLatest(
    CONSTANTS.FETCH_COMPANY_DETAIL_BY_EMAIL_REQUEST,
    fetchCompanyDetailByEmail
  );
  yield takeLatest(CONSTANTS.INVITATION_ACCEPT_REQUEST, acceptInvitation);
  yield takeLatest(
    CONSTANTS.ACCEPT_COMPANY_OWNER_INVITATION_REQUEST,
    acceptCompanyOwnerInvitation
  );
  yield takeEvery(CONSTANTS.VERIFY_EMAIL_REQUEST, verifyEmail);
  yield takeLatest(CONSTANTS.SIGNOUT, signout);
  yield takeLatest(CONSTANTS.SYNC_AUTH_USER_REQUEST, syncAuthUser);
  yield takeLatest(CONSTANTS.VERIFY_MEMO_REQUEST, verifyMemo);
  yield takeLatest(CONSTANTS.COMPANY_SIGN_OUT_REQUEST, companySignOut);
  yield takeLatest(CONSTANTS.REFRESH_REQUEST, refreshToken);
  yield takeLatest(CONSTANTS.DECLINE_BUSINESS_MEMBERS_REQUEST, declineBusinessMembers);
}
