import { put, takeLatest, takeEvery, call } from 'redux-saga/effects';
import { serializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request, { downloadRequest } from '@iso/lib/helpers/httpClient';
import { deserializeKeys } from '@iso/lib/helpers/keyNormalizer';

import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

function* fetchCompanyJobs({ companyId }) {
  try {
    const data = yield call(
      request,
      `/company/${companyId}/document/job`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.fetchCompanyJobsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchCompanyJobsFail(error));
  }
}
function* fetchCompanyJobsInvoiceDocuments({ companyId, jobId }) {
  try {
    const data = yield call(
      request,
      `/company/${companyId}/document/job/${jobId}/invoice`,
      'GET',
      null,
      true
    );
    yield put(
      ACTIONS.fetchCompanyJobsInvoiceDocumentSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.fetchCompanyJobsInvoiceDocumentFail(error));
  }
}

function* fetchCompanyJobsW9Documents({ companyId, jobId }) {
  try {
    const data = yield call(
      request,
      `/company/${companyId}/document/job/${jobId}/w9`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.fetchCompanyJobsW9DocumentSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchCompanyJobsW9DocumentFail(error));
  }
}

function* fetchDownloadAllW9AsZip({ jobId, title }) {
  try {
    const data = yield call(
      downloadRequest,
      `/job/${jobId}/documents/download_all_w9_as_zip`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.fetchDownloadAllW9AsZipSuccess(data, title));
  } catch (error) {
    yield put(ACTIONS.fetchDownloadAllW9AsZipFail(error));
  }
}

function* fetchDownloadAllAsZip({ jobId, title }) {
  try {
    const data = yield call(
      downloadRequest,
      `/job/${jobId}/documents/download_all_as_zip`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.fetchDownloadAllAsZipSuccess(data, title));
  } catch (error) {
    yield put(ACTIONS.fetchDownloadAllAsZipFail(error));
  }
}

function* fetchDownloadAllInvoiceAsZip({ jobId, title, payload }) {
  try {
    const data = yield call(
      downloadRequest,
      `/job/${jobId}/documents/download_all_invoice_as_zip`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.fetchDownloadAllInvoiceAsZipSuccess(data, title));
  } catch (error) {
    yield put(ACTIONS.fetchDownloadAllInvoiceAsZipFail(error));
  }
}

function* fetchDownloadInvoice({ invoiceId, title }) {
  try {
    const data = yield call(
      downloadRequest,
      `/invoice/pdf/${invoiceId}/`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.fetchDownloadInvoiceSuccess(data, title));
  } catch (error) {
    yield put(ACTIONS.fetchDownloadInvoiceFail(error));
  }
}

function* fetchDownloadReports({ jobId, title }) {
  try {
    const data = yield call(
      downloadRequest,
      `/job/${jobId}/documents/download_all_as_zip`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.fetchDownloadReportsSuccess(data, title));
  } catch (error) {
    yield put(ACTIONS.fetchDownloadReportsFail(error));
  }
}

function* fetchDownloadArchivedJobs({ jobs }) {
  try {
    const data = yield call(
      downloadRequest,
      '/job/archive/download/',
      'POST',
      {jobs},
      true
    );
    yield put(ACTIONS.fetchDownloadArchiveJobSuccess(data,`Reports_${(jobs||[]).join(',')}_${new Date().getTime()}.zip`));
  } catch (error) {
    console.log(error)
    yield put(ACTIONS.fetchDownloadArchiveJobFail(error));
  }
}

export default function* companyDocumentSaga() {
  yield takeLatest(CONSTANTS.FETCH_COMPANY_JOB_REQUEST, fetchCompanyJobs);
  yield takeLatest(
    CONSTANTS.FETCH_COMPANY_JOB_INVOICE_DOCUMENT_REQUEST,
    fetchCompanyJobsInvoiceDocuments
  );
  yield takeLatest(
    CONSTANTS.FETCH_COMPANY_JOB_W9_DOCUMENT_REQUEST,
    fetchCompanyJobsW9Documents
  );
  yield takeEvery(
    CONSTANTS.FETCH_DOWNLOAD_ALL_W9_AS_ZIP_REQUEST,
    fetchDownloadAllW9AsZip
  );
  yield takeEvery(
    CONSTANTS.FETCH_DOWNLOAD_ALL_INVOICE_AS_ZIP_REQUEST,
    fetchDownloadAllInvoiceAsZip
  );
  yield takeEvery(
    CONSTANTS.FETCH_DOWNLOAD_ALL_AS_ZIP_REQUEST,
    fetchDownloadAllAsZip
  );
  yield takeEvery(
    CONSTANTS.FETCH_DOWNLOAD_INVOICE_REQUEST,
    fetchDownloadInvoice
  );
  yield takeEvery(
    CONSTANTS.FETCH_DOWNLOAD_REPORTS_REQUEST,
    fetchDownloadReports
  );
  yield takeEvery(
    CONSTANTS.FETCH_DOWNLOAD_ARCHIVE_REQUEST,
    fetchDownloadArchivedJobs
  )
}
