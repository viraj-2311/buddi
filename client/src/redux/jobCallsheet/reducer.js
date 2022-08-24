import produce from 'immer';
import * as CONSTANTS from './constants';

const initState = {
  callsheet: null,
  callsheets: [],
  crews: [],
  productionContacts: [],
  callsheetDates: [],
  defaultForms: {},
  fullViewData: {
    departments: [],
    schedule: [],
    notes: []
  },
  printViewData: {},
  create: {
    completed: false,
    loading: false,
    error: null,
  },
  update: {
    loading: false,
    error: null,
  },
  delete: {
    loading: false,
    error: null,
  },
  deleteBulk: {
    loading: false,
    error: null,
  },
  fullView: {
    loading: false,
    error: null
  },
  printView: {
    loading: false,
    error: null
  },
  send: {
    completed: false,
    loading: false,
    error: null
  },
  list: {
    loading: true,
    error: null,
  },
  detail: {
    loading: true,
    error: null
  },
  accept: {
    loading: false,
    error: null
  }
};

const jobCallsheetReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FETCH_PRODUCTION_CONTACTS_SUCCESS:
        draft.productionContacts = action.data;
        break;
      case CONSTANTS.FETCH_CREWS_SUCCESS:
        draft.crews = action.data;
        break;
      case CONSTANTS.FETCH_FULLVIEW_REQUEST:
        draft.fullView = {loading: true, error: null};
        break;
      case CONSTANTS.FETCH_FULLVIEW_SUCCESS:
        draft.fullViewData = action.data;
        draft.fullView = {loading: false, error: null};
        break;
      case CONSTANTS.FETCH_FULLVIEW_FAIL:
        draft.fullView = {loading: false, error: action.error};
        break;
      case CONSTANTS.FETCH_PRINT_VIEW_REQUEST:
        draft.printView = {loading: true, error: null};
        break;
      case CONSTANTS.FETCH_PRINT_VIEW_SUCCESS:
        draft.printViewData = action.data;
        draft.printView = {loading: false, error: null};
        break;
      case CONSTANTS.FETCH_PRINT_VIEW_FAIL:
        draft.printView = {loading: false, error: action.error};
        break;
      case CONSTANTS.CREATE_CALLSHEET_REQUEST:
        draft.create = {loading: true, error: null, completed: false};
        break;
      case CONSTANTS.CREATE_CALLSHEET_SUCCESS:
        draft.callsheet = action.data;
        draft.create = {loading: false, error: null, completed: true};
        break;
      case CONSTANTS.CREATE_CALLSHEET_FAIL:
        draft.create = {loading: false, error: action.error, completed: false};
        break;
      case CONSTANTS.UPDATE_CALLSHEET_REQUEST:
        draft.update = {loading: true, error: null};
        break;
      case CONSTANTS.UPDATE_CALLSHEET_SUCCESS:
        draft.update = {loading: false, error: null};
        draft.fullViewData.departments = draft.fullViewData.departments.map(d => d.id === action.data.id ? action.data : d);
        break;
      case CONSTANTS.UPDATE_CALLSHEET_FAIL:
        draft.update = {loading: false, error: action.error};
        break;
      case CONSTANTS.DELETE_CALLSHEET_REQUEST:
        draft.delete = {loading: true, error: null};
        break;
      case CONSTANTS.DELETE_CALLSHEET_SUCCESS:
        draft.delete = {loading: false, error: null};
        draft.fullViewData.departments = draft.fullViewData.departments.filter(d => d.id !== action.callsheetId);
        break;
      case CONSTANTS.DELETE_CALLSHEET_FAIL:
        draft.delete = {loading: false, error: action.error};
        break;
      case CONSTANTS.DELETE_BULK_CALLSHEET_REQUEST:
        draft.deleteBulk = {loading: true, error: null};
        break;
      case CONSTANTS.DELETE_BULK_CALLSHEET_SUCCESS:
        draft.deleteBulk = {loading: false, error: null};
        draft.fullViewData.departments = draft.fullViewData.departments.filter(d => !action.callsheetIds.includes(d.id));
        break;
      case CONSTANTS.DELETE_BULK_CALLSHEET_FAIL:
        draft.deleteBulk = {loading: false, error: action.error};
        break;
      case CONSTANTS.SEND_CALLSHEET_REQUEST:
        draft.send = {loading: true, error: null, completed: false};
        break;
      case CONSTANTS.SEND_CALLSHEET_SUCCESS:
        draft.send = {loading: false, error: null, completed: true};
        break;
      case CONSTANTS.SEND_CALLSHEET_FAIL:
        draft.send = {loading: false, error: action.error, completed: false};
        break;
      case CONSTANTS.FETCH_CALLSHEET_DATES_SUCCESS:
        draft.callsheetDates = action.data;
        break;
      case CONSTANTS.FETCH_USER_CALLSHEETS_REQUEST:
        draft.list = {loading: true, error: null,};
        break;
      case CONSTANTS.FETCH_USER_CALLSHEETS_SUCCESS:
        draft.callsheets = action.data;
        draft.list = {loading: false, error: null};
        break;
      case CONSTANTS.FETCH_USER_CALLSHEETS_FAIL:
        draft.list = {loading: false, error: action.error};
        break;
      case CONSTANTS.FETCH_CALLSHEET_DETAIL_REQUEST:
        draft.detail = {loading: true, error: null,};
        break;
      case CONSTANTS.FETCH_CALLSHEET_DETAIL_SUCCESS:
        draft.callsheet = action.data;
        draft.detail = {loading: false, error: null};
        break;
      case CONSTANTS.FETCH_CALLSHEET_DETAIL_FAIL:
        draft.detail = {loading: false, error: action.error};
        break;
      case CONSTANTS.ACCEPT_CALLSHEET_REQUEST:
        draft.accept = {loading: true, error: null,};
        break;
      case CONSTANTS.ACCEPT_CALLSHEET_SUCCESS:
        draft.callsheet = action.data;
        draft.callsheets = draft.callsheets.map(c => c.id === action.data.id ? {...c, accepted: true} : c);
        draft.accept = {loading: false, error: null};
        break;
      case CONSTANTS.ACCEPT_CALLSHEET_FAIL:
        draft.accept = {loading: false, error: action.error};
        break;
      case CONSTANTS.SET_CALLSHEET_FORM:
        draft.defaultForms = {...draft.defaultForms, ...action.data};
        break;
      default:
        return state;
    }
  });

export default jobCallsheetReducer;
