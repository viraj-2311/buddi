import { put, takeLatest, takeEvery, call } from 'redux-saga/effects';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as COMMON_CONSTANTS from '../constants';
import * as ACTIONS from './actions';
import cloneDeep from 'lodash/cloneDeep';

function* updateUserIntro({ payload }) {
  try {
    let userId = payload.userId;
    let dataPayload = payload.data;
    const data = yield call(
      request,
      `/users/${userId}/`,
      'PATCH',
      deserializeKeys(dataPayload),
      true
    );
    yield put(ACTIONS.updateUserIntroSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateUserIntroFail(error));
  }
}

function* updateCompanyIntro({ payload }) {
  try {
    let userId = payload.userId;
    let dataPayload = payload.data;
    const data = yield call(
      request,
      `/users/${userId}/`,
      'PATCH',
      deserializeKeys(dataPayload),
      true
    );
    yield put(ACTIONS.updateUserIntroSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateUserIntroFail(error));
  }
}

function* setUserIntroStep({ payload }) {
  try {
    let currentStepIntro = payload;
    yield put(
      ACTIONS.setUserIntroCurrentStepSuccess(serializeKeys(currentStepIntro))
    );
  } catch (error) {}
}

function* setCompanyIntroStep({ payload }) {
  try {
    let currentStepIntro = payload;
    yield put(
      ACTIONS.setCompanyIntroCurrentStepSuccess(serializeKeys(currentStepIntro))
    );
  } catch (error) {}
}

export default function* userIntroSaga() {
  yield takeLatest(CONSTANTS.USER_INTRO_STEP, updateUserIntro);
  yield takeLatest(CONSTANTS.COMPANY_INTRO_STEP, updateCompanyIntro);

  yield takeLatest(CONSTANTS.CURRENT_USER_INTRO_STEP, setUserIntroStep);
  yield takeLatest(CONSTANTS.CURRENT_COMPANY_INTRO_STEP, setCompanyIntroStep);
}
