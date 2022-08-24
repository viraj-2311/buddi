import {put, takeLatest, call, takeEvery} from 'redux-saga/effects';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

function* fetchJobEventNoteGroups({ jobId }) {
  try {
    const data = yield call(request, `/job/${jobId}/schedule_group/`, 'GET');
    yield put(ACTIONS.fetchJobEventNoteGroupsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchJobEventNoteGroupsFail(error));
  }
}

function* fetchJobEventNotes({ jobId, filter }) {
  try {
    const data = yield call(request, `/job/${jobId}/schedule_by_date/`, 'GET', deserializeKeys(filter));
    yield put(ACTIONS.fetchJobEventNotesSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchJobEventNotesFail(error));
  }
}

function* createJobEventNote({ jobId, payload }) {
  try {
    const data = yield call(request, `/job/${jobId}/schedule/`, 'POST', deserializeKeys(payload));
    yield put(ACTIONS.createJobEventNoteSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.createJobEventNoteFail(error));
  }
}

function* updateEventNote({noteId, payload}) {
  try {
    const data = yield call(request, `/schedule/${noteId}/`, 'PATCH', deserializeKeys(payload));
    yield put(ACTIONS.updateEventNoteSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateEventNoteFail(error));
  }
}

function* deleteEventNote({noteId}) {
  try {
    const data = yield call(request, `/schedule/${noteId}/`, 'DELETE');
    yield put(ACTIONS.deleteEventNoteSuccess(noteId));
  } catch (error) {
    yield put(ACTIONS.deleteEventNoteFail(error));
  }
}

function* addEventCrew({jobId, eventId, payload}) {
  try {
    const data = yield call(request, `/job/${jobId}/event/${eventId}/add_crew/`, 'POST', deserializeKeys(payload));
    yield put(ACTIONS.addEventCrewSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.addEventCrewFail(error));
  }
}

function* deleteEventNoteImage({noteId, imageIndex}) {
  try {
    const payload = {index: imageIndex};
    const data = yield call(request, `/schedule/${noteId}/delete_image/`, 'POST', deserializeKeys(payload));
    yield put(ACTIONS.deleteEventNoteImageSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.deleteEventNoteImageFail(error));
  }
}

export default function* jobEventNoteSaga() {
  yield takeLatest(CONSTANTS.FETCH_JOB_EVENT_NOTE_GROUPS_REQUEST, fetchJobEventNoteGroups);
  yield takeLatest(CONSTANTS.FETCH_JOB_EVENT_NOTES_REQUEST, fetchJobEventNotes);
  yield takeEvery(CONSTANTS.CREATE_JOB_EVENT_NOTE_REQUEST, createJobEventNote);
  yield takeEvery(CONSTANTS.UPDATE_EVENT_NOTE_REQUEST, updateEventNote);
  yield takeEvery(CONSTANTS.DELETE_EVENT_NOTE_REQUEST, deleteEventNote);
  yield takeEvery(CONSTANTS.ADD_EVENT_CREW_REQUEST, addEventCrew);
  yield takeEvery(CONSTANTS.DELETE_EVENT_NOTE_IMAGE_REQUEST, deleteEventNoteImage);
}
