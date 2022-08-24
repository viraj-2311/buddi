import * as CONSTANTS from './constants';

export const fetchJobDealMemosRequest = (jobId) => ({
  type: CONSTANTS.FETCH_JOB_DEAL_MEMOS_REQUEST,
  jobId,
});

export const fetchJobDealMemosSuccess = (data) => ({
  type: CONSTANTS.FETCH_JOB_DEAL_MEMOS_SUCCESS,
  data,
});

export const fetchJobDealMemosFail = (error) => ({
  type: CONSTANTS.FETCH_JOB_DEAL_MEMOS_FAIL,
  error,
});

export const fetchJobInvoiceMemosRequest = (jobId) => ({
  type: CONSTANTS.FETCH_JOB_INVOICE_MEMOS_REQUEST,
  jobId,
});

export const fetchJobInvoiceMemosInitializeJob = () => ({
  type: CONSTANTS.JOB_INVOICE_MEMOS_INITIALIZE,
});

export const fetchJobInvoiceMemosSuccess = (data) => ({
  type: CONSTANTS.FETCH_JOB_INVOICE_MEMOS_SUCCESS,
  data,
});

export const fetchJobInvoiceMemosFail = (error) => ({
  type: CONSTANTS.FETCH_JOB_INVOICE_MEMOS_FAIL,
  error,
});

export const updateInvoiceMemoRequest = (invoiceMemoId, payload) => ({
  type: CONSTANTS.UPDATE_INVOICE_MEMO_REQUEST,
  invoiceMemoId,
  payload,
});

export const updateInvoiceMemoSuccess = (data) => ({
  type: CONSTANTS.UPDATE_INVOICE_MEMO_SUCCESS,
  data,
});

export const updateInvoiceMemoFail = (error) => ({
  type: CONSTANTS.UPDATE_INVOICE_MEMO_FAIL,
  error,
});

export const sendJobInvoiceRequest = (jobId, payload) => ({
  type: CONSTANTS.SEND_JOB_INVOICE_REQUEST,
  jobId,
  payload,
});

export const sendJobInvoiceSuccess = (data) => ({
  type: CONSTANTS.SEND_JOB_INVOICE_SUCCESS,
  data,
});

export const sendJobInvoiceFail = (error) => ({
  type: CONSTANTS.SEND_JOB_INVOICE_FAIL,
  error,
});

export const fetchInvoiceByMemoRequest = (jobId, memoId) => ({
  type: CONSTANTS.FETCH_INVOICE_BY_MEMO_REQUEST,
  jobId,
  memoId,
});

export const fetchInvoiceByMemoSuccess = (data) => ({
  type: CONSTANTS.FETCH_INVOICE_BY_MEMO_SUCCESS,
  data,
});

export const fetchInvoiceByMemoFail = (error) => ({
  type: CONSTANTS.FETCH_INVOICE_BY_MEMO_FAIL,
  error,
});

export const updateInvoiceRequest = (jobId, invoiceId, payload) => ({
  type: CONSTANTS.UPDATE_INVOICE_REQUEST,
  jobId,
  invoiceId,
  payload,
});

export const updateInvoiceSuccess = (data) => ({
  type: CONSTANTS.UPDATE_INVOICE_SUCCESS,
  data,
});

export const updateInvoiceFail = (error) => ({
  type: CONSTANTS.UPDATE_INVOICE_FAIL,
  error,
});

export const payApprovedInvoiceByWalletRequest = (jobId, payload) => ({
  type: CONSTANTS.PAY_APPROVED_INVOICE_BY_WALLET_REQUEST,
  jobId,
  payload,
});

export const payApprovedInvoiceByBankRequest = (jobId, payload) => ({
  type: CONSTANTS.PAY_APPROVED_INVOICE_BY_BANK_REQUEST,
  jobId,
  payload,
});

export const payApprovedInvoiceSuccess = (data) => ({
  type: CONSTANTS.PAY_APPROVED_INVOICE_SUCCESS,
  data,
});

export const payApprovedInvoiceFail = (error) => ({
  type: CONSTANTS.PAY_APPROVED_INVOICE_FAIL,
  error,
});

export const payApprovedInvoiceReset = () => ({
  type: CONSTANTS.PAY_APPROVED_INVOICE_RESET,
});

export const approveInvoiceRequest = (jobId, invoiceId) => ({
  type: CONSTANTS.APPROVE_INVOICE_REQUEST,
  jobId,
  invoiceId,
});

export const approveInvoiceSuccess = (data) => ({
  type: CONSTANTS.APPROVE_INVOICE_SUCCESS,
  data,
});

export const approveInvoiceFail = (error) => ({
  type: CONSTANTS.APPROVE_INVOICE_FAIL,
  error,
});

export const disputeInvoiceRequest = (jobId, invoiceId, payload) => ({
  type: CONSTANTS.DISPUTE_INVOICE_REQUEST,
  jobId,
  invoiceId,
  payload,
});

export const disputeInvoiceSuccess = (data) => ({
  type: CONSTANTS.DISPUTE_INVOICE_SUCCESS,
  data,
});

export const disputeInvoiceFail = (error) => ({
  type: CONSTANTS.DISPUTE_INVOICE_FAIL,
  error,
});

export const fetchReportsRequest = (jobId, payload) => ({
  type: CONSTANTS.FETCH_REPORTS_REQUEST,
  jobId,
  payload
});

export const fetchReportsSuccess = (data) => ({
  type: CONSTANTS.FETCH_REPORTS_SUCCESS,
  data,
});

export const fetchReportsFail = (error) => ({
  type: CONSTANTS.FETCH_REPORTS_FAIL,
  error,
});

export const downloadReportsRequest = (jobId, payload) => ({
  type: CONSTANTS.DOWNLOAD_REPORTS_REQUEST,
  jobId,
  payload
});

export const downloadReportsSuccess = (data) => ({
  type: CONSTANTS.DOWNLOAD_REPORTS_SUCCESS,
  data
});

export const downloadReportsFail = (error) => ({
  type: CONSTANTS.DOWNLOAD_REPORTS_FAIL,
  error,
});

export const updateWrapPaySelectOptionRequest = (jobId, payload) => ({
  type: CONSTANTS.UPDATE_WRAP_PAY_SELECTED_OPTION_REQUEST,
  jobId,
  payload
});

export const updateWrapPaySelectOptionSuccess = (data) => ({
  type: CONSTANTS.UPDATE_WRAP_PAY_SELECTED_OPTION_SUCCESS,
  data,
});

export const updateWrapPaySelectOptionFail = (error) => ({
  type: CONSTANTS.UPDATE_WRAP_PAY_SELECTED_OPTION_FAIL,
  error,
});