import {put, takeLatest, call, takeEvery} from 'redux-saga/effects';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

function* fetchJobShootNotes({ jobId, filter }) {
  try {
    const data = yield call(request, `/job/${jobId}/shoot_note_by_date/`, 'GET', deserializeKeys(filter));
    yield put(ACTIONS.fetchJobShootNotesSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchJobShootNotesFail(error));
  }
}

function* createJobShootNote({ jobId, payload }) {
  try {
    const data = yield call(request, `/job/${jobId}/shoot_note/`, 'POST', deserializeKeys(payload));
    yield put(ACTIONS.createJobShootNoteSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.createJobShootNoteFail(error));
  }
}

function* updateShootNote({noteId, payload}) {
  try {
    const data = yield call(request, `/shoot_note/${noteId}/`, 'PATCH', deserializeKeys(payload));
    yield put(ACTIONS.updateShootNoteSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateShootNoteFail(error));
  }
}

function* deleteShootNote({noteId}) {
  try {
    const data = yield call(request, `/shoot_note/${noteId}/`, 'DELETE');
    yield put(ACTIONS.deleteShootNoteSuccess(noteId));
  } catch (error) {
    yield put(ACTIONS.deleteShootNoteFail(error));
  }
}

function* deleteEventNoteImage({noteId, imageIndex}) {
  try {
    const payload = {index: imageIndex};
    const data = yield call(request, `/shoot_note/${noteId}/delete_image/`, 'POST', deserializeKeys(payload));
    yield put(ACTIONS.deleteShootNoteImageSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.deleteShootNoteImageFail(error));
  }
}

export default function* jobShootNoteSaga() {
  yield takeLatest(CONSTANTS.FETCH_JOB_SHOOT_NOTES_REQUEST, fetchJobShootNotes);
  yield takeEvery(CONSTANTS.CREATE_JOB_SHOOT_NOTE_REQUEST, createJobShootNote);
  yield takeEvery(CONSTANTS.UPDATE_SHOOT_NOTE_REQUEST, updateShootNote);
  yield takeEvery(CONSTANTS.DELETE_SHOOT_NOTE_REQUEST, deleteShootNote);
}
