import {put, takeLatest, call, takeEvery} from 'redux-saga/effects';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

function* fetchJobEvents({ jobId }) {
  try {
    const data = yield call(request, `/job/${jobId}/event/`, 'GET');
    yield put(ACTIONS.fetchJobEventsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchJobEventsFail(error));
  }
}

function* createJobEvent({ jobId, payload }) {
  try {
    const data = yield call(request, `/job/${jobId}/event/`, 'POST', deserializeKeys(payload));
    yield put(ACTIONS.createJobEventSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.createJobEventFail(error));
  }
}

function* updateEvent({eventId, payload}) {
  try {
    const data = yield call(request, `/event/${eventId}/`, 'PATCH', deserializeKeys(payload));
    yield put(ACTIONS.updateEventSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateEventFail(error));
  }
}

function* deleteEvent({eventId}) {
  try {
    const data = yield call(request, `/event/${eventId}/`, 'DELETE');
    yield put(ACTIONS.deleteEventSuccess(eventId));
  } catch (error) {
    yield put(ACTIONS.deleteEventFail(error));
  }
}

export default function* jobEventSaga() {
  yield takeLatest(CONSTANTS.FETCH_JOB_EVENTS_REQUEST, fetchJobEvents);
  yield takeEvery(CONSTANTS.CREATE_JOB_EVENT_REQUEST, createJobEvent);
  yield takeEvery(CONSTANTS.UPDATE_EVENT_REQUEST, updateEvent);
  yield takeEvery(CONSTANTS.DELETE_EVENT_REQUEST, deleteEvent);
}
