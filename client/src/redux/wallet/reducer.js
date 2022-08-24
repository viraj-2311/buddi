import produce from 'immer';
import * as CONSTANTS from './constants';
import { downloadFile } from '../../library/helpers/utility';

const initialState = {
  userHistoryPayment: {
    loading: true,
    error: null,
    data: null,
  },
  listRequestPayment: {
    loading: true,
    error: null,
    data: null,
  },
  declinePayment: {
    loading: false,
    error: null,
    success: null,
  },
  manualBankCard: {
    loading: false,
    error: null,
    success: null,
  },
  fileTransactionPdf: {
    loading: false,
    error: null,
  },
  historyTransactionPdf: {
    loading: false,
    error: null,
  },
  needHelp: {
    loading: false,
    error: null,
    success: null,
  },
};

const walletReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.USER_HISTORY_PAYMENT:
        draft.userHistoryPayment = {
          ...draft.userHistoryPayment,
          loading: true,
          error: null,
        };
        break;
      case CONSTANTS.USER_HISTORY_PAYMENT_SUCCESS:
        draft.userHistoryPayment = {
          loading: false,
          error: null,
          data: action.data,
        };
        break;
      case CONSTANTS.USER_HISTORY_PAYMENT_FAIL:
        draft.userHistoryPayment = {
          loading: false,
          error: action.error,
          data: null,
        };
        break;

      case CONSTANTS.GET_REQUEST_PAYMENT_SILA:
        draft.listRequestPayment = {
          ...draft.listRequestPayment,
          loading: true,
          error: null,
        };
        break;
      case CONSTANTS.GET_REQUEST_PAYMENT_SILA_SUCCESS:
        draft.listRequestPayment = {
          loading: false,
          error: null,
          data: action.data,
        };
        break;
      case CONSTANTS.GET_REQUEST_PAYMENT_SILA_FAIL:
        draft.listRequestPayment = {
          loading: false,
          error: action.error,
          data: null,
        };
        break;

      case CONSTANTS.DECLINE_REQUEST_PAYMENT_SILA:
        draft.declinePayment = {
          loading: true,
          error: null,
          success: null,
        };
        break;
      case CONSTANTS.DECLINE_REQUEST_PAYMENT_SILA_SUCCESS:
        draft.declinePayment = {
          loading: false,
          error: null,
          success: true,
        };
        break;
      case CONSTANTS.DECLINE_REQUEST_PAYMENT_SILA_FAIL:
        draft.declinePayment = {
          loading: false,
          error: action.error,
          success: null,
        };
        break;

      case CONSTANTS.ADD_MANUAL_BANK_CARD:
        draft.manualBankCard = {
          loading: true,
          error: null,
          success: null,
        };
        break;
      case CONSTANTS.ADD_MANUAL_BANK_CARD_SUCCESS:
        draft.manualBankCard = {
          loading: false,
          error: null,
          success: true,
        };
        break;
      case CONSTANTS.ADD_MANUAL_BANK_CARD_FAIL:
        draft.manualBankCard = {
          loading: false,
          error: action.error,
          success: null,
        };
        break;

      case CONSTANTS.GET_FILE_TRANSACTION_PDF:
        draft.fileTransactionPdf = {
          loading: true,
          error: null,
          success: null,
        };
        break;
      case CONSTANTS.GET_FILE_TRANSACTION_PDF_SUCCESS:
        draft.fileTransactionPdf = {
          loading: false,
          error: null,
          success: true,
        };
        downloadFile(action.data, `${action.title}.pdf`);
        break;
      case CONSTANTS.GET_FILE_TRANSACTION_PDF_FAIL:
        draft.fileTransactionPdf = {
          loading: false,
          error: action.error,
          success: null,
        };
        break;

      case CONSTANTS.DOWNLOAD_HISTORY_TRANSACTION_PDF:
        draft.historyTransactionPdf = {
          loading: true,
          error: null,
          success: null,
        };
        break;
      case CONSTANTS.DOWNLOAD_HISTORY_TRANSACTION_PDF_SUCCESS:
        draft.historyTransactionPdf = {
          loading: false,
          error: null,
          success: true,
        };
        downloadFile(action.data, `${action.title}.pdf`);
        break;
      case CONSTANTS.DOWNLOAD_HISTORY_TRANSACTION_PDF_FAIL:
        draft.historyTransactionPdf = {
          loading: false,
          error: action.error,
          success: null,
        };
        break;

      case CONSTANTS.SEND_NEED_HELP:
        draft.needHelp = {
          loading: true,
          error: null,
        };
        break;
      case CONSTANTS.SEND_NEED_HELP_SUCCESS:
        draft.needHelp = {
          loading: false,
          error: null,
          success: true,
        };
        break;
      case CONSTANTS.SEND_NEED_HELP_FAIL:
        draft.needHelp = {
          loading: false,
          error: action.error,
        };
        break;

      default:
        break;
    }
  });

export default walletReducer;
