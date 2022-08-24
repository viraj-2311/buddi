import { put, takeLatest, takeEvery, call } from 'redux-saga/effects';

import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';
import cloneDeep from 'lodash/cloneDeep';

function* updateWizardUser({userId, payload}) {
  try {
    const data = yield call(request, `/user/${userId}/update/`, 'PATCH', deserializeKeys(payload), true);
    yield put(ACTIONS.updateWizardUserSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateWizardUserFail(error));
  }
}

function* updateWizardProducer({userId, payload}) {
  try {
    const data = yield call(request, `/user/${userId}/update/`, 'PATCH', deserializeKeys(payload), true);
    yield put(ACTIONS.updateWizardProducerSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateWizardProducerSuccess(error));
  }
}

function* fetchCompanyDetailByEmail({ email }) {
  try {
    const payload = { ownerEmail: email };
    const data = yield call(request, `/get_company_by_email/`, 'POST', deserializeKeys(payload), true);
    yield put(ACTIONS.fetchCompanyDetailByEmailSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchCompanyDetailByEmailFail(error));
  }
}

function* createWizardCompany({ payload }) {
  try {
    const data = yield call(request, `/company/`, 'POST', deserializeKeys(payload), true);
    yield put(ACTIONS.createWizardCompanySuccess(serializeKeys(data)));
  } catch (error) {
    if(error['owner_email']){
      error['owner_email'][0] = error['owner_email'][0].replace('company','band');
    }
    if(error['title']){
      error['title'][0] = error['title'][0].replace('company','band');
    }
    yield put(ACTIONS.createWizardCompanyFail(error));
  }
}

function* updateWizardCompany({ id, payload }) {
  try {
    const data = yield call(request, `/company/${id}/`, 'PATCH', deserializeKeys(payload), true);
    yield put(ACTIONS.updateWizardCompanySuccess(serializeKeys(data)));
  } catch (error) {
    if(error['owner_email']){
      error['owner_email'][0] = error['owner_email'][0].replace('company','band');
    }
    if(error['title']){
      error['title'][0] = error['title'][0].replace('company','band');
    }
    yield put(ACTIONS.updateWizardCompanyFail(error));
  }
}

function* completeWizard({ userId, accountType }) {
  try {
    const data = yield call(request, `/user/${userId}/profile_completed/`, 'POST', {type: accountType}, true);
    yield put(ACTIONS.completeWizardSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.completeWizardFail(error));
  }
}

export default function* accountWizardSaga() {
  yield takeEvery(CONSTANTS.UPDATE_WIZARD_USER_REQUEST, updateWizardUser);
  yield takeEvery(CONSTANTS.UPDATE_WIZARD_PRODUCER_REQUEST, updateWizardProducer);
  yield takeEvery(CONSTANTS.FETCH_WIZARD_COMPANY_DETAIL_BY_EMAIL_REQUEST, fetchCompanyDetailByEmail);
  yield takeEvery(CONSTANTS.CREATE_WIZARD_COMPANY_REQUEST, createWizardCompany);
  yield takeEvery(CONSTANTS.UPDATE_WIZARD_COMPANY_REQUEST, updateWizardCompany);
  yield takeEvery(CONSTANTS.COMPLETE_WIZARD_REQUEST, completeWizard);
}
