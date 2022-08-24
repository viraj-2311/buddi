import produce from 'immer';
import * as CONSTANTS from './constants';
import _ from 'lodash';

const initState = {
  casts: [],
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

const addWardrobeToCast = (casts, castId, wardrobe) => {
  return casts.map(cast => {
    if (cast.id === castId) {
      const newWardrobes = cast.wardrobes ? [...cast.wardrobes, wardrobe] : [wardrobe];
      return {...cast, wardrobes: newWardrobes};
    } else {
      return cast
    }
  });
};

const updateWardrobeToCast = (casts, castId, wardrobe) => {
  return casts.map(cast => {
    if (cast.id === castId) {
      return {...cast, wardrobes: cast.wardrobes.map(w => w.id === wardrobe.id ? wardrobe : w)};
    } else {
      return cast
    }
  });
};

const deleteWardrobeToCast = (casts, castId, wardrobeId) => {
  return casts.map(cast => {
    if (cast.id === castId) {
      return {...cast, wardrobes: cast.wardrobes.filter(w => w.id !== wardrobeId)};
    } else {
      return cast
    }
  });
};

const jobCastReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FETCH_JOB_CASTS_REQUEST:
        draft.list = {loading: true, error: null};
        break;
      case CONSTANTS.FETCH_JOB_CASTS_SUCCESS:
        draft.casts = action.data;
        draft.list = {loading: false, error: null};
        break;
      case CONSTANTS.FETCH_JOB_CASTS_FAIL:
        draft.list = {loading: false, error: action.error};
        break;

      case CONSTANTS.CREATE_JOB_CAST_REQUEST:
        draft.create = {loading: true, error: null};
        break;
      case CONSTANTS.CREATE_JOB_CAST_SUCCESS:
        draft.casts = [...draft.casts, action.data];
        draft.create = {loading: false, error: null};
        break;
      case CONSTANTS.CREATE_JOB_CAST_FAIL:
        draft.create = {loading: false, error: action.error};
        break;

      case CONSTANTS.UPDATE_JOB_CAST_REQUEST:
        draft.update = {loading: true, error: null};
        break;
      case CONSTANTS.UPDATE_JOB_CAST_SUCCESS:
        draft.casts = draft.casts.map(cast => {
          if (cast.id === action.data.id) return action.data;
          return cast;
        });
        draft.update = {loading: false, error: null};
        break;
      case CONSTANTS.UPDATE_JOB_CAST_FAIL:
        draft.update = {loading: false, error: action.error};
        break;

      case CONSTANTS.DELETE_JOB_CAST_REQUEST:
        draft.delete = {loading: true, error: null};
        break;
      case CONSTANTS.DELETE_JOB_CAST_SUCCESS:
        draft.casts = draft.casts.filter(cast => cast.id !== action.data);
        draft.delete = {loading: false, error: null};
        break;
      case CONSTANTS.DELETE_JOB_CAST_FAIL:
        draft.delete = {loading: false, error: action.error};
        break;

      case CONSTANTS.CREATE_CAST_WARDROBE_REQUEST:
        draft.create = {loading: true, error: null};
        break;
      case CONSTANTS.CREATE_CAST_WARDROBE_SUCCESS:
        draft.casts = addWardrobeToCast(draft.casts, action.castId, action.wardrobe);
        draft.create = {loading: false, error: null};
        break;
      case CONSTANTS.CREATE_CAST_WARDROBE_FAIL:
        draft.create = {loading: false, error: action.error};
        break;

      case CONSTANTS.UPDATE_CAST_WARDROBE_REQUEST:
        draft.update = {loading: true, error: null};
        break;
      case CONSTANTS.UPDATE_CAST_WARDROBE_SUCCESS:
        draft.casts = updateWardrobeToCast(draft.casts, action.castId, action.wardrobe);
        draft.update = {loading: false, error: null};
        break;
      case CONSTANTS.UPDATE_CAST_WARDROBE_FAIL:
        draft.update = {loading: false, error: action.error};
        break;

      case CONSTANTS.DELETE_CAST_WARDROBE_REQUEST:
        draft.delete = {loading: true, error: null};
        break;
      case CONSTANTS.DELETE_CAST_WARDROBE_SUCCESS:
        draft.casts = deleteWardrobeToCast(draft.casts, action.castId, action.wardrobeId);
        draft.delete = {loading: false, error: null};
        break;
      case CONSTANTS.DELETE_CAST_WARDROBE_FAIL:
        draft.delete = {loading: false, error: action.error};
        break;

      default:
        return state;
    }
  });

export default jobCastReducer;
