import {put, takeLatest, call, takeEvery} from 'redux-saga/effects';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

function* fetchJobBid({ jobId }) {
  try {
    const data = yield call(request, `/job/${jobId}/bid/`, 'GET', null, true);
    yield put(ACTIONS.fetchJobBidSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchJobBidFail(error));
  }
}

function* createJobBid({ jobId, payload }) {
  try {
    const data = yield call(request, `/job/${jobId}/bid/`, 'POST', deserializeKeys(payload), true);
    yield put(ACTIONS.createJobBidSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.createJobBidFail(error));
  }
}

function* updateJobBid({ bidId, payload }) {
  try {
    const data = yield call(request, `/bid/${bidId}/`, 'PATCH', deserializeKeys(payload), true);
    yield put(ACTIONS.updateJobBidSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateJobBidFail(error));
  }
}

function* deleteJobBid({bidId}) {
  try {
    yield call(request, `/bid/${bidId}/`, 'DELETE');
    yield put(ACTIONS.deleteJobBidSuccess(bidId));
  } catch (error) {
    yield put(ACTIONS.deleteJobBidFail(error));
  }
}

export default function* jobBidSaga() {
  yield takeLatest(CONSTANTS.FETCH_JOB_BID_REQUEST, fetchJobBid);
  yield takeEvery(CONSTANTS.CREATE_JOB_BID_REQUEST, createJobBid);
  yield takeEvery(CONSTANTS.UPDATE_JOB_BID_REQUEST, updateJobBid);
  yield takeEvery(CONSTANTS.DELETE_JOB_BID_REQUEST, deleteJobBid);
}
