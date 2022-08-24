import {put, takeLatest, call, takeEvery} from 'redux-saga/effects';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

function* fetchJobCasts({ jobId }) {
  try {
    const data = yield call(request, `/job/${jobId}/cast/`, 'GET', null, true);
    yield put(ACTIONS.fetchJobCastsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchJobCastsFail(error));
  }
}

function* createJobCast({ jobId, payload }) {
  try {
    const data = yield call(request, `/job/${jobId}/cast/`, 'POST', deserializeKeys(payload), true);
    yield put(ACTIONS.createJobCastSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.createJobCastFail(error));
  }
}

function* updateJobCast({ castId, payload }) {
  try {
    const data = yield call(request, `/cast/${castId}/`, 'PATCH', deserializeKeys(payload), true);
    yield put(ACTIONS.updateJobCastSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateJobCastFail(error));
  }
}

function* deleteJobCast({castId}) {
  try {
    yield call(request, `/cast/${castId}/`, 'DELETE');
    yield put(ACTIONS.deleteJobCastSuccess(castId));
  } catch (error) {
    yield put(ACTIONS.deleteJobCastFail(error));
  }
}

function* createCastWardrobe({ castId, payload }) {
  try {
    const data = yield call(request, `/cast/${castId}/wardrobe/`, 'POST', deserializeKeys(payload), true);
    yield put(ACTIONS.createCastWardrobeSuccess(castId, serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.createCastWardrobeFail(error));
  }
}

function* updateWardrobe({castId, wardrobeId, payload }) {
  try {
    const data = yield call(request, `/wardrobe/${wardrobeId}/`, 'PATCH', deserializeKeys(payload), true);
    yield put(ACTIONS.updateCastWardrobeSuccess(castId, serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateCastWardrobeFail(error));
  }
}

function* deleteWardrobe({castId, wardrobeId}) {
  try {
    yield call(request, `/wardrobe/${wardrobeId}/`, 'DELETE');
    yield put(ACTIONS.deleteWardrobeSuccess(castId, wardrobeId));
  } catch (error) {
    yield put(ACTIONS.deleteCastWardrobeFail(error));
  }
}

export default function* jobCastSaga() {
  yield takeLatest(CONSTANTS.FETCH_JOB_CASTS_REQUEST, fetchJobCasts);
  yield takeEvery(CONSTANTS.CREATE_JOB_CAST_REQUEST, createJobCast);
  yield takeEvery(CONSTANTS.UPDATE_JOB_CAST_REQUEST, updateJobCast);
  yield takeEvery(CONSTANTS.DELETE_JOB_CAST_REQUEST, deleteJobCast);
  yield takeEvery(CONSTANTS.CREATE_CAST_WARDROBE_REQUEST, createCastWardrobe);
  yield takeEvery(CONSTANTS.UPDATE_CAST_WARDROBE_REQUEST, updateWardrobe);
  yield takeEvery(CONSTANTS.DELETE_CAST_WARDROBE_REQUEST, deleteWardrobe);
}
