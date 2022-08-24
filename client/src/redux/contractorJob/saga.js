import { put, takeEvery, takeLatest, call } from 'redux-saga/effects';
import cloneDeep from 'lodash/cloneDeep';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import history from '@iso/lib/helpers/history';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

function* acceptOrDeclineJob(action) {
  try {
    const { id, payload } = action;
    const data = yield call(request, `/job_memo/${id}/accept_decline/`, 'POST', deserializeKeys(payload), true);
    yield put(ACTIONS.acceptOrDeclineJobSuccess(serializeKeys({id, ...payload})));
  } catch (error) {
    yield put(ACTIONS.acceptOrDeclineJobFail(error))
  }
}

function* cancelJob(action) {
  try {
    const { id, payload } = action;
    const data = yield call(
      request,
      `/job_memo/${id}/cancel_booked_memo/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.cancelJobSuccess(serializeKeys({ id, ...payload })));
  } catch (error) {
    yield put(ACTIONS.cancelJobFail(error));
  }
}

function* fetchJobs({ contractorId, filter }) {
  try {
    const data = yield call(request, `/user/${contractorId}/job_memos/`, 'GET', filter);
    yield put(ACTIONS.fetchContractorJobsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchContractorJobsFail(error));
  }
}

function* fetchJobDetail({ id }) {
  try {
    const data = yield call(request, `/job_memo/${id}/detail/`, 'GET');
    yield put(ACTIONS.fetchContractorJobDetailSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchContractorJobDetailFail(error));
  }
}

function* updateJob({ jobId, payload }) {
  try {
    const data = yield call(request, `/job_memo/${jobId}/update_hold/`, 'POST', deserializeKeys(payload));
    yield put(ACTIONS.updateContractorJobSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateContractorJobFail(error));
  }
}

function* deleteBulkJob({ jobIds }) {
  try {
    const data = yield call(request, `/job_memo/bulk_delete/`, 'POST', deserializeKeys({ids: jobIds}));
    yield put(ACTIONS.deleteBulkContractorJobSuccess(serializeKeys(jobIds)));
  } catch (error) {
    yield put(ACTIONS.deleteBulkContractorJobFail(error));
  }
}

export default function* contractorJobSaga() {
  yield takeEvery(CONSTANTS.ACCEPT_OR_DECLINE_JOB_REQUEST, acceptOrDeclineJob);
  yield takeEvery(CONSTANTS.CANCEL_JOB_REQUEST, cancelJob);
  yield takeLatest(CONSTANTS.FETCH_CONTRACTOR_JOBS_REQUEST, fetchJobs);
  yield takeLatest(CONSTANTS.FETCH_CONTRACTOR_JOB_DETAIL_REQUEST, fetchJobDetail);
  yield takeEvery(CONSTANTS.UPDATE_CONTRACTOR_JOB_REQUEST, updateJob);
  yield takeEvery(CONSTANTS.DELETE_BULK_CONTRACTOR_JOB_REQUEST, deleteBulkJob);
}
