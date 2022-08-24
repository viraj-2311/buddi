import {put, takeLatest, call, takeEvery} from 'redux-saga/effects';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

function* fetchContractorEventNotes({ userId, filter }) {
  try {
    const data = yield call(request, `/user/${userId}/schedule/`, 'GET', deserializeKeys(filter));
    yield put(ACTIONS.fetchContractorEventNotesSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchContractorEventNotesFail(error));
  }
}

function* fetchContractorShootNotes({ userId, filter }) {
  try {
    const data = yield call(request, `/user/${userId}/shoot_notes/`, 'GET', deserializeKeys(filter));
    yield put(ACTIONS.fetchContractorShootNotesSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchContractorShootNotesFail(error));
  }
}

function* fetchContractorHoldMemos({ userId, filter }) {
  try {
    const data = yield call(request, `/user/${userId}/hold_memos/`, 'GET', deserializeKeys(filter));
    yield put(ACTIONS.fetchContractorHoldMemosSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchContractorHoldMemosFail(error));
  }
}

export default function* contractorScheduleSaga() {
  yield takeLatest(CONSTANTS.FETCH_CONTRACTOR_EVENT_NOTE_REQUEST, fetchContractorEventNotes);
  yield takeEvery(CONSTANTS.FETCH_CONTRACTOR_SHOOT_NOTE_REQUEST, fetchContractorShootNotes);
  yield takeEvery(CONSTANTS.FETCH_CONTRACTOR_HOLD_MEMO_REQUEST, fetchContractorHoldMemos);
}
