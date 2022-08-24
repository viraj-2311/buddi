import {put, takeLatest, call, takeEvery} from 'redux-saga/effects';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

function* fetchJobDocuments({ jobId }) {
  try {
    const data = yield call(request, `/job/${jobId}/document/`, 'GET', null, true);
    yield put(ACTIONS.fetchJobDocumentsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchJobDocumentsFail(error));
  }
}

function* createJobDocument({ jobId, payload }) {
  try {
    const data = yield call(request, `/job/${jobId}/document/`, 'POST', deserializeKeys(payload), true);
    yield put(ACTIONS.createJobDocumentSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.createJobDocumentFail(error));
  }
}

function* updateJobDocument({ documentId, payload }) {
  try {
    const data = yield call(request, `/document/${documentId}/`, 'PATCH', deserializeKeys(payload), true);
    yield put(ACTIONS.updateJobDocumentSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateJobDocumentFail(error));
  }
}

function* deleteJobDocument({documentId}) {
  try {
    yield call(request, `/document/${documentId}/`, 'DELETE');
    yield put(ACTIONS.deleteJobDocumentSuccess(documentId));
  } catch (error) {
    yield put(ACTIONS.deleteJobDocumentFail(error));
  }
}

export default function* jobDocumentSaga() {
  yield takeLatest(CONSTANTS.FETCH_JOB_DOCUMENTS_REQUEST, fetchJobDocuments);
  yield takeEvery(CONSTANTS.CREATE_JOB_DOCUMENT_REQUEST, createJobDocument);
  yield takeEvery(CONSTANTS.UPDATE_JOB_DOCUMENT_REQUEST, updateJobDocument);
  yield takeEvery(CONSTANTS.DELETE_JOB_DOCUMENT_REQUEST, deleteJobDocument);
}
