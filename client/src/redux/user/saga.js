import { put, takeLatest, takeEvery, call } from 'redux-saga/effects';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as COMMON_CONSTANTS from '../constants';
import * as ACTIONS from './actions';
import cloneDeep from 'lodash/cloneDeep';
import notify from '@iso/lib/helpers/notify';

function* fetchSkills() {
  try {
    const data = yield call(
      request,
      '/user_profile/skills/',
      'GET',
      null,
      true
    );
    yield put(ACTIONS.fetchUserSkillsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchUserSkillsFail(error));
  }
}

function* fetchUsers() {
  try {
    const data = yield call(request, '/users/', 'GET', null, true);
    yield put(ACTIONS.fetchUsersSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchUsersFail(error));
  }
}

function* fetchUserDetail(action) {
  try {
    const data = yield call(request, `/users/${action.id}/`, 'GET', null, true);
    yield put(ACTIONS.fetchUserDetailSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchUserDetailFail(error));
  }
}

function* updateUser(action) {
  try {
    const { id, payload } = action;
    const data = yield call(
      request,
      `/users/${id}/`,
      'PATCH',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.updateUserSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateUserFail(error));
  }
}

function* updateUserExpertise(action) {
  try {
    const { id, payload } = action;
    const data = yield call(
      request,
      `/users/${id}/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.updateUserExpertiseSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateUserExpertiseFail(error));
  }
}

function* changePassword(action) {
  try {
    const { payload } = action;
    const body = cloneDeep(payload);
    const data = yield call(
      request,
      '/change_password/',
      'PATCH',
      deserializeKeys(body),
      true
    );
    yield put(ACTIONS.changePasswordSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.changePasswordFail(error));
  }
}

function* inviteStaff(action) {
  try {
    const { payload } = action;
    const body = cloneDeep(payload);
    const data = yield call(
      request,
      '/invite_company_staff/',
      'POST',
      deserializeKeys(body),
      true
    );
    yield put(ACTIONS.inviteStaffSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.inviteStaffFail(error));
  }
}

function* fetchUserCompanies({ userId }) {
  try {
    const data = yield call(
      request,
      `/user/${userId}/production_company/`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.fetchUserCompaniesSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchUserCompaniesFail(error));
  }
}

function* fetchProducers() {
  try {
    const data = yield call(request, '/producers/', 'GET', null, true);
    yield put(ACTIONS.fetchProducersSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchProducersFail(error));
  }
}

function* registerSilaUser(userInfo) {
  try {
    const { payload } = userInfo;
    const data = yield call(
      request,
      '/user/sila/register_user/',
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.registerSilaUserSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.registerSilaUserFail(error));
  }
}

function* updateSilaUser(userInfo) {
  try {
    const { payload } = userInfo;
    const data = yield call(
      request,
      '/user/sila/user-info/',
      'PUT',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.updateSilaUserSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateSilaUserFail(error));
  }
}

function* getCorporateSilaUser() {
  try {
    const data = yield call(
      request,
      `/user/sila/user-info/`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.getCorporateSilaUserSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.getCorporateSilaUserFail(error));
  }
}

function* getDocumentTypeUser() {
  try {
    const data = yield call(
      request,
      `/user/sila/kyc/supported-documents`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.getDocumentTypeUserSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.getDocumentTypeUserFail(error));
  }
}

function* getUserSilaKYC() {
  try {
    const data = yield call(request, '/user/sila/kyc', 'GET', null, true);
    yield put(ACTIONS.getUserSilaKYCSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.getUserSilaKYCFail(error));
  }
}

function* postUserRequestKYC() {
  try {
    const data = yield call(request, '/user/sila/kyc', 'POST', null, true);
    yield put(ACTIONS.postUserRequestKYCSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.postUserRequestKYCFail(error));
  }
}

//api for register and getting are the same, we use the same actions
function* getUserWallet() {
  try {
    const data = yield call(request, '/user/sila/wallet/', 'GET', null, true);
    yield put(ACTIONS.getUserWalletSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.getUserWalletFail(error));
  }
}

function* updateW9Document({ userId, payload }) {
  try {
    const data = yield call(
      request,
      `/user/${userId}/s3upload/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.updateContractorW9DocumentSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateContractorW9DocumentFail(error));
  }
}

function* removeW9Document({ userId, documentId }) {
  try {
    yield call(request, `/user/${userId}/s3upload/${documentId}/`, 'DELETE');
    yield put(ACTIONS.removeContractorW9DocumentSuccess());
  } catch (error) {
    yield put(ACTIONS.removeContractorW9DocumentFail(error));
  }
}

function* uploadKYCDocumentRequest({ payload }) {
  try {
    const { formData } = payload;
    const data = yield call(
      request,
      `/user/sila/kyc/document`,
      'POST',
      formData,
      true,
      false,
      true
    );
    yield put(ACTIONS.uploadKYCDocumentSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.uploadKYCDocumentFail(error));
  }
}

function* getPlaidLinkUserToken({ payload }) {
  try {
    if (payload) {
      const data = yield call(
        request,
        `/user/plaid/token/`,
        'PATCH',
        deserializeKeys(payload),
        true
      );
      yield put(ACTIONS.getPlaidLinkAccountConnected());
    } else {
      const data = yield call(
        request,
        `/user/plaid/token/`,
        'POST',
        null,
        true
      );
      yield put(ACTIONS.getPlaidLinkUserTokenSuccess(serializeKeys(data)));
    }
  } catch (error) {
    yield put(ACTIONS.getPlaidLinkUserTokenFail(error));
  }
}

function* searchUserPayment({ payload }) {
  try {
    const nameSearch = payload;
    const data = yield call(
      request,
      `/sila_accounts/${nameSearch}`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.searchUserPaymentSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.searchUserPaymentFail(error));
  }
}

// bank account = plaid account
function* transferMoneyByBankAccount({ payload }) {
  try {
    const data = yield call(
      request,
      `/user/fiat_to_sila_transfer/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.transferMoneyByBankAccountSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.transferMoneyByBankAccountFail(error));
  }
}

// bank account = plaid account
// Benji wallet = sila account user
function* transferFromBenjiToBankAccount({ payload }) {
  try {
    const data = yield call(
      request,
      `/user/sila_to_fiat_transfer/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(
      ACTIONS.transferFromBenjiToBankAccountSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.transferFromBenjiToBankAccountFail(error));
  }
}

// Benji wallet = sila account user
function* transferMoneyByBenjiWalletAccount({ payload }) {
  try {
    const data = yield call(
      request,
      `/user/sila_to_sila_transfer/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(
      ACTIONS.transferMoneyByBenjiWalletAccountSuccess(serializeKeys(data))
    );
  } catch (error) {
    yield put(ACTIONS.transferMoneyByBenjiWalletAccountFail(error));
  }
}

function* requestPaymentSilaFromPersonalAccount({ payload }) {
  try {
    const data = yield call(
      request,
      `/user/request_sila`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.requestPaymentSilaSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.requestPaymentSilaFail(error));
  }
}

function* requestPaymentSilaFromCompanyAccount({ company_id, payload }) {
  try {
    const data = yield call(
      request,
      `/company/${company_id}/request_sila`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.requestPaymentSilaSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.requestPaymentSilaFail(error));
  }
}

function* getPlaidUserAccount() {
  try {
    const data = yield call(request, `/user/plaid/account/`, 'GET', null, true);
    yield put(ACTIONS.getPlaidUserAccountSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.getPlaidUserAccountFail(error));
  }
}

function* removePlaidUserAccount({ payload }) {
  try {
    const accountId = payload.account_id;
    const data = yield call(
      request,
      `/user/plaid/account/${accountId}`,
      'DELETE',
      null,
      true
    );
    yield put(ACTIONS.removePlaidUserAccountSuccess(serializeKeys(data)));
  } catch (error) {
    let dataError = {
      message: 'Can not remove your bank account',
    };
    yield put(ACTIONS.removePlaidUserAccountFail(dataError));
  }
}

function* getRecentlySendPayment() {
  try {
    const data = yield call(
      request,
      `/sila_user/list_last_transacted_user/`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.getRecentlySendPaymentSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.getRecentlySendPaymentFail(error));
  }
}

function* displayRegisterUserWallet({ payload }) {
  yield put(ACTIONS.displayRegisterUserWalletSuccess(payload));
}

function* addNewMember({ payload, companyId }) {
  try {
    const data = yield call(
      request,
      `/company/${companyId}/sila/member`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.addNewMemberSuccess(data));
  } catch (error) {
    yield put(ACTIONS.addNewMemberFail(error));
  }
}

function* updateMember({ payload, companyId, memberId }) {
  try {
    const data = yield call(
      request,
      `/company/${companyId}/sila/member/${memberId}`,
      'PUT',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.updateMemberSuccess(data));
  } catch (error) {
    yield put(ACTIONS.updateMemberFail(error));
  }
}

function* deleteMember({ companyId, memberId }) {
  try {
    const data = yield call(
      request,
      `/company/${companyId}/sila/member/${memberId}`,
      'DELETE',
      null,
      true
    );
    yield put(ACTIONS.deleteMemberSuccess(data));
  } catch (error) {
    yield put(ACTIONS.deleteMemberFail(error));
  }
}

function* requestListMembers({ payload }) {
  try {
    const company_id = payload.company_id;
    const data = yield call(
      request,
      `/company/${company_id}/sila/member`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.requestListMembersSuccess(data));
  } catch (error) {
    yield put(ACTIONS.requestListMembersFail(error));
  }
}

function* fetchCompanyWalletBal() {
  try {
    const data = yield call(
      request,
      `/user/sila_wallet/check_balance`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.fetchUserWalletBalSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchUserWalletBalFail(error));
  }
}

function* deleteUserAccount({ payload }) {
  try {
    const data = yield call(request, `/user/delete`, 'POST', payload, true);
    if (data) {
      if (data?.status === 'ok') {
        yield put(ACTIONS.deleteUserAccountSuccess(data));
      } else if (data?.status === 'you entered incorrect password') {
        yield put(ACTIONS.deleteUserAccountSuccess(data));
        notify(
          'error',
          'You have entered incorrect password, please try again!'
        );
      }
    }
  } catch (error) {
    yield put(ACTIONS.deleteUserAccountFail(error));
  }
}

export default function* userSaga() {
  yield takeLatest(CONSTANTS.FETCH_USER_SKILLS_REQUEST, fetchSkills);
  yield takeLatest(CONSTANTS.FETCH_USERS_REQUEST, fetchUsers);
  yield takeLatest(CONSTANTS.FETCH_USER_DETAIL_REQUEST, fetchUserDetail);
  yield takeEvery(CONSTANTS.UPDATE_USER_REQUEST, updateUser);
  yield takeEvery(CONSTANTS.UPDATE_USER_EXPERTISE_REQUEST, updateUserExpertise);
  yield takeEvery(CONSTANTS.CHANGE_PASSWORD_REQUEST, changePassword);
  yield takeEvery(CONSTANTS.INVITE_STAFF_REQUEST, inviteStaff);
  yield takeLatest(CONSTANTS.FETCH_USER_COMPANIES_REQUEST, fetchUserCompanies);
  yield takeLatest(CONSTANTS.FETCH_PRODUCERS_REQUEST, fetchProducers);
  yield takeLatest(CONSTANTS.GET_USER_WALLET, getUserWallet);
  yield takeLatest(
    COMMON_CONSTANTS.UPDATE_W9_DOCUMENT_REQUEST,
    updateW9Document
  );
  yield takeLatest(
    COMMON_CONSTANTS.REMOVE_W9_DOCUMENT_REQUEST,
    removeW9Document
  );
  yield takeLatest(CONSTANTS.REGISTER_SILA_USER, registerSilaUser);
  yield takeLatest(CONSTANTS.UPDATE_SILA_USER, updateSilaUser);
  yield takeLatest(CONSTANTS.GET_USER_SILA_KYC, getUserSilaKYC);
  yield takeLatest(CONSTANTS.POST_USER_REQUEST_KYC, postUserRequestKYC);
  yield takeLatest(
    CONSTANTS.UPLOAD_KYC_DOCUMENT_REQUEST,
    uploadKYCDocumentRequest
  );
  yield takeLatest(CONSTANTS.GET_SILA_USER, getCorporateSilaUser);
  yield takeLatest(
    CONSTANTS.GET_PLAID_LINK_TOKEN_REQUEST,
    getPlaidLinkUserToken
  );
  yield takeLatest(CONSTANTS.GET_PLAID_ACCOUNT_REQUEST, getPlaidUserAccount);
  yield takeLatest(CONSTANTS.REMOVE_PLAID_ACCOUNT, removePlaidUserAccount);
  yield takeLatest(CONSTANTS.GET_DOCUMENT_TYPE_USER, getDocumentTypeUser);
  yield takeLatest(
    CONSTANTS.DISPLAY_REGISTER_USER_WALLET,
    displayRegisterUserWallet
  );
  yield takeLatest(
    CONSTANTS.TRANSFER_MONEY_BY_BANK_ACCOUNT,
    transferMoneyByBankAccount
  );
  yield takeLatest(
    CONSTANTS.REQUEST_PAYMENT_SILA_FROM_PERSONAL_ACCOUNT,
    requestPaymentSilaFromPersonalAccount
  );
  yield takeLatest(
    CONSTANTS.REQUEST_PAYMENT_SILA_FROM_COMPANY_ACCOUNT,
    requestPaymentSilaFromCompanyAccount
  );

  yield takeLatest(
    CONSTANTS.TRANSFER_MONEY_FROM_BENJI_TO_BANK_ACCOUNT,
    transferFromBenjiToBankAccount
  );
  yield takeLatest(
    CONSTANTS.TRANSFER_MONEY_BY_BENJI_ACCOUNT,
    transferMoneyByBenjiWalletAccount
  );
  yield takeLatest(CONSTANTS.SEARCH_USER_PAYMENT, searchUserPayment);
  yield takeLatest(
    CONSTANTS.RECENTLY_USER_SEND_PAYMENT,
    getRecentlySendPayment
  );
  yield takeLatest(CONSTANTS.ADD_NEW_ROLE_MEMBER, addNewMember);
  yield takeLatest(CONSTANTS.UPDATE_ROLE_MEMBER, updateMember);
  yield takeLatest(CONSTANTS.DELETE_ROLE_MEMBER, deleteMember);
  yield takeLatest(CONSTANTS.REQUEST_LIST_MEMBERS, requestListMembers);
  yield takeLatest(
    CONSTANTS.FETCHING_USER_WALLET_BAL_REQUEST,
    fetchCompanyWalletBal
  );
  yield takeLatest(CONSTANTS.DELETE_USER_ACCOUNT_REQUEST, deleteUserAccount);
}
