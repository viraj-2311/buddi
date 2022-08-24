import { put, takeLatest, call, takeEvery } from 'redux-saga/effects';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request ,  { downloadRequest }from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

function* fetchJobDealMemos({ jobId }) {
  try {
    const data = yield call(
      request,
      `/job/${jobId}/contractor_deal_memos/`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.fetchJobDealMemosSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchJobDealMemosFail(error));
  }
}

function* fetchJobInvoiceMemos({ jobId }) {
  try {
    const data = yield call(
      request,
      `/job/${jobId}/contractor_invoices/`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.fetchJobInvoiceMemosSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchJobInvoiceMemosFail(error));
  }
}

function* updateInvoiceMemo({ invoiceMemoId, payload }) {
  try {
    const data = yield call(
      request,
      `/invoice_memo/${invoiceMemoId}/`,
      'PATCH',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.updateInvoiceMemoSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateInvoiceMemoFail(error));
  }
}

function* fetchInvoiceByMemo({ jobId, memoId }) {
  try {
    const data = yield call(
      request,
      `/job/${jobId}/job_memo/${memoId}/invoice/`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.fetchInvoiceByMemoSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchInvoiceByMemoFail(error));
  }
}

function* updateInvoice({ jobId, invoiceId, payload }) {
  try {
    const data = yield call(
      request,
      `/job/${jobId}/invoice/${invoiceId}/process/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.updateInvoiceSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateInvoiceFail(error));
  }
}

function* sendJobInvoice({ jobId, payload }) {
  try {
    const data = yield call(
      request,
      `/job/${jobId}/wrap_job/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.sendJobInvoiceSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.sendJobInvoiceFail(error));
  }
}

function* payApprovedInvoicesByWallet({ jobId, payload }) {
  try {
    const data = yield call(
      request,
      `/job/${jobId}/pay_approved/buddi_pay`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.payApprovedInvoiceSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.payApprovedInvoiceFail(error));
  }
}

function* payApprovedInvoicesByBank({ jobId, payload }) {
  try {
    const data = yield call(
      request,
      `/job/${jobId}/pay_approved/bank_pay`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.payApprovedInvoiceSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.payApprovedInvoiceFail(error));
  }
}

function* approveInvoice({ jobId, invoiceId }) {
  try {
    const data = yield call(
      request,
      `/job/${jobId}/invoice/${invoiceId}/approve/`,
      'PATCH',
      true
    );
    yield put(ACTIONS.approveInvoiceSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.approveInvoiceFail(error));
  }
}

function* disputeInvoice({ jobId, invoiceId, payload }) {
  try {
    const data = yield call(
      request,
      `/job/${jobId}/invoice/${invoiceId}/dispute/`,
      'PATCH',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.disputeInvoiceSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.disputeInvoiceFail(error));
  }
}

function* fetchReports({ jobId, payload }) {
  try {
    const data = yield call(
      request,
      `/job/report-preview/${jobId}/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.fetchReportsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchReportsFail(error));
  }
}

function* downloadReports({ jobId, payload }) {
  try {
    const data = yield call(
      downloadRequest,
      `/job/report-preview/${jobId}/download/`,
      'POST',
      deserializeKeys(payload),
      true,
    );
    yield put(ACTIONS.downloadReportsSuccess(data));
  } catch (error) {
    yield put(ACTIONS.downloadReportsFail(error));
  }
}

function* updateWrapPaySelectedOption({ jobId, payload }) {
  try {
    const data = yield call(
      request,
      `/job/${jobId}/wrap_and_pay/`,
      'PUT',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.updateWrapPaySelectOptionSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateWrapPaySelectOptionFail(error));
  }
}

export default function* jobInvoiceSaga() {
  yield takeLatest(CONSTANTS.FETCH_JOB_DEAL_MEMOS_REQUEST, fetchJobDealMemos);
  yield takeLatest(
    CONSTANTS.FETCH_JOB_INVOICE_MEMOS_REQUEST,
    fetchJobInvoiceMemos
  );
  yield takeLatest(CONSTANTS.FETCH_INVOICE_BY_MEMO_REQUEST, fetchInvoiceByMemo);
  yield takeLatest(CONSTANTS.UPDATE_INVOICE_MEMO_REQUEST, updateInvoiceMemo);
  yield takeLatest(CONSTANTS.UPDATE_INVOICE_REQUEST, updateInvoice);
  yield takeLatest(CONSTANTS.SEND_JOB_INVOICE_REQUEST, sendJobInvoice);
  yield takeLatest(CONSTANTS.PAY_APPROVED_INVOICE_BY_WALLET_REQUEST, payApprovedInvoicesByWallet);
  yield takeLatest(CONSTANTS.PAY_APPROVED_INVOICE_BY_BANK_REQUEST, payApprovedInvoicesByBank);
  yield takeLatest(CONSTANTS.APPROVE_INVOICE_REQUEST, approveInvoice);
  yield takeLatest(CONSTANTS.DISPUTE_INVOICE_REQUEST, disputeInvoice);
  yield takeLatest(CONSTANTS.FETCH_REPORTS_REQUEST, fetchReports);
  yield takeLatest(CONSTANTS.DOWNLOAD_REPORTS_REQUEST, downloadReports);
  yield takeLatest(CONSTANTS.UPDATE_WRAP_PAY_SELECTED_OPTION_REQUEST, updateWrapPaySelectedOption);
}
