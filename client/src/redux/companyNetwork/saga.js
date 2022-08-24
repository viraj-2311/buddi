import { put, takeLatest, takeEvery, call } from 'redux-saga/effects';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

function* fetchCompanyNetworkUsers({ companyId }) {
  try {
    const data = yield call(
      request,
      `/company/${companyId}/view_company_network/`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.fetchCompanyNetworkUsersSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchCompanyNetworkUsersFail(error));
  }
}

function* fetchCompanyNetworkUserDetail({ userId }) {
  try {
    const data = yield call(
      request,
      `/company_network/user/${userId}/`,
      'GET',
      null,
      true
    );
    yield put(
      ACTIONS.fetchCompanyNetworkUserDetailSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.fetchCompanyNetworkUserDetailFail(error));
  }
}

function* deleteCompanyNetworkUser({ userId }) {
  try {
    yield call(request, `/company_network/connection/${userId}/`, 'DELETE');
    yield put(ACTIONS.deleteCompanyNetworkUserSuccess(userId));
  } catch (error) {
    yield put(ACTIONS.deleteCompanyNetworkUserFail(error));
  }
}

function* inviteCompanyNetworkUser(action) {
  try {
    const { companyId, payload } = action;
    const data = yield call(
      request,
      `/company/${companyId}/company_network/invite/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.inviteCompanyNetworkUserSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.inviteCompanyNetworkUserFail(error));
  }
}

function* fetchCompanyNetworkSentInvitation({ companyId, filter }) {
  try {
    const data = yield call(
      request,
      `/company/${companyId}/company_network/sent/`,
      'GET',
      deserializeKeys(filter),
      true
    );
    yield put(
      ACTIONS.fetchCompanyNetworkSentInvitationSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.fetchCompanyNetworkSentInvitationFail(error));
  }
}

function* fetchCompanyNetworkReceivedInvitation({ companyId, filter }) {
  try {
    const data = yield call(
      request,
      `/company/${companyId}/company_network/received/`,
      'GET',
      deserializeKeys(filter),
      true
    );
    yield put(
      ACTIONS.fetchCompanyNetworkReceivedInvitationSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.fetchCompanyNetworkReceivedInvitationFail(error));
  }
}

function* acceptCompanyNetworkInvitation({ invitationId }) {
  try {
    const data = yield call(
      request,
      `/company_network/connection/${invitationId}/accept/`,
      'POST',
      null,
      true
    );
    yield put(
      ACTIONS.acceptCompanyNetworkInvitationSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.acceptCompanyNetworkInvitationFail(error));
  }
}

function* rejectCompanyNetworkInvitation({ invitationId }) {
  try {
    const data = yield call(
      request,
      `/company_network/connection/${invitationId}/reject/`,
      'POST',
      null,
      true
    );
    yield put(
      ACTIONS.rejectCompanyNetworkInvitationSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.rejectCompanyNetworkInvitationFail(error));
  }
}

function* setFavoriteCompanyNetworkUser({ companyId, payload }) {
  try {
    const data = yield call(
      request,
      `/company/${companyId}/company_network/like_unlike/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(
      ACTIONS.setFavoriteCompanyNetworkUserSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.setFavoriteCompanyNetworkUserFail(error));
  }
}

function* fetchCompanyNetworkConnection({ companyId, filter }) {
  try {
    const data = yield call(
      request,
      `/company/${companyId}/company_network/received/`,
      'GET',
      deserializeKeys(filter),
      true
    );
    yield put(
      ACTIONS.fetchCompanyNetworkConnectionsSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.fetchCompanyNetworkConnectionsFail(error));
  }
}

function* deleteCompanyNetworkConnection({ connectionId }) {
  try {
    const data = yield call(
      request,
      `/company_network/connection/${connectionId}/reject/`,
      'POST',
      null,
      true
    );
    yield put(
      ACTIONS.deleteCompanyNetworkConnectionSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.deleteCompanyNetworkConnectionFail(error));
  }
}

export default function* CompanyNetworkSaga() {
  yield takeLatest(
    CONSTANTS.FETCH_COMPANY_NETWORK_USERS_REQUEST,
    fetchCompanyNetworkUsers
  );
  yield takeLatest(
    CONSTANTS.FETCH_COMPANY_NETWORK_USER_DETAIL_REQUEST,
    fetchCompanyNetworkUserDetail
  );
  yield takeLatest(
    CONSTANTS.DELETE_COMPANY_NETWORK_USER_REQUEST,
    deleteCompanyNetworkUser
  );
  yield takeEvery(
    CONSTANTS.INVITE_COMPANY_NETWORK_USER_REQUEST,
    inviteCompanyNetworkUser
  );
  yield takeEvery(
    CONSTANTS.FETCH_COMPANY_NETWORK_SENT_INVITATION_REQUEST,
    fetchCompanyNetworkSentInvitation
  );
  yield takeEvery(
    CONSTANTS.FETCH_COMPANY_NETWORK_RECEIVED_INVITATION_REQUEST,
    fetchCompanyNetworkReceivedInvitation
  );
  yield takeEvery(
    CONSTANTS.ACCEPT_COMPANY_NETWORK_INVITATION_REQUEST,
    acceptCompanyNetworkInvitation
  );
  yield takeEvery(
    CONSTANTS.REJECT_COMPANY_NETWORK_INVITATION_REQUEST,
    rejectCompanyNetworkInvitation
  );
  yield takeEvery(
    CONSTANTS.SET_FAVORITE_COMPANY_NETWORK_USER_REQUEST,
    setFavoriteCompanyNetworkUser
  );
  yield takeEvery(
    CONSTANTS.FETCH_COMPANY_NETWORK_CONNECTION_REQUEST,
    fetchCompanyNetworkConnection
  );
  yield takeLatest(
    CONSTANTS.DELETE_COMPANY_NETWORK_CONNECTION_REQUEST,
    deleteCompanyNetworkConnection
  );
}
