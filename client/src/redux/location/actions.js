import * as CONSTANTS from './constants';

export const fetchLocationsRequest = () => ({
  type: CONSTANTS.FETCH_LOCATIONS_REQUEST,
});

export const fetchLocationsSuccess = (data) => ({
  type: CONSTANTS.FETCH_LOCATIONS_SUCCESS,
  payload: data,
});

export const fetchLocationsFail = (error) => ({
  type: CONSTANTS.FETCH_LOCATIONS_FAIL,
  payload: error,
});