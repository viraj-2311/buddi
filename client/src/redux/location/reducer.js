import produce from 'immer';
import * as CONSTANTS from './constants';

const initState = {
  loading: false,
  locations: {}
};

const locationReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FETCH_LOCATIONS_REQUEST:
        draft.loading = true;
        break;
      case CONSTANTS.FETCH_LOCATIONS_SUCCESS:
        draft.locations = action.payload;
        draft.loading = false;
        break;
      case CONSTANTS.FETCH_LOCATIONS_FAIL:
        draft.error = action.payload;
        draft.loading = false;
        break;

      default:
        return state;
    }
  });

export default locationReducer;
