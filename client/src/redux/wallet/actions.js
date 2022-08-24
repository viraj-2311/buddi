import * as CONSTANTS from './constants';
import * as COMMON_CONSTANTS from '../constants';

export const getHistoryPayment = (companyId, data) => ({
  type: CONSTANTS.USER_HISTORY_PAYMENT,
  companyId: companyId,
  payload: data,
});

export const getHistoryPaymentSuccess = (data) => ({
  type: CONSTANTS.USER_HISTORY_PAYMENT_SUCCESS,
  data,
});

export const getHistoryPaymentFail = (error) => ({
  type: CONSTANTS.USER_HISTORY_PAYMENT_FAIL,
  error,
});

export const getListRequestPaymentSila = (data) => ({
  type: CONSTANTS.GET_REQUEST_PAYMENT_SILA,
  payload: data,
});
export const getListRequestPaymentSilaSuccess = (data) => ({
  type: CONSTANTS.GET_REQUEST_PAYMENT_SILA_SUCCESS,
  data,
});
export const getListRequestPaymentSilaFail = (error) => ({
  type: CONSTANTS.GET_REQUEST_PAYMENT_SILA_FAIL,
  error,
});

export const declineRequestPaymentSila = (data) => ({
  type: CONSTANTS.DECLINE_REQUEST_PAYMENT_SILA,
  payload: data,
});
export const declineRequestPaymentSilaSuccess = (data) => ({
  type: CONSTANTS.DECLINE_REQUEST_PAYMENT_SILA_SUCCESS,
  data,
});
export const declineRequestPaymentSilaFail = (error) => ({
  type: CONSTANTS.DECLINE_REQUEST_PAYMENT_SILA_FAIL,
  error,
});

export const addManualBankCard = (data) => ({
  type: CONSTANTS.ADD_MANUAL_BANK_CARD,
  payload: data,
});
export const addManualBankCardSuccess = (data) => ({
  type: CONSTANTS.ADD_MANUAL_BANK_CARD_SUCCESS,
  data,
});
export const addManualBankCardFail = (error) => ({
  type: CONSTANTS.ADD_MANUAL_BANK_CARD_FAIL,
  error,
});

export const getFileTransactionFdf = (data) => ({
  type: CONSTANTS.GET_FILE_TRANSACTION_PDF,
  payload: data,
});
export const getFileTransactionFdfSuccess = (data, title) => ({
  type: CONSTANTS.GET_FILE_TRANSACTION_PDF_SUCCESS,
  data,
  title,
});
export const getFileTransactionFdfFail = (error) => ({
  type: CONSTANTS.GET_FILE_TRANSACTION_PDF_FAIL,
  error,
});

export const sendNeedHelp = (data) => ({
  type: CONSTANTS.SEND_NEED_HELP,
  payload: data,
});
export const sendNeedHelpSuccess = (data, title) => ({
  type: CONSTANTS.SEND_NEED_HELP_SUCCESS,
  data,
  title,
});
export const sendNeedHelpFail = (error) => ({
  type: CONSTANTS.SEND_NEED_HELP_FAIL,
  error,
});

export const getDownloadHistoryTransactionPdf = (companyId, data) => ({
  type: CONSTANTS.DOWNLOAD_HISTORY_TRANSACTION_PDF,
  companyId: companyId,
  payload: data,
});
export const getDownloadHistoryTransactionPdfSuccess = (data, title) => ({
  type: CONSTANTS.DOWNLOAD_HISTORY_TRANSACTION_PDF_SUCCESS,
  data,
  title,
});
export const getDownloadHistoryTransactionPdfFail = (error) => ({
  type: CONSTANTS.DOWNLOAD_HISTORY_TRANSACTION_PDF_FAIL,
  error,
});
