import {put, takeLatest, call, takeEvery} from 'redux-saga/effects';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

function* fetchJobScripts({ jobId }) {
  try {
    const data = yield call(request, `/job/${jobId}/script/`, 'GET', null, true);
    yield put(ACTIONS.fetchJobScriptsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchJobScriptsFail(error));
  }
}

function* createJobScript({ jobId, payload }) {
  try {
    const data = yield call(request, `/job/${jobId}/script/`, 'POST', deserializeKeys(payload), true);
    yield put(ACTIONS.createJobScriptSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.createJobScriptFail(error));
  }
}

function* updateJobScript({ scriptId, payload }) {
  try {
    const data = yield call(request, `/script/${scriptId}/`, 'PATCH', deserializeKeys(payload), true);
    yield put(ACTIONS.updateJobScriptSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateJobScriptFail(error));
  }
}

function* deleteJobScript({scriptId}) {
  try {
    yield call(request, `/script/${scriptId}/`, 'DELETE');
    yield put(ACTIONS.deleteJobScriptSuccess(scriptId));
  } catch (error) {
    yield put(ACTIONS.deleteJobScriptFail(error));
  }
}

export default function* jobScriptSaga() {
  yield takeLatest(CONSTANTS.FETCH_JOB_SCRIPTS_REQUEST, fetchJobScripts);
  yield takeEvery(CONSTANTS.CREATE_JOB_SCRIPT_REQUEST, createJobScript);
  yield takeEvery(CONSTANTS.UPDATE_JOB_SCRIPT_REQUEST, updateJobScript);
  yield takeEvery(CONSTANTS.DELETE_JOB_SCRIPT_REQUEST, deleteJobScript);
}
