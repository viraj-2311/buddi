import {put, takeLatest, call, takeEvery} from 'redux-saga/effects';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

function* fetchJobLocations({ jobId }) {
  try {
    const data = yield call(request, `/job/${jobId}/location/`, 'GET', null, true);
    yield put(ACTIONS.fetchJobLocationsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchJobLocationsFail(error));
  }
}

function* createJobLocation({ jobId, payload }) {
  try {
    const data = yield call(request, `/job/${jobId}/location/`, 'POST', deserializeKeys(payload), true);
    yield put(ACTIONS.createJobLocationSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.createJobLocationFail(error));
  }
}

function* updateJobLocation({ locationId, payload }) {
  try {
    const data = yield call(request, `/location/${locationId}/`, 'PATCH', deserializeKeys(payload), true);
    yield put(ACTIONS.updateJobLocationSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateJobLocationFail(error));
  }
}

function* deleteJobLocation({locationId}) {
  try {
    yield call(request, `/location/${locationId}/`, 'DELETE');
    yield put(ACTIONS.deleteJobLocationSuccess(locationId));
  } catch (error) {
    yield put(ACTIONS.deleteJobLocationFail(error));
  }
}

export default function* jobLocationSaga() {
  yield takeLatest(CONSTANTS.FETCH_JOB_LOCATIONS_REQUEST, fetchJobLocations);
  yield takeEvery(CONSTANTS.CREATE_JOB_LOCATION_REQUEST, createJobLocation);
  yield takeEvery(CONSTANTS.UPDATE_JOB_LOCATION_REQUEST, updateJobLocation);
  yield takeEvery(CONSTANTS.DELETE_JOB_LOCATION_REQUEST, deleteJobLocation);
}
