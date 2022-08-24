import {put, takeLatest, call, takeEvery} from 'redux-saga/effects';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

function* fetchProductionContacts({ jobId }) {
  try {
    const data = yield call(request, `/job/${jobId}/production_contact/`, 'GET');
    yield put(ACTIONS.fetchProductionContactsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchProductionContactsFail(error));
  }
}

function* fetchCrews({ jobId }) {
  try {
    const data = yield call(request, `/job/${jobId}/crews/`, 'GET');
    yield put(ACTIONS.fetchCrewsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchCrewsFail(error));
  }
}

function* fetchFullview({ jobId, filter = {} }) {
  try {
    const data = yield call(request, `/job/${jobId}/callsheet_by_date/`, 'GET', filter);
    yield put(ACTIONS.fetchFullviewSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchFullviewFail(error));
  }
}

function* fetchPrintView({ jobId, filter = {} }) {
  try {
    const data = yield call(request, `/job/${jobId}/preview_callsheet/`, 'GET', filter);
    yield put(ACTIONS.fetchPrintViewSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchPrintViewFail(error));
  }
}

function* createCallsheet({ jobId, payload }) {
  try {
    const data = yield call(request, `/job/${jobId}/callsheet/`, 'POST', deserializeKeys(payload));
    yield put(ACTIONS.createCallsheetSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.createCallsheetFail(error));
  }
}

function* updateCallsheet({ jobId, callsheetId, payload }) {
  try {
    const data = yield call(request, `/job/${jobId}/callsheet_jobmemo/${callsheetId}/`, 'PATCH', deserializeKeys(payload));
    yield put(ACTIONS.updateCallsheetSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateCallsheetFail(error));
  }
}

function* deleteCallsheet({ jobId, callsheetId }) {
  try {
    yield call(request, `/job/${jobId}/callsheet_jobmemo/${callsheetId}/`, 'DELETE');
    yield put(ACTIONS.deleteCallsheetSuccess(callsheetId));
  } catch (error) {
    yield put(ACTIONS.deleteCallsheetFail(error));
  }
}

function* deleteBulkCallsheet({ jobId, callsheetIds }) {
  const payload = {ids: callsheetIds};
  try {
    yield call(request, `/job/${jobId}/remove_callsheet_jobmemos/`, 'POST', deserializeKeys(payload));
    yield put(ACTIONS.deleteBulkCallsheetSuccess(callsheetIds));
  } catch (error) {
    yield put(ACTIONS.deleteBulkCallsheetFail(error));
  }
}

function* sendCallsheet({ jobId, payload }) {
  try {
    const data = yield call(request, `/job/${jobId}/send_callsheet/`, 'POST', deserializeKeys(payload));
    yield put(ACTIONS.sendCallsheetSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.sendCallsheetFail(error));
  }
}

function* fetchCallsheetDates({ jobId }) {
  try {
    const data = yield call(request, `/job/${jobId}/callsheet/dates/`, 'GET');
    yield put(ACTIONS.fetchCallsheetDatesSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchCallsheetDatesFail(error));
  }
}

function* fetchUserCallsheets({ userId, filter }) {
  try {
    const data = yield call(request, `/user/${userId}/callsheets/`, 'GET', deserializeKeys(filter));
    yield put(ACTIONS.fetchUserCallsheetsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchUserCallsheetsFail(error));
  }
}

function* fetchCallsheetDetail({ callsheetId }) {
  try {
    const data = yield call(request, `/callsheet/${callsheetId}/`, 'GET');
    yield put(ACTIONS.fetchCallsheetDetailSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchCallsheetDetailFail(error));
  }
}

function* acceptCallsheet({ callsheetId, payload }) {
  try {
    const data = yield call(request, `/callsheet/${callsheetId}/accept/`, 'POST', deserializeKeys(payload), true);
    yield put(ACTIONS.acceptCallsheetSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.acceptCallsheetFail(error));
  }
}

export default function* jobLocationSaga() {
  yield takeEvery(CONSTANTS.FETCH_PRODUCTION_CONTACTS_REQUEST, fetchProductionContacts);
  yield takeEvery(CONSTANTS.FETCH_CREWS_REQUEST, fetchCrews);
  yield takeLatest(CONSTANTS.FETCH_FULLVIEW_REQUEST, fetchFullview);
  yield takeLatest(CONSTANTS.FETCH_PRINT_VIEW_REQUEST, fetchPrintView);
  yield takeEvery(CONSTANTS.CREATE_CALLSHEET_REQUEST, createCallsheet);
  yield takeEvery(CONSTANTS.UPDATE_CALLSHEET_REQUEST, updateCallsheet);
  yield takeEvery(CONSTANTS.DELETE_CALLSHEET_REQUEST, deleteCallsheet);
  yield takeEvery(CONSTANTS.DELETE_BULK_CALLSHEET_REQUEST, deleteBulkCallsheet);
  yield takeEvery(CONSTANTS.SEND_CALLSHEET_REQUEST, sendCallsheet);
  yield takeEvery(CONSTANTS.FETCH_CALLSHEET_DATES_REQUEST, fetchCallsheetDates);
  yield takeEvery(CONSTANTS.FETCH_USER_CALLSHEETS_REQUEST, fetchUserCallsheets);
  yield takeEvery(CONSTANTS.FETCH_CALLSHEET_DETAIL_REQUEST, fetchCallsheetDetail);
  yield takeEvery(CONSTANTS.ACCEPT_CALLSHEET_REQUEST, acceptCallsheet);
}
