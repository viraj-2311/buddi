import produce from 'immer';
import * as CONSTANTS from './constants';

const initState = {
  ppbContent: null,
  ppbSettings: {
    theme: {
      layout: 'landscape',
      fontFamily: 'Roboto',
      accentColor: '#f97f71',
      presetAccentColors: [
        '#f2f2f2', '#e0e0e0', '#bdbdbd', '#828282', '#333333', '#000000', '#bbd883', '#ff77b2',
        '#f97f71', '#56ccf2', '#32bea6'
      ],
      textColor: '#333333',
      presetTextColors: [
        '#828282', '#333333', '#000000', '#bbd883', '#ff77b2', '#f97f71', '#56ccf2', '#32bea6'
      ],
      isWatermarked: false,
    }
  },
  ppbTextStyle: {},
  fetchContent: {
    loading: false,
    error: null
  },
  updateStaticPage: {
    loading: false,
    error: null
  },
  updateWatermark: {
    loading: false,
    error: null
  },
  createPage: {
    loading: false,
    error: null
  },
  updatePage: {
    loading: false,
    error: null
  },
  deletePage: {
    loading: false,
    error: null
  },
  createScript: {
    loading: false,
    error: null
  },
  deleteScript: {
    loading: false,
    error: null
  }
};

const jobPreProductionReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FETCH_JOB_PPB_SETTINGS_REQUEST:
        break;
      case CONSTANTS.FETCH_JOB_PPB_SETTINGS_SUCCESS:
        draft.ppbSettings = action.data;
        break;
      case CONSTANTS.FETCH_JOB_PPB_SETTINGS_FAIL:
        break;

      case CONSTANTS.SET_JOB_PPB_SETTINGS_REQUEST:
        break;
      case CONSTANTS.SET_JOB_PPB_SETTINGS_SUCCESS:
        draft.ppbSettings = action.data;
        break;
      case CONSTANTS.SET_JOB_PPB_SETTINGS_FAIL:
        break;

      case CONSTANTS.FETCH_JOB_PPB_CONTENT_REQUEST:
        draft.fetchContent = {loading: true, error: null};
        break;
      case CONSTANTS.FETCH_JOB_PPB_CONTENT_SUCCESS:
        draft.fetchContent = {loading: false, error: null};
        draft.ppbContent = action.data;
        break;
      case CONSTANTS.FETCH_JOB_PPB_CONTENT_FAIL:
        draft.fetchContent = {loading: false, error: action.error};
        break;

      case CONSTANTS.UPDATE_JOB_PPB_PAGE_REQUEST:
        draft.updateStaticPage = {loading: true, error: null};
        break;
      case CONSTANTS.UPDATE_JOB_PPB_PAGE_SUCCESS:
        draft.updateStaticPage = {loading: false, error: null};
        draft.ppbContent.pages = {...draft.ppbContent.pages, ...action.data};
        break;
      case CONSTANTS.UPDATE_JOB_PPB_PAGE_FAIL:
        draft.updateStaticPage = {loading: false, error: action.error};
        break;

      case CONSTANTS.DELETE_JOB_PPB_PAGE_REQUEST:
        draft.deletePage = {loading: true, error: null};
        break;
      case CONSTANTS.DELETE_JOB_PPB_PAGE_SUCCESS:
        draft.deletePage = {loading: false, error: null};
        delete draft.ppbContent.pages[action.data];
        break;
      case CONSTANTS.DELETE_JOB_PPB_PAGE_FAIL:
        draft.deletePage = {loading: false, error: action.error};
        break;

      case CONSTANTS.SET_JOB_PPB_PAGE_ORDER_SUCCESS:
        action.data.map((pageKey, index) => {
          draft.ppbContent.pages[pageKey].pageNumber = index + 1;
        });
        break;

      case CONSTANTS.UPDATE_JOB_PPB_WATERMARK_REQUEST:
        draft.updateWatermark = {loading: true, error: null};
        break;
      case CONSTANTS.UPDATE_JOB_PPB_WATERMARK_SUCCESS:
        draft.updateWatermark = {loading: false, error: null};
        draft.ppbContent.watermarks = action.data;
        break;
      case CONSTANTS.UPDATE_JOB_PPB_WATERMARK_FAIL:
        draft.updateWatermark = {loading: false, error: action.error};
        break;

      case CONSTANTS.SET_JOB_PPB_TEXT_STYLE:
        draft.ppbTextStyle = action.style;
        break;

      case CONSTANTS.RESET_JOB_PPB_TEXT_STYLE_SUCCESS:
        draft.ppbContent = action.data;
        break;

      default:
        return state;
    }
  });

export default jobPreProductionReducer;
