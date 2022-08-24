import produce from 'immer';
import { ActionDiv } from '../../containers/Person/Finance/routes/Invoices/routes/Detail/Detail.style';
import { downloadFile } from '../../library/helpers/utility';
import * as CONSTANTS from './constants';

const initialState = {
  jobs: {
    loading: false,
    error: null,
    list: [],
  },
  w9: {
    loading: false,
    error: null,
    list: [],
  },
  invoices: {
    loading: false,
    error: null,
    list: [],
  },
  download_all: {
    loading: false,
    error: null,
  },
  download_w9s: {
    loading: false,
    error: null,
  },
  download_invoices: {
    loading: false,
    error: null,
  },
  download_invoice: {
    loading: false,
    error: null,
  },
  download_reports: {
    loading: false,
    error: null,
  },
  download_archive:{
    loading:false,
    error:null,
  }
};

const companyDocumentReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FETCH_COMPANY_JOB_REQUEST:
        draft.jobs = {
          loading: true,
          error: null,
          list: [],
        };
        break;
      case CONSTANTS.FETCH_COMPANY_JOB_SUCCESS:
        draft.jobs = {
          loading: false,
          error: null,
          list: action.data,
        };
        break;
      case CONSTANTS.FETCH_COMPANY_JOB_FAIL:
        draft.jobs = {
          loading: false,
          error: action.error,
          list: [],
        };
        break;
      case CONSTANTS.FETCH_COMPANY_JOB_INVOICE_DOCUMENT_REQUEST:
        draft.invoices = {
          loading: true,
          error: null,
          list: [],
        };
        break;
      case CONSTANTS.FETCH_COMPANY_JOB_INVOICE_DOCUMENT_SUCCESS:
        draft.invoices = {
          loading: false,
          error: null,
          list: action.data,
        };
        break;
      case CONSTANTS.FETCH_COMPANY_JOB_INVOICE_DOCUMENT_FAIL:
        draft.invoices = {
          loading: false,
          error: action.error,
          list: [],
        };
        break;
      case CONSTANTS.FETCH_COMPANY_JOB_W9_DOCUMENT_REQUEST:
        draft.w9 = {
          loading: true,
          error: null,
          list: [],
        };
        break;
      case CONSTANTS.FETCH_COMPANY_JOB_W9_DOCUMENT_SUCCESS:
        draft.w9 = {
          loading: false,
          error: null,
          list: action.data,
        };
        break;
      case CONSTANTS.FETCH_COMPANY_JOB_W9_DOCUMENT_FAIL:
        draft.w9 = {
          loading: false,
          error: action.error,
          list: [],
        };
        break;

      case CONSTANTS.FETCH_DOWNLOAD_ALL_AS_ZIP_REQUEST:
        draft.download_all = {
          loading: true,
          error: null,
        };
        break;
      case CONSTANTS.FETCH_DOWNLOAD_ALL_AS_ZIP_SUCCESS:
        draft.download_all = {
          loading: false,
          error: null,
        };
        downloadFile(action.data, `${action.title}_invoices_and_w9s.zip`);
        break;
      case CONSTANTS.FETCH_DOWNLOAD_ALL_AS_ZIP_FAIL:
        draft.download_all = {
          loading: false,
          error: action.error,
        };
        break;

      case CONSTANTS.FETCH_DOWNLOAD_ALL_INVOICE_AS_ZIP_REQUEST:
        draft.download_invoices = {
          loading: true,
          error: null,
        };
        break;
      case CONSTANTS.FETCH_DOWNLOAD_ALL_INVOICE_AS_ZIP_SUCCESS:
        draft.download_invoices = {
          loading: false,
          error: null,
        };
        downloadFile(action.data, `${action.title}_invoices.zip`);
        break;
      case CONSTANTS.FETCH_DOWNLOAD_ALL_INVOICE_AS_ZIP_FAIL:
        draft.download_invoices = {
          loading: false,
          error: action.error,
        };
        break;

      case CONSTANTS.FETCH_DOWNLOAD_ALL_W9_AS_ZIP_REQUEST:
        draft.download_w9s = {
          loading: true,
          error: null,
        };
        break;
      case CONSTANTS.FETCH_DOWNLOAD_ALL_W9_AS_ZIP_SUCCESS:
        draft.download_w9s = {
          loading: false,
          error: null,
        };
        downloadFile(action.data, `${action.title}_w9s.zip`);
        break;
      case CONSTANTS.FETCH_DOWNLOAD_ALL_W9_AS_ZIP_FAIL:
        draft.download_w9s = {
          loading: false,
          error: action.error,
        };
        break;

      case CONSTANTS.FETCH_DOWNLOAD_INVOICE_REQUEST:
        draft.download_invoice = {
          loading: true,
          error: null,
        };
        break;
      case CONSTANTS.FETCH_DOWNLOAD_INVOICE_SUCCESS:
        draft.download_invoice = {
          loading: false,
          error: null,
        };
        downloadFile(action.data, `${action.title}`);
        break;
      case CONSTANTS.FETCH_DOWNLOAD_INVOICE_FAIL:
        draft.download_invoice = {
          loading: false,
          error: action.error,
        };
        break;

      case CONSTANTS.FETCH_DOWNLOAD_REPORTS_REQUEST:
        draft.download_all = {
          loading: true,
          error: null,
        };
        break;
      case CONSTANTS.FETCH_DOWNLOAD_REPORTS_SUCCESS:
        draft.download_all = {
          loading: false,
          error: null,
        };
        downloadFile(action.data, `${action.title}_reports.zip`);
        break;
      case CONSTANTS.FETCH_DOWNLOAD_REPORTS_FAIL:
        draft.download_all = {
          loading: false,
          error: action.error,
        };
        break;
      case CONSTANTS.FETCH_DOWNLOAD_ARCHIVE_REQUEST:
        draft.download_archive = {
          loading: true,
          error: null,
        };
        break;
      case CONSTANTS.FETCH_DOWNLOAD_ARCHIVE_REQUEST_SUCCESS:
        draft.download_archive = {
          loading: false,
          error: null,
        };
        downloadFile(action.data, action.fileName);
        break;
      case CONSTANTS.FETCH_DOWNLOAD_ARCHIVE_REQUEST_FAIL:
        draft.download_archive = {
          loading: false,
          error: action.error,
        };
        break;
      default:
        break;
    }
  });

export default companyDocumentReducer;
