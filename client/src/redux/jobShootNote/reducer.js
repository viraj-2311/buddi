import produce from 'immer';
import * as CONSTANTS from './constants';

const initState = {
  notes: [],
  loading: false,
  error: null,
  list: {
    loading: false,
    error: null
  }
};

const jobShootNoteReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FETCH_JOB_SHOOT_NOTES_REQUEST:
        draft.list = {loading: true, error: null};
        break;
      case CONSTANTS.FETCH_JOB_SHOOT_NOTES_SUCCESS:
        draft.list = {loading: false, error: null};
        draft.notes = action.data;
        break;
      case CONSTANTS.FETCH_JOB_SHOOT_NOTES_FAIL:
        draft.list = {loading: false, error: action.error}
        break;
      case CONSTANTS.CREATE_JOB_SHOOT_NOTE_REQUEST:
        draft.loading = true;
        draft.error = null;
        break;
      case CONSTANTS.CREATE_JOB_SHOOT_NOTE_SUCCESS:
        draft.loading = false;
        draft.error = null;
        draft.notes = [...draft.notes, action.data];
        break;
      case CONSTANTS.CREATE_JOB_SHOOT_NOTE_FAIL:
        draft.loading = false;
        draft.error = action.error;
        break;
      case CONSTANTS.UPDATE_SHOOT_NOTE_REQUEST:
        draft.loading = true;
        draft.error = null;
        break;
      case CONSTANTS.UPDATE_SHOOT_NOTE_SUCCESS:
        draft.loading = false;
        draft.error = null;
        draft.notes = draft.notes.map(note => {
          if (note.id === action.data.id) return action.data;
          return note;
        });
        break;
      case CONSTANTS.UPDATE_SHOOT_NOTE_FAIL:
        draft.loading = false;
        draft.error = action.error;
        break;
      case CONSTANTS.DELETE_SHOOT_NOTE_REQUEST:
        draft.loading = true;
        draft.error = null;
        break;
      case CONSTANTS.DELETE_SHOOT_NOTE_SUCCESS:
        draft.loading = false;
        draft.error = null;
        draft.notes = draft.notes.filter(note => note.id !== action.noteId);
        break;
      case CONSTANTS.DELETE_SHOOT_NOTE_FAIL:
        draft.loading = false;
        draft.error = action.error;
        break;
      case CONSTANTS.DELETE_SHOOT_NOTE_IMAGE_REQUEST:
        draft.loading = true;
        draft.error = null;
        break;
      case CONSTANTS.DELETE_SHOOT_NOTE_IMAGE_SUCCESS:
        draft.loading = false;
        draft.error = null;
        draft.notes = draft.notes.map(note => {
          if (note.id === action.data.id) return action.data;
          return note;
        });
        break;
      case CONSTANTS.DELETE_SHOOT_NOTE_IMAGE_FAIL:
        draft.loading = false;
        draft.error = action.error;
        break;
      default:
        return state;
    }
  });

export default jobShootNoteReducer;
