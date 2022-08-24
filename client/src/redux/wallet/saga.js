import { put, takeLatest, takeEvery, call } from 'redux-saga/effects';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request, { downloadRequest } from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';
import _ from 'lodash';

function* getHistoryPayment({ companyId, payload }) {
  try {
    if (!companyId) {
      const data = yield call(
        request,
        `/user/sila_transaction/`,
        'GET',
        deserializeKeys(payload),
        true
      );
      yield put(ACTIONS.getHistoryPaymentSuccess(serializeKeys(data)));
    } else {
      const data = yield call(
        request,
        `/company/${companyId}/sila_transaction/`,
        'GET',
        deserializeKeys(payload),
        true
      );
      yield put(ACTIONS.getHistoryPaymentSuccess(serializeKeys(data)));
    }
  } catch (error) {
    yield put(ACTIONS.getHistoryPaymentFail(error));
  }
}

function* getDownloadHistoryTransactionPdf({ companyId, payload }) {
  try {
    const title = `HistoryTransaction`;
    if (!companyId) {
      const data = yield call(
        downloadRequest,
        `/user/sila_transaction/pdf/`,
        'GET',
        deserializeKeys(payload),
        true
      );
      yield put(ACTIONS.getDownloadHistoryTransactionPdfSuccess(data, title));
    } else {
      const data = yield call(
        downloadRequest,
        `/company/${companyId}/sila_transaction/pdf/`,
        'GET',
        deserializeKeys(payload),
        true
      );
      yield put(ACTIONS.getDownloadHistoryTransactionPdfSuccess(data, title));
    }
  } catch (error) {
    yield put(ACTIONS.getDownloadHistoryTransactionPdfFail(error));
  }
}

function* getFileTransactionFdf({ payload }) {
  try {
    const type = payload.type;
    const transferId = payload.transferID;
    let urlRequest;
    const title = `TransactionPayment_${transferId}`;
    if (type === 'sila_to_fiat') {
      urlRequest = `/transactions/sila_to_fiat/${transferId}/pdf`;
    } else if (type === 'fiat_to_sila') {
      urlRequest = `/transactions/fiat_to_sila/${transferId}/pdf`;
    } else if (type === 'sila_to_sila') {
      urlRequest = `/transactions/sila_to_sila/${transferId}/pdf`;
    }
    const data = yield call(downloadRequest, urlRequest, 'GET', null, true);
    yield put(ACTIONS.getFileTransactionFdfSuccess(data, title));
  } catch (error) {
    yield put(ACTIONS.getFileTransactionFdfFail(error));
  }
}

function* getListRequestPaymentSila({ payload }) {
  try {
    if (payload) {
      let companyId = payload.company_id;
      const data = yield call(
        request,
        `/company/${companyId}/request_sila`,
        'GET',
        null,
        true
      );
      yield put(ACTIONS.getListRequestPaymentSilaSuccess(serializeKeys(data)));
    } else {
      const data = yield call(request, `/user/request_sila`, 'GET', null, true);
      yield put(ACTIONS.getListRequestPaymentSilaSuccess(serializeKeys(data)));
    }
  } catch (error) {
    yield put(ACTIONS.getListRequestPaymentSilaFail(error));
  }
}

function* declineRequestPaymentSila({ payload }) {
  try {
    const companyId = payload.company_id;
    const paymentId = payload.payment_id;
    const ownerRequest = payload.ownerRequest;
    const status = payload.status;
    if (companyId) {
      if (ownerRequest) {
        const payloadData = { requester_status: status };
        const data = yield call(
          request,
          `/company/${companyId}/request_sila/${paymentId}`,
          'PUT',
          payloadData,
          true
        );
        yield put(
          ACTIONS.declineRequestPaymentSilaSuccess(serializeKeys(data))
        );
      } else {
        const payloadData = { requestee_status: status };
        const data = yield call(
          request,
          `/company/${companyId}/request_sila/${paymentId}`,
          'PUT',
          payloadData,
          true
        );
        yield put(
          ACTIONS.declineRequestPaymentSilaSuccess(serializeKeys(data))
        );
      }
    } else {
      if (ownerRequest) {
        const payloadData = { requester_status: status };
        const data = yield call(
          request,
          `/user/request_sila/${paymentId}`,
          'PUT',
          payloadData,
          true
        );
        yield put(
          ACTIONS.declineRequestPaymentSilaSuccess(serializeKeys(data))
        );
      } else {
        const payloadData = { requestee_status: status };
        const data = yield call(
          request,
          `/user/request_sila/${paymentId}`,
          'PUT',
          payloadData,
          true
        );
        yield put(
          ACTIONS.declineRequestPaymentSilaSuccess(serializeKeys(data))
        );
      }
    }
  } catch (error) {
    yield put(ACTIONS.declineRequestPaymentSilaFail(error));
  }
}

function* addManualBankCard({ payload }) {
  try {
    const data = yield call(
      request,
      `/user/sila/account/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.addManualBankCardSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.addManualBankCardFail(error));
  }
}

function* sendNeedHelp({ payload }) {
  try {
    const data = yield call(
      request,
      `/user/need_help/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.sendNeedHelpSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.sendNeedHelpFail(error));
  }
}

export default function* walletSaga() {
  yield takeLatest(CONSTANTS.USER_HISTORY_PAYMENT, getHistoryPayment);
  yield takeLatest(
    CONSTANTS.GET_REQUEST_PAYMENT_SILA,
    getListRequestPaymentSila
  );
  yield takeLatest(
    CONSTANTS.DECLINE_REQUEST_PAYMENT_SILA,
    declineRequestPaymentSila
  );
  yield takeLatest(CONSTANTS.ADD_MANUAL_BANK_CARD, addManualBankCard);
  yield takeLatest(CONSTANTS.GET_FILE_TRANSACTION_PDF, getFileTransactionFdf);
  yield takeLatest(
    CONSTANTS.DOWNLOAD_HISTORY_TRANSACTION_PDF,
    getDownloadHistoryTransactionPdf
  );
  yield takeLatest(CONSTANTS.SEND_NEED_HELP, sendNeedHelp);
}
