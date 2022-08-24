import * as CONSTANTS from './constants';

export const fetchContractorInvoicesRequest = (userId, filter) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_INVOICES_REQUEST,
  userId,
  filter,
});

export const fetchContractorInvoicesSuccess = (data, filter) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_INVOICES_SUCCESS,
  data,
  filter,
});

export const fetchContractorInvoicesFail = (error) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_INVOICES_FAIL,
  error,
});

export const fetchContractorFinanceStatsRequest = (userId, filter) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_FINANCE_STATS_REQUEST,
  userId,
  filter,
});

export const fetchContractorFinanceStatsSuccess = (data) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_FINANCE_STATS_SUCCESS,
  data,
});

export const fetchContractorFinanceStatsFail = (error) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_FINANCE_STATS_FAIL,
  error,
});

export const fetchContractorInvoiceDetailRequest = (userId, invoiceId) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_INVOICE_DETAIL_REQUEST,
  userId,
  invoiceId,
});

export const fetchContractorInvoiceDetailSuccess = (data) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_INVOICE_DETAIL_SUCCESS,
  data,
});

export const fetchContractorInvoiceDetailFail = (error) => ({
  type: CONSTANTS.FETCH_CONTRACTOR_INVOICE_DETAIL_FAIL,
  error,
});

export const updateContractorInvoiceRequest = (userId, invoiceId, payload) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_INVOICE_REQUEST,
  userId,
  invoiceId,
  payload,
});

export const updateContractorInvoiceSuccess = (data) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_INVOICE_SUCCESS,
  data,
});

export const updateContractorInvoiceFail = (error) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_INVOICE_FAIL,
  error,
});

export const createContractorInvoiceReceiptRequest = (
  userId,
  invoiceId,
  payload
) => ({
  type: CONSTANTS.CREATE_CONTRACTOR_INVOICE_RECEIPT_REQUEST,
  userId,
  invoiceId,
  payload,
});

export const createContractorInvoiceReceiptSuccess = (data) => ({
  type: CONSTANTS.CREATE_CONTRACTOR_INVOICE_RECEIPT_SUCCESS,
  data,
});

export const createContractorInvoiceReceiptFail = (error) => ({
  type: CONSTANTS.CREATE_CONTRACTOR_INVOICE_RECEIPT_FAIL,
  error,
});

export const updateContractorInvoiceReceiptRequest = (receiptId, payload) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_INVOICE_RECEIPT_REQUEST,
  receiptId,
  payload,
});

export const updateContractorInvoiceReceiptSuccess = (data) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_INVOICE_RECEIPT_SUCCESS,
  data,
});

export const updateContractorInvoiceReceiptFail = (error) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_INVOICE_RECEIPT_FAIL,
  error,
});

export const deleteContractorInvoiceReceiptRequest = (receiptId) => ({
  type: CONSTANTS.DELETE_CONTRACTOR_INVOICE_RECEIPT_REQUEST,
  receiptId,
});

export const deleteContractorInvoiceReceiptSuccess = (data) => ({
  type: CONSTANTS.DELETE_CONTRACTOR_INVOICE_RECEIPT_SUCCESS,
  data,
});

export const deleteContractorInvoiceReceiptFail = (error) => ({
  type: CONSTANTS.DELETE_CONTRACTOR_INVOICE_RECEIPT_FAIL,
  error,
});

export const createContractorInvoiceDocumentRequest = (
  userId,
  invoiceId,
  payload
) => ({
  type: CONSTANTS.CREATE_CONTRACTOR_INVOICE_DOCUMENT_REQUEST,
  userId,
  invoiceId,
  payload,
});

export const createContractorInvoiceDocumentSuccess = (data) => ({
  type: CONSTANTS.CREATE_CONTRACTOR_INVOICE_DOCUMENT_SUCCESS,
  data,
});

export const createContractorInvoiceDocumentFail = (error) => ({
  type: CONSTANTS.CREATE_CONTRACTOR_INVOICE_DOCUMENT_FAIL,
  error,
});

export const updateContractorInvoiceDocumentRequest = (
  documentId,
  payload
) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_INVOICE_DOCUMENT_REQUEST,
  documentId,
  payload,
});

export const updateContractorInvoiceDocumentSuccess = (data) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_INVOICE_DOCUMENT_SUCCESS,
  data,
});

export const updateContractorInvoiceDocumentFail = (error) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_INVOICE_DOCUMENT_FAIL,
  error,
});

export const deleteContractorInvoiceDocumentRequest = (
  documentId,
  payload
) => ({
  type: CONSTANTS.DELETE_CONTRACTOR_INVOICE_DOCUMENT_REQUEST,
  documentId,
});

export const deleteContractorInvoiceDocumentSuccess = (data) => ({
  type: CONSTANTS.DELETE_CONTRACTOR_INVOICE_DOCUMENT_SUCCESS,
  data,
});

export const deleteContractorInvoiceDocumentFail = (error) => ({
  type: CONSTANTS.DELETE_CONTRACTOR_INVOICE_DOCUMENT_FAIL,
  error,
});

export const updateContractorInvoiceServiceRequest = (
  userId,
  invoiceId,
  payload
) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_INVOICE_SERVICE_REQUEST,
  userId,
  invoiceId,
  payload,
});

export const updateContractorInvoiceServiceSuccess = (data) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_INVOICE_SERVICE_SUCCESS,
  data,
});

export const updateContractorInvoiceServiceFail = (error) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_INVOICE_SERVICE_FAIL,
  error,
});

export const updateContractorInvoiceBillFromRequest = (billId, payload) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_INVOICE_BILL_FROM_REQUEST,
  billId,
  payload,
});

export const updateContractorInvoiceBillFromSuccess = (data) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_INVOICE_BILL_FROM_SUCCESS,
  data,
});

export const updateContractorInvoiceBillFromFail = (error) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_INVOICE_BILL_FROM_FAIL,
  error,
});

export const updateContractorInvoiceBillToRequest = (billId, payload) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_INVOICE_BILL_TO_REQUEST,
  billId,
  payload,
});

export const updateContractorInvoiceBillToSuccess = (data) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_INVOICE_BILL_TO_SUCCESS,
  data,
});

export const updateContractorInvoiceBillToFail = (error) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_INVOICE_BILL_TO_FAIL,
  error,
});

export const setContractorInvoiceNumberRequest = (
  userId,
  invoiceId,
  payload
) => ({
  type: CONSTANTS.SET_CONTRACTOR_INVOICE_NUMBER_REQUEST,
  userId,
  invoiceId,
  payload,
});

export const setContractorInvoiceNumberSuccess = (data) => ({
  type: CONSTANTS.SET_CONTRACTOR_INVOICE_NUMBER_SUCCESS,
  data,
});

export const setContractorInvoiceNumberFail = (error) => ({
  type: CONSTANTS.SET_CONTRACTOR_INVOICE_NUMBER_FAIL,
  error,
});

export const sendContractorInvoiceRequest = (userId, invoiceId) => ({
  type: CONSTANTS.SEND_CONTRACTOR_INVOICE_REQUEST,
  userId,
  invoiceId,
});

export const sendContractorInvoiceSuccess = (data) => ({
  type: CONSTANTS.SEND_CONTRACTOR_INVOICE_SUCCESS,
  data,
});

export const sendContractorInvoiceFail = (error) => ({
  type: CONSTANTS.SEND_CONTRACTOR_INVOICE_FAIL,
  error,
});

export const updateContractorInvoiceJobMemoRequest = (
  invoiceMemoId,
  payload
) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_INVOICE_JOB_MEMO_REQUEST,
  invoiceMemoId,
  payload,
});

export const updateContractorInvoiceJobMemoSuccess = (data) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_INVOICE_JOB_MEMO_SUCCESS,
  payload: data,
});

export const updateContractorInvoiceJobMemoFail = (error) => ({
  type: CONSTANTS.UPDATE_CONTRACTOR_INVOICE_JOB_MEMO_FAIL,
  error,
});

export const createInvoiceRequest = (payload) => ({
  type: CONSTANTS.CREATE_INVOICE_REQUEST,
  payload,
});

export const createInvoiceSuccess = (data) => ({
  type: CONSTANTS.CREATE_INVOICE_SUCCESS,
  data,
});

export const createInvoiceFail = (error) => ({
  type: CONSTANTS.CREATE_INVOICE_FAIL,
  error,
});
