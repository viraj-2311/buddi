import { put, takeLatest, call, takeEvery } from 'redux-saga/effects';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import cloneDeep from 'lodash/cloneDeep';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

function* fetchContractorInvoices({ userId, filter }) {
  try {
    const data = yield call(
      request,
      `/user/${userId}/finance/invoices/`,
      'GET',
      deserializeKeys(filter)
    );
    yield put(
      ACTIONS.fetchContractorInvoicesSuccess(serializeKeys(data), filter)
    );
  } catch (error) {
    yield put(ACTIONS.fetchContractorInvoicesFail(error));
  }
}

function* fetchContractorFinanceStats({ userId, filter }) {
  try {
    const data = yield call(
      request,
      `/user/${userId}/finance/statistics/`,
      'GET',
      deserializeKeys(filter)
    );
    yield put(ACTIONS.fetchContractorFinanceStatsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchContractorFinanceStatsFail(error));
  }
}

function* fetchContractorInvoiceDetail({ userId, invoiceId }) {
  try {
    const data = yield call(
      request,
      `/user/${userId}/invoice/${invoiceId}/`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.fetchContractorInvoiceDetailSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchContractorInvoiceDetailFail(error));
  }
}

function* updateContractorInvoice({ invoiceId, payload }) {
  try {
    const data = yield call(
      request,
      `/invoice/${invoiceId}/`,
      'PATCH',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.updateContractorInvoiceSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateContractorInvoiceFail(error));
  }
}

function* createContractorInvoiceReceipt({ userId, invoiceId, payload }) {
  try {
    const data = yield call(
      request,
      `/user/${userId}/invoice/${invoiceId}/receipt/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(
      ACTIONS.createContractorInvoiceReceiptSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.createContractorInvoiceReceiptFail(error));
  }
}

function* updateContractorInvoiceReceipt({ receiptId, payload }) {
  try {
    const data = yield call(
      request,
      `/invoice_receipt/${receiptId}/`,
      'PATCH',
      deserializeKeys(payload),
      true
    );
    yield put(
      ACTIONS.updateContractorInvoiceReceiptSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.updateContractorInvoiceReceiptFail(error));
  }
}

function* deleteContractorInvoiceReceipt({ receiptId, payload }) {
  try {
    const data = yield call(
      request,
      `/invoice_receipt/${receiptId}/`,
      'DELETE',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.deleteContractorInvoiceReceiptSuccess(receiptId));
  } catch (error) {
    yield put(ACTIONS.deleteContractorInvoiceReceiptFail(error));
  }
}

function* createContractorInvoiceDocument({ userId, invoiceId, payload }) {
  try {
    const data = yield call(
      request,
      `/user/${userId}/invoice/${invoiceId}/document/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(
      ACTIONS.createContractorInvoiceDocumentSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.createContractorInvoiceDocumentFail(error));
  }
}

function* updateContractorInvoiceDocument({ documentId, payload }) {
  try {
    const data = yield call(
      request,
      `/invoice_document/${documentId}/`,
      'PATCH',
      deserializeKeys(payload),
      true
    );
    yield put(
      ACTIONS.updateContractorInvoiceDocumentSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.updateContractorInvoiceDocumentFail(error));
  }
}

function* deleteContractorInvoiceDocument({ documentId, payload }) {
  try {
    const data = yield call(
      request,
      `/invoice_document/${documentId}/`,
      'DELETE',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.deleteContractorInvoiceDocumentSuccess(documentId));
  } catch (error) {
    yield put(ACTIONS.deleteContractorInvoiceDocumentFail(error));
  }
}

function* updateContractorInvoiceService({ userId, invoiceId, payload }) {
  try {
    const data = yield call(
      request,
      `/user/${userId}/invoice/${invoiceId}/line_item/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(
      ACTIONS.updateContractorInvoiceServiceSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.updateContractorInvoiceServiceFail(error));
  }
}

function* updateContractorInvoiceBillFrom({ billId, payload }) {
  try {
    const data = yield call(
      request,
      `/invoice_bill_from/${billId}/`,
      'PATCH',
      deserializeKeys(payload),
      true
    );
    yield put(
      ACTIONS.updateContractorInvoiceBillFromSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.updateContractorInvoiceBillFromFail(error));
  }
}

function* updateContractorInvoiceBillTo({ billId, payload }) {
  try {
    const data = yield call(
      request,
      `/invoice_bill_to/${billId}/`,
      'PATCH',
      deserializeKeys(payload),
      true
    );
    yield put(
      ACTIONS.updateContractorInvoiceBillToSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.updateContractorInvoiceBillToFail(error));
  }
}

function* setContractorInvoiceNumber({ userId, invoiceId, payload }) {
  try {
    const data = yield call(
      request,
      `/user/${userId}/invoice/${invoiceId}/update_invoice_number/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.setContractorInvoiceNumberSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.setContractorInvoiceNumberFail(error));
  }
}

function* sendContractorInvoice({ userId, invoiceId }) {
  try {
    const data = yield call(
      request,
      `/user/${userId}/invoice/${invoiceId}/send_invoice/`,
      'POST',
      null,
      true
    );
    yield put(ACTIONS.sendContractorInvoiceSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.sendContractorInvoiceFail(error));
  }
}

function* updateContractorInvoiceJobMemo({ invoiceMemoId, payload }) {
  const body = cloneDeep(payload);
  try {
    const data = yield call(
      request,
      `/invoice_memo/${invoiceMemoId}/`,
      'PATCH',
      deserializeKeys(body),
      true
    );
    yield put(
      ACTIONS.updateContractorInvoiceJobMemoSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.updateContractorInvoiceJobMemoFail(error));
  }
}

function* createInvoice(action) {
  try {
    const { payload } = action;
    const data = yield call(
      request,
      `/user/invoice/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.createInvoiceSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.createInvoiceFail(error));
  }
}

export default function* contractorInvoiceSaga() {
  yield takeLatest(
    CONSTANTS.FETCH_CONTRACTOR_INVOICES_REQUEST,
    fetchContractorInvoices
  );
  yield takeEvery(
    CONSTANTS.FETCH_CONTRACTOR_FINANCE_STATS_REQUEST,
    fetchContractorFinanceStats
  );
  yield takeEvery(
    CONSTANTS.FETCH_CONTRACTOR_INVOICE_DETAIL_REQUEST,
    fetchContractorInvoiceDetail
  );
  yield takeEvery(
    CONSTANTS.UPDATE_CONTRACTOR_INVOICE_REQUEST,
    updateContractorInvoice
  );
  yield takeEvery(
    CONSTANTS.CREATE_CONTRACTOR_INVOICE_RECEIPT_REQUEST,
    createContractorInvoiceReceipt
  );
  yield takeEvery(
    CONSTANTS.UPDATE_CONTRACTOR_INVOICE_RECEIPT_REQUEST,
    updateContractorInvoiceReceipt
  );
  yield takeEvery(
    CONSTANTS.DELETE_CONTRACTOR_INVOICE_RECEIPT_REQUEST,
    deleteContractorInvoiceReceipt
  );
  yield takeEvery(
    CONSTANTS.CREATE_CONTRACTOR_INVOICE_DOCUMENT_REQUEST,
    createContractorInvoiceDocument
  );
  yield takeEvery(
    CONSTANTS.UPDATE_CONTRACTOR_INVOICE_DOCUMENT_REQUEST,
    updateContractorInvoiceDocument
  );
  yield takeEvery(
    CONSTANTS.DELETE_CONTRACTOR_INVOICE_DOCUMENT_REQUEST,
    deleteContractorInvoiceDocument
  );
  yield takeEvery(
    CONSTANTS.UPDATE_CONTRACTOR_INVOICE_SERVICE_REQUEST,
    updateContractorInvoiceService
  );
  yield takeEvery(
    CONSTANTS.UPDATE_CONTRACTOR_INVOICE_BILL_FROM_REQUEST,
    updateContractorInvoiceBillFrom
  );
  yield takeEvery(
    CONSTANTS.UPDATE_CONTRACTOR_INVOICE_BILL_TO_REQUEST,
    updateContractorInvoiceBillTo
  );
  yield takeEvery(
    CONSTANTS.SET_CONTRACTOR_INVOICE_NUMBER_REQUEST,
    setContractorInvoiceNumber
  );
  yield takeEvery(
    CONSTANTS.SEND_CONTRACTOR_INVOICE_REQUEST,
    sendContractorInvoice
  );
  yield takeLatest(
    CONSTANTS.UPDATE_CONTRACTOR_INVOICE_JOB_MEMO_REQUEST,
    updateContractorInvoiceJobMemo
  );
  yield takeLatest(CONSTANTS.CREATE_INVOICE_REQUEST, createInvoice);
}
