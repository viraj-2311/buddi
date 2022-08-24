import produce from 'immer';
import * as CONSTANTS from './constants';

const initState = {
  documents: [],
  list: {
    loading: false,
    error: null
  },
  create: {
    loading: false,
    error: null,
  },
  update: {
    loading: false,
    error: null
  },
  delete: {
    loading: false,
    error: null
  }
};

const jobDocumentReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FETCH_JOB_DOCUMENTS_REQUEST:
        draft.list = {loading: true, error: null};
        break;
      case CONSTANTS.FETCH_JOB_DOCUMENTS_SUCCESS:
        draft.documents = action.data;
        draft.list = {loading: false, error: null};
        break;
      case CONSTANTS.FETCH_JOB_DOCUMENTS_FAIL:
        draft.list = {loading: false, error: action.error};
        break;

      case CONSTANTS.CREATE_JOB_DOCUMENT_REQUEST:
        draft.create = {loading: true, error: null};
        break;
      case CONSTANTS.CREATE_JOB_DOCUMENT_SUCCESS:
        draft.documents = [...draft.documents, action.data];
        draft.create = {loading: false, error: null};
        break;
      case CONSTANTS.CREATE_JOB_DOCUMENT_FAIL:
        draft.create = {loading: false, error: action.error};
        break;

      case CONSTANTS.UPDATE_JOB_DOCUMENT_REQUEST:
        draft.update = {loading: true, error: null};
        break;
      case CONSTANTS.UPDATE_JOB_DOCUMENT_SUCCESS:
        draft.documents = draft.documents.map(document => {
          if (document.id === action.data.id) return action.data;
          return document;
        });
        draft.update = {loading: false, error: null};
        break;
      case CONSTANTS.UPDATE_JOB_DOCUMENT_FAIL:
        draft.update = {loading: false, error: action.error};
        break;

      case CONSTANTS.DELETE_JOB_DOCUMENT_REQUEST:
        draft.delete = {loading: true, error: null};
        break;
      case CONSTANTS.DELETE_JOB_DOCUMENT_SUCCESS:
        draft.documents = draft.documents.filter(document => document.id !== action.data);
        draft.delete = {loading: false, error: null};
        break;
      case CONSTANTS.DELETE_JOB_DOCUMENT_FAIL:
        draft.delete = {loading: false, error: action.error};
        break;

      default:
        return state;
    }
  });

export default jobDocumentReducer;
