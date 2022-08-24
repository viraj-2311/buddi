import {put, takeLatest, call, takeEvery} from 'redux-saga/effects';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

function* fetchJobClient({jobId}) {
  try {
    const data = yield call(request, `/job/${jobId}/client/`, 'GET');
    yield put(ACTIONS.fetchJobClientSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchJobClientFail(error));
  }
}

function* createJobClient({ jobId, payload }) {
  try {
    const data = yield call(request, `/job/${jobId}/client/`, 'POST', deserializeKeys(payload), true);
    yield put(ACTIONS.createJobClientSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.createJobClientFail(error));
  }
}

function* updateJobClient({ clientId, payload }) {
  try {
    const data = yield call(request, `/client/${clientId}/`, 'PATCH', deserializeKeys(payload), true);
    yield put(ACTIONS.updateJobClientSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateJobClientFail(error));
  }
}

export default function* jobClientSaga() {
  yield takeEvery(CONSTANTS.FETCH_JOB_CLIENT_REQUEST, fetchJobClient);
  yield takeEvery(CONSTANTS.CREATE_JOB_CLIENT_REQUEST, createJobClient);
  yield takeEvery(CONSTANTS.UPDATE_JOB_CLIENT_REQUEST, updateJobClient);
}
