import produce from 'immer';
import moment from 'moment';
import * as CONSTANTS from './constants';
import { downloadFile } from '../../library/helpers/utility';

const initState = {
  jobDepartments: [],
  jobMemos: [],
  invoiceDepartments: [],
  invoiceMemos: [],
  invoicesPaidBy: null,
  invoice: null,
  fetchDealMemos: {
    loading: false,
    error: null,
  },
  fetchInvoiceMemos: {
    loading: false,
    error: null,
  },
  updateInvoiceMemo: {
    loading: false,
    error: null,
  },
  fetchInvoiceByMemo: {
    loading: false,
    error: null,
  },
  updateInvoice: {
    loading: false,
    error: null,
  },
  sendInvoice: {
    loading: false,
    error: null,
  },
  payApproved: {
    loading: false,
    success: false,
    method: null,
    error: null,
  },
  approveInvoice: {
    loading: false,
    error: null,
  },
  disputeInvoice: {
    loading: false,
    error: null,
  },

  fetchReports: {
    loading: false,
    error: null,
  },
  fetchedReports: {},

  downloadReports: {
    loading: false,
    error: null,
  },

  updatedWrapPayOption: {},
  updateWrapPayOption: {
    loading: false,
    error: null,
  }
};

const jobInvoiceReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FETCH_JOB_DEAL_MEMOS_REQUEST:
        draft.fetchDealMemos = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_JOB_DEAL_MEMOS_SUCCESS:
        draft.jobDepartments = action.data.departments;
        draft.jobMemos = action.data.jobMemos;
        draft.fetchDealMemos = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_JOB_DEAL_MEMOS_FAIL:
        draft.fetchDealMemos = { loading: false, error: action.error };
        break;

      // fetching reports reducers
      case CONSTANTS.FETCH_REPORTS_REQUEST:
        draft.fetchReports = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_REPORTS_SUCCESS:
        draft.fetchedReports = action.data;
        draft.fetchReports = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_REPORTS_FAIL:
        draft.fetchReports = { loading: false, error: action.error };
        break;
        
      // Download reports reducers
      case CONSTANTS.DOWNLOAD_REPORTS_REQUEST:
        draft.downloadReports = { loading: true, error: null };
        break;
      case CONSTANTS.DOWNLOAD_REPORTS_SUCCESS:
        draft.downloadReports = { loading: false, error: null };
        downloadFile(action.data, `Report-${new moment().format(
          "YYYY-MM-DD-hh-mm-ss"
        )}.pdf`);
        break;
      case CONSTANTS.DOWNLOAD_REPORTS_FAIL:
        draft.downloadReports = { loading: false, error: action.error };
        break;

      case CONSTANTS.UPDATE_WRAP_PAY_SELECTED_OPTION_REQUEST:
        draft.updateWrapPayOption = { loading: true, error: null };
        break;
      case CONSTANTS.UPDATE_WRAP_PAY_SELECTED_OPTION_SUCCESS:
        draft.updatedWrapPayOption = action.data;
        draft.updateWrapPayOption = { loading: false, error: null };
        break;
      case CONSTANTS.UPDATE_WRAP_PAY_SELECTED_OPTION_FAIL:
        draft.updateWrapPayOption = { loading: false, error: action.error };
        break;

      case CONSTANTS.FETCH_JOB_INVOICE_MEMOS_REQUEST:
        draft.fetchInvoiceMemos = { loading: true, error: null };
        break;
      case CONSTANTS.JOB_INVOICE_MEMOS_INITIALIZE:
        draft.invoiceDepartments = [];
        draft.invoiceMemos = [];
        draft.invoicesPaidBy = null;
        draft.fetchInvoiceMemos = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_JOB_INVOICE_MEMOS_SUCCESS:
        draft.invoiceDepartments = action.data.departments;
        draft.invoiceMemos = action.data.invoiceMemos;
        draft.invoicesPaidBy = action.data.paidBy;
        draft.fetchInvoiceMemos = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_JOB_INVOICE_MEMOS_FAIL:
        draft.fetchInvoiceMemos = { loading: false, error: action.error };
        break;

      case CONSTANTS.FETCH_INVOICE_BY_MEMO_REQUEST:
        draft.fetchInvoiceByMemo = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_INVOICE_BY_MEMO_SUCCESS:
        draft.invoice = action.data;
        draft.fetchInvoiceByMemo = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_INVOICE_BY_MEMO_FAIL:
        draft.fetchInvoiceByMemo = { loading: false, error: action.error };
        break;

      case CONSTANTS.UPDATE_INVOICE_REQUEST:
        draft.updateInvoice = { loading: true, error: null };
        break;
      case CONSTANTS.UPDATE_INVOICE_SUCCESS:
        draft.updateInvoice = { loading: false, error: null };
        draft.invoiceMemos = draft.invoiceMemos.map((memo) =>
          memo.invoice.id === action.data.id
            ? { ...memo, invoice: action.data }
            : memo
        );
        break;
      case CONSTANTS.UPDATE_INVOICE_FAIL:
        draft.updateInvoice = { loading: false, error: action.error };
        break;

      case CONSTANTS.UPDATE_INVOICE_MEMO_REQUEST:
        draft.updateInvoiceMemo = { loading: true, error: null };
        break;
      case CONSTANTS.UPDATE_INVOICE_MEMO_SUCCESS:
        draft.jobMemos = draft.jobMemos.map((memo) =>
          memo.invoiceMemo.id === action.data.id
            ? { ...memo, invoiceMemo: action.data }
            : memo
        );
        draft.updateInvoiceMemo = { loading: false, error: null };
        break;
      case CONSTANTS.UPDATE_INVOICE_MEMO_FAIL:
        draft.updateInvoiceMemo = { loading: false, error: action.error };
        break;

      case CONSTANTS.SEND_JOB_INVOICE_REQUEST:
        draft.sendInvoice = { loading: true, error: null };
        break;
      case CONSTANTS.SEND_JOB_INVOICE_SUCCESS:
        draft.sendInvoice = { loading: false, error: null };
        break;
      case CONSTANTS.SEND_JOB_INVOICE_FAIL:
        draft.sendInvoice = { loading: false, error: action.error };
        break;
      case CONSTANTS.PAY_APPROVED_INVOICE_BY_WALLET_REQUEST:
        draft.payApproved = { loading: true, error: null, success: false, method: 'wallet' };
        break;
      case CONSTANTS.PAY_APPROVED_INVOICE_BY_BANK_REQUEST:
        draft.payApproved = { loading: true, error: null, success: false, method: 'bank' };
        break;
      case CONSTANTS.PAY_APPROVED_INVOICE_SUCCESS:
        draft.payApproved = {
          ...draft.payApproved,
          loading: false,
          error: null,
          success: true
        };
        break;
      case CONSTANTS.PAY_APPROVED_INVOICE_FAIL:
        draft.payApproved = {
          ...draft.payApproved,
          loading: false,
          error: action.error,
          success: false
        };
        break;
        case CONSTANTS.PAY_APPROVED_INVOICE_RESET:
          draft.payApproved = {
            loading: false,
            success: false,
            method: null,
            error: null,
          };
          break;

      case CONSTANTS.APPROVE_INVOICE_REQUEST:
        draft.approveInvoice = { loading: true, error: null };
        break;
      case CONSTANTS.APPROVE_INVOICE_SUCCESS:
        draft.approveInvoice = { loading: false, error: null };
        draft.invoiceMemos = draft.invoiceMemos.map((memo) =>
          memo.invoice.id === action.data.id
            ? { ...memo, invoice: action.data }
            : memo
        );
        break;
      case CONSTANTS.APPROVE_INVOICE_FAIL:
        draft.approveInvoice = { loading: false, error: action.error };
        break;

      case CONSTANTS.DISPUTE_INVOICE_REQUEST:
        draft.disputeInvoice = { loading: true, error: null };
        break;
      case CONSTANTS.DISPUTE_INVOICE_SUCCESS:
        draft.disputeInvoice = { loading: false, error: null };
        draft.invoiceMemos = draft.invoiceMemos.map((memo) =>
          memo.invoice.id === action.data.id
            ? { ...memo, invoice: action.data }
            : memo
        );
        break;
      case CONSTANTS.DISPUTE_INVOICE_FAIL:
        draft.disputeInvoice = { loading: false, error: action.error };
        break;

      default:
        return state;
    }
  });

export default jobInvoiceReducer;
