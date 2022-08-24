import {put, takeLatest, call, takeEvery} from 'redux-saga/effects';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

function* fetchJobAgency({jobId}) {
  try {
    const data = yield call(request, `/job/${jobId}/agency/`, 'GET');
    yield put(ACTIONS.fetchJobAgencySuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchJobAgencyFail(error));
  }
}

function* createJobAgency({ jobId, payload }) {
  try {
    const data = yield call(request, `/job/${jobId}/agency/`, 'POST', deserializeKeys(payload), true);
    yield put(ACTIONS.createJobAgencySuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.createJobAgencyFail(error));
  }
}

function* updateJobAgency({ agencyId, payload }) {
  try {
    const data = yield call(request, `/agency/${agencyId}/`, 'PATCH', deserializeKeys(payload), true);
    yield put(ACTIONS.updateJobAgencySuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateJobAgencyFail(error));
  }
}

export default function* jobAgencySaga() {
  yield takeEvery(CONSTANTS.FETCH_JOB_AGENCY_REQUEST, fetchJobAgency);
  yield takeEvery(CONSTANTS.CREATE_JOB_AGENCY_REQUEST, createJobAgency);
  yield takeEvery(CONSTANTS.UPDATE_JOB_AGENCY_REQUEST, updateJobAgency);
}
