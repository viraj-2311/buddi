import { put, takeEvery, takeLatest, call } from 'redux-saga/effects';
import { deserializeKeys, serializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';
import cloneDeep from 'lodash/cloneDeep';

function* fetchAccountJobs({ accountId, jobType }) {
  try {
    const filter = {status: jobType};
    const data = yield call(request, `/user/${accountId}/job_memos/`, 'GET', filter);
    yield put(ACTIONS.fetchAccountJobsSuccess(jobType, serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchAccountJobsFail(error));
  }
}

function* fetchAccountCallsheets({ accountId, filter }) {
  try {
    const data = yield call(request, `/user/${accountId}/callsheets/`, 'GET', deserializeKeys(filter));
    yield put(ACTIONS.fetchAccountCallsheetsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchAccountCallsheetsFail(error));
  }
}

function* fetchAccountNetworkInvitations({ accountId, filter }) {
  try {
    const data = yield call(request, `/user/${accountId}/personal_network/received/`, 'GET', deserializeKeys(filter));
    yield put(ACTIONS.fetchAccountNetworkInvitationsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchAccountNetworkInvitationsFail(error));
  }
}

export default function* accountBoardSaga() {
  yield takeEvery(CONSTANTS.FETCH_ACCOUNT_JOBS_REQUEST, fetchAccountJobs);
  yield takeEvery(CONSTANTS.FETCH_ACCOUNT_CALLSHEETS_REQUEST, fetchAccountCallsheets);
  yield takeEvery(CONSTANTS.FETCH_ACCOUNT_NETWORK_INVITATIONS_REQUEST, fetchAccountNetworkInvitations);
}
