import { put, takeLatest, call } from 'redux-saga/effects';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';

function* fetchLocations(action) {
  try {
    const data = yield call(request, '/locations/', 'GET', null, false);
    yield put(ACTIONS.fetchLocationsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchLocationsFail(error));
  }
}


export default function* locationSaga() {
  yield takeLatest(CONSTANTS.FETCH_LOCATIONS_REQUEST, fetchLocations);
}
