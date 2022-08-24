import { put, takeLatest, takeEvery, call } from 'redux-saga/effects';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

function* fetchPersonalNetworkUsers({ userId }) {
  try {
    const data = yield call(
      request,
      `/user/${userId}/view_personal_network/`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.fetchPersonalNetworkUsersSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchPersonalNetworkUsersFail(error));
  }
}

function* fetchPersonalNetworkUserDetail({ userId }) {
  try {
    const data = yield call(
      request,
      `/personal_network/user/${userId}/`,
      'GET',
      null,
      true
    );
    yield put(
      ACTIONS.fetchPersonalNetworkUserDetailSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.fetchPersonalNetworkUserDetailFail(error));
  }
}

function* deletePersonalNetworkUser({ userId }) {
  try {
    yield call(request, `/personal_network/connection/${userId}/`, 'DELETE');
    yield put(ACTIONS.deletePersonalNetworkUserSuccess(userId));
  } catch (error) {
    yield put(ACTIONS.deletePersonalNetworkUserFail(error));
  }
}

function* invitePersonalNetworkUser(action) {
  try {
    const { userId, payload } = action;
    const data = yield call(
      request,
      `/user/${userId}/personal_network/invite/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.invitePersonalNetworkUserSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.invitePersonalNetworkUserFail(error));
  }
}

function* fetchPersonalNetworkSentInvitation({ userId, filter }) {
  try {
    const data = yield call(
      request,
      `/user/${userId}/personal_network/sent/`,
      'GET',
      deserializeKeys(filter),
      true
    );
    yield put(
      ACTIONS.fetchPersonalNetworkSentInvitationSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.fetchPersonalNetworkSentInvitationFail(error));
  }
}

function* fetchPersonalNetworkReceivedInvitation({ userId, filter }) {
  try {
    const data = yield call(
      request,
      `/user/${userId}/personal_network/received/`,
      'GET',
      deserializeKeys(filter),
      true
    );
    yield put(
      ACTIONS.fetchPersonalNetworkReceivedInvitationSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.fetchPersonalNetworkReceivedInvitationFail(error));
  }
}

function* acceptPersonalNetworkInvitation({ invitationId, source }) {
  try {
    const networkSource = source || 'company_network';
    const url = `/${networkSource}/connection/${invitationId}/accept/`;
    const data = yield call(request, url, 'POST', null, true);
    yield put(
      ACTIONS.acceptPersonalNetworkInvitationSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(
      ACTIONS.acceptPersonalNetworkInvitationFail({ error, invitationId })
    );
  }
}

function* rejectPersonalNetworkInvitation({ invitationId, source }) {
  try {
    const networkSource = source || 'company_network';
    const url = `/${networkSource}/connection/${invitationId}/reject/`;
    const data = yield call(request, url, 'POST', null, true);
    yield put(
      ACTIONS.rejectPersonalNetworkInvitationSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(
      ACTIONS.rejectPersonalNetworkInvitationFail({ error, invitationId })
    );
  }
}

function* setFavoritePersonalNetworkUser({ userId, payload }) {
  try {
    const data = yield call(
      request,
      `/user/${userId}/personal_network/like_unlike/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(
      ACTIONS.setFavoritePersonalNetworkUserSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.setFavoritePersonalNetworkUserFail(error));
  }
}

function* fetchPersonalNetworkConnection({ userId, filter }) {
  try {
    const data = yield call(
      request,
      `/user/${userId}/personal_network/received/`,
      'GET',
      deserializeKeys(filter),
      true
    );
    yield put(
      ACTIONS.fetchPersonalNetworkConnectionsSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.fetchPersonalNetworkConnectionsFail(error));
  }
}

function* deletePersonalNetworkConnection({ connectionId }) {
  try {
    const data = yield call(
      request,
      `/personal_network/connection/${connectionId}/reject/`,
      'POST',
      null,
      true
    );
    yield put(
      ACTIONS.deletePersonalNetworkConnectionSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.deletePersonalNetworkConnectionFail(error));
  }
}

function* deleteCorporateNetworkConnection({ connectionId }) {
  try {
    const data = yield call(
      request,
      `/company_network/connection/${connectionId}/reject/`,
      'POST',
      null,
      true
    );
    yield put(
      ACTIONS.deleteCorporateNetworkConnectionSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.deleteCorporateNetworkConnectionFail(error));
  }
}

function* fetchPersonalNetworkContacts() {
  try {
    const data = yield call(request, `/user_contacts/`, 'GET', null, true);
    yield put(ACTIONS.fetchPersonalNetworkContactsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchPersonalNetworkContactsFail(error));
  }
}

function* bulkAddContacts(action) {
  try {
    const { payload } = action;
    const data = yield call(
      request,
      `/user_contacts/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(
      ACTIONS.bulkPersonalNetworkAddContactsSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.bulkPersonalNetworkAddContactsFail(error));
  }
}

function* deletePersonalNetworkContact({ id }) {
  try {
    yield call(request, `/user_contacts/${id}/`, 'DELETE');
    yield put(ACTIONS.deletePersonalNetworkContactSuccess(id));
  } catch (error) {
    yield put(ACTIONS.deletePersonalNetworkContactFail(error));
  }
}

export default function* personalNetworkSaga() {
  yield takeLatest(
    CONSTANTS.FETCH_PERSONAL_NETWORK_USERS_REQUEST,
    fetchPersonalNetworkUsers
  );
  yield takeLatest(
    CONSTANTS.FETCH_PERSONAL_NETWORK_USER_DETAIL_REQUEST,
    fetchPersonalNetworkUserDetail
  );
  yield takeLatest(
    CONSTANTS.DELETE_PERSONAL_NETWORK_USER_REQUEST,
    deletePersonalNetworkUser
  );
  yield takeEvery(
    CONSTANTS.INVITE_PERSONAL_NETWORK_USER_REQUEST,
    invitePersonalNetworkUser
  );
  yield takeEvery(
    CONSTANTS.FETCH_PERSONAL_NETWORK_SENT_INVITATION_REQUEST,
    fetchPersonalNetworkSentInvitation
  );
  yield takeEvery(
    CONSTANTS.FETCH_PERSONAL_NETWORK_RECEIVED_INVITATION_REQUEST,
    fetchPersonalNetworkReceivedInvitation
  );
  yield takeEvery(
    CONSTANTS.ACCEPT_PERSONAL_NETWORK_INVITATION_REQUEST,
    acceptPersonalNetworkInvitation
  );
  yield takeEvery(
    CONSTANTS.REJECT_PERSONAL_NETWORK_INVITATION_REQUEST,
    rejectPersonalNetworkInvitation
  );
  yield takeEvery(
    CONSTANTS.SET_FAVORITE_PERSONAL_NETWORK_USER_REQUEST,
    setFavoritePersonalNetworkUser
  );
  yield takeEvery(
    CONSTANTS.FETCH_PERSONAL_NETWORK_CONNECTION_REQUEST,
    fetchPersonalNetworkConnection
  );
  yield takeLatest(
    CONSTANTS.DELETE_PERSONAL_NETWORK_CONNECTION_REQUEST,
    deletePersonalNetworkConnection
  );
  yield takeLatest(
    CONSTANTS.DELETE_CORPORATE_NETWORK_CONNECTION_REQUEST,
    deleteCorporateNetworkConnection
  );
  yield takeEvery(
    CONSTANTS.FETCH_PERSONAL_NETWORK_CONTACTS_REQUEST,
    fetchPersonalNetworkContacts
  );
  yield takeEvery(
    CONSTANTS.BULK_ADD_PERSONAL_NETWORK_CONTACTS_REQUEST,
    bulkAddContacts
  );
  yield takeEvery(
    CONSTANTS.DELETE_PERSONAL_NETWORK_CONTACT_REQUEST,
    deletePersonalNetworkContact
  );
}
