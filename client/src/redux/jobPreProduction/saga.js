import {put, takeLatest, call, takeEvery} from 'redux-saga/effects';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

function* fetchJobPPBSettings({ jobId }) {
  try {
    const data = yield call(request, `/job/${jobId}/ppb_settings/`, 'GET', null, true);
    yield put(ACTIONS.fetchJobPPBSettingsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchJobPPBSettingsFail(error));
  }
}

function* setJobPPBSettings({ jobId, settings }) {
  try {
    const data = yield call(request, `/job/${jobId}/ppb_settings/`, 'POST', deserializeKeys(settings), true);
    yield put(ACTIONS.setJobPPBSettingsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.setJobPPBSettingsFail(error));
  }
}

function* resetJobPPBTextStyle({ jobId }) {
  try {
    const data = yield call(request, `/job/${jobId}/ppb_pages/reset/`, 'POST');
    yield put(ACTIONS.resetJobPPBTextStyleSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.resetJobPPBTextStyleFail(error));
  }
}

function* setJobPPBPageOrder({ jobId, order }) {
  try {
    yield call(request, `/job/${jobId}/ppb_pages/ordering/`, 'POST', deserializeKeys(order), true);
    yield put(ACTIONS.setJobPPBPageOrderSuccess(order));
  } catch (error) {
    yield put(ACTIONS.setJobPPBPageOrderFail(error));
  }
}

function* updateJobPPBPage({jobId, payload }) {
  try {
    const data = yield call(request, `/job/${jobId}/ppb_pages/`, 'POST', deserializeKeys(payload), true);
    yield put(ACTIONS.updateJobPPBPageSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateJobPPBPageFail(error));
  }
}

function* deleteJobPPBPage({ jobId, pageKey }) {
  try {
    const data = yield call(request, `/job/${jobId}/ppb_pages/delete/`, 'POST', deserializeKeys(pageKey), true);
    yield put(ACTIONS.deleteJobPPBPageSuccess(pageKey));
  } catch (error) {
    yield put(ACTIONS.deleteJobPPBPageFail(error));
  }
}

function* fetchJobPPBPages({ jobId }) {
  try {
    const data = yield call(request, `/job/${jobId}/ppb_pages/`, 'GET', null, true);
    yield put(ACTIONS.fetchJobPPBContentSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchJobPPBContentFail(error));
  }
}

function* updateJobPPBWatermark({ jobId, payload }) {
  try {
    const data = yield call(request, `/job/${jobId}/ppb_pages/watermark/`, 'POST', deserializeKeys(payload), true);
    yield put(ACTIONS.updateJobPPBWatermarkSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateJobPPBWatermarkFail(error));
  }
}

export default function* jobPreProductionSaga() {
  yield takeLatest(CONSTANTS.FETCH_JOB_PPB_SETTINGS_REQUEST, fetchJobPPBSettings);
  yield takeEvery(CONSTANTS.SET_JOB_PPB_SETTINGS_REQUEST, setJobPPBSettings);
  yield takeEvery(CONSTANTS.RESET_JOB_PPB_TEXT_STYLE_REQUEST, resetJobPPBTextStyle);
  yield takeEvery(CONSTANTS.UPDATE_JOB_PPB_PAGE_REQUEST, updateJobPPBPage);
  yield takeEvery(CONSTANTS.DELETE_JOB_PPB_PAGE_REQUEST, deleteJobPPBPage);
  yield takeLatest(CONSTANTS.FETCH_JOB_PPB_CONTENT_REQUEST, fetchJobPPBPages);
  yield takeEvery(CONSTANTS.SET_JOB_PPB_PAGE_ORDER_REQUEST, setJobPPBPageOrder);
  yield takeEvery(CONSTANTS.UPDATE_JOB_PPB_WATERMARK_REQUEST, updateJobPPBWatermark);
}
