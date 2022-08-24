import { put, takeLatest, takeEvery, call } from 'redux-saga/effects';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';
import cloneDeep from 'lodash/cloneDeep';
import notify from '@iso/lib/helpers/notify';


function* fetchCompanies() {
  try {
    const data = yield call(request, '/company/', 'GET', null, false);
    yield put(ACTIONS.fetchCompaniesSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchCompaniesFail(error));
  }
}

function* fetchCompanyDetail({ id }) {
  try {
    const data = yield call(request, `/company/${id}/`, 'GET', null, true);
    yield put(ACTIONS.fetchCompanyDetailSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchCompanyDetailFail(error));
  }
}

function* fetchCompanyProfile({ id }) {
  try {
    const data = yield call(
      request,
      `/production_company/${id}/profile/`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.fetchCompanyProfileSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchCompanyProfileFail(error));
  }
}

function* createCompany({ payload }) {
  try {
    const data = yield call(
      request,
      `/company/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.createCompanySuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.createCompanyFail(error));
  }
}

function* updateCompany({ id, payload }) {
  try {
    const data = yield call(
      request,
      `/company/${id}/`,
      'PATCH',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.updateCompanySuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateCompanyFail(error));
  }
}

function* updateCompanyProfile({ id, payload }) {
  try {
    const data = yield call(
      request,
      `/production_company/${id}/profile/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.updateCompanyProfileSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateCompanyProfileFail(error));
  }
}

function* acceptCompanyPermissionByOwner({ token }) {
  try {
    const returnUri = yield call(
      request,
      `/validation/accept_company_access_token/${token}/`,
      'GET',
      null,
      false
    );
    yield put(ACTIONS.acceptCompanyPermissionByOwnerSuccess());
    window.location.href = returnUri;
  } catch (error) {
    yield put(ACTIONS.acceptCompanyPermissionByOwnerFail(error));
  }
}

function* declineCompanyPermissionByOwner({ token }) {
  try {
    const returnUri = yield call(
      request,
      `/validation/decline_company_access_token/${token}/`,
      'GET',
      null,
      false
    );
    yield put(ACTIONS.declineCompanyPermissionByOwnerSuccess());
    window.location.href = returnUri;
  } catch (error) {
    yield put(ACTIONS.declineCompanyPermissionByOwnerFail(error));
  }
}

function* fetchCompanyType() {
  try {
    const data = yield call(request, `/company_types/`, 'GET', null, true);
    yield put(ACTIONS.fetchCompanyTypeSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchCompanyTypeFail(error));
  }
}

function* fetchBusinessType() {
  try {
    const data = yield call(request, `/business_types/`, 'GET', null, true);
    yield put(ACTIONS.fetchBusinessTypeSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchBusinessTypeFail(error));
  }
}

function* registerSilaCompany(companyInfo) {
  try {
    const { id, payload } = companyInfo.payload;
    const data = yield call(
      request,
      `/company/${id}/sila/register/`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.registerSilaCompanySuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.registerSilaCompanyFail(error));
  }
}

function* updateSilaCompany(companyInfo) {
  try {
    const { id, payload } = companyInfo.payload;
    const data = yield call(
      request,
      `/company/${id}/sila/corporate-info/`,
      'PUT',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.updateSilaCompanySuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateSilaCompanyFail(error));
  }
}

function* getCompanyWallet({ payload }) {
  try {
    const id = payload;
    const data = yield call(
      request,
      `/company/${id}/sila/wallet/`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.getCompanyWalletSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.getCompanyWalletFail(error));
  }
}

function* getCorporateSilaCompany({ payload }) {
  try {
    const id = payload;
    const data = yield call(
      request,
      `/company/${id}/sila/corporate-info/`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.getCorporateSilaCompanySuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.getCorporateSilaCompanyFail(error));
  }
}

function* getCompanySilaKYB({ payload }) {
  try {
    const id = payload;
    const data = yield call(
      request,
      `/company/${id}/sila/kyb/`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.getCompanySilaKYBSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.getCompanySilaKYBFail(error.error));
  }
}

function* postCompanyRequestKYB({ payload }) {
  try {
    const id = payload;
    const data = yield call(
      request,
      `/company/${id}/sila/kyb/`,
      'POST',
      null,
      true
    );
    yield put(ACTIONS.postCompanyRequestKYBSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.postCompanyRequestKYBFail(error));
  }
}

function* uploadKYBDocumentRequest({ payload }) {
  try {
    const { companyId, formData } = payload;
    const data = yield call(
      request,
      `/company/${companyId}/sila/kyb/document`,
      'POST',
      formData,
      true,
      false,
      true
    );
    yield put(ACTIONS.uploadKYBDocumentSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.uploadKYBDocumentFail(error));
  }
}

function* getPlaidLinkCompanyToken({ payload }) {
  try {
    const { id, plaidToken, accounts } = payload;
    if (plaidToken) {
      let param = { public_token: plaidToken, company_id: id, accounts: accounts };
      const data = yield call(
        request,
        `/user/plaid/token/`,
        'PATCH',
        deserializeKeys(param),
        true
      );
      yield put(ACTIONS.getPlaidLinkCompanyAccountConnected());
    } else {
      let param = { company_id: id };
      const data = yield call(
        request,
        `/user/plaid/token/`,
        'POST',
        deserializeKeys(param),
        true
      );
      yield put(ACTIONS.getPlaidLinkCompanyTokenSuccess(serializeKeys(data)));
    }
  } catch (error) {
    yield put(ACTIONS.getPlaidLinkCompanyTokenFail(error));
  }
}

function* getPlaidCompanyAccount({ payload }) {
  try {
    const id = payload;
    const data = yield call(
      request,
      `/company/${id}/plaid/account/`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.getPlaidCompanyAccountSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.getPlaidCompanyAccountFail(error));
  }
}

function* removePlaidCompanyAccount({ payload }) {
  try {
    const companyId = payload.company_id;
    const accountId = payload.account_id;
    const data = yield call(
      request,
      `/company/${companyId}/plaid/account/${accountId}`,
      'DELETE',
      null,
      true
    );
    yield put(ACTIONS.removePlaidCompanyAccountSuccess(serializeKeys(data)));
  } catch (error) {
    let dataError = {
      message: 'Can not remove company bank account',
    };
    yield put(ACTIONS.removePlaidCompanyAccountFail(dataError));
  }
}

// bank account = plaid account
function* paidInvoicesByBankAccount({ payload }) {
  try {
    const data = yield call(
      request,
      `/user/fiat_to_sila_transfer/bulk_pay`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.paidInvoicesByBankAccountSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.paidInvoicesByBankAccountFail(error));
  }
}

function* requestSingIntoCompany({ payload }) {
  try {
    const data = yield call(
      request,
      `/user/fiat_to_sila_transfer/bulk_pay`,
      'POST',
      deserializeKeys(payload),
      true
    );
    yield put(ACTIONS.requestSignIntoCompanySuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.requestSignIntoCompanyFail(error));
  }
}


function* fetchCompanyWalletBal({ companyID }) {
  try {
    const data = yield call(
      request,
      `/company/${companyID}/check_balance`,
      'GET',
      null,
      true
    );
    yield put(ACTIONS.fetchCompanyWalletBalSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchCompanyWalletBalFail(error));
  }
}

function* deleteCompanyAccount({ companyID, payload }) {
  try {
    const data = yield call(
      request,
      `/company/${companyID}/delete`,
      'POST',
      payload,
      true
    );
    if(data) {
      if(data?.status === "ok"){
        yield put(ACTIONS.deleteCompanyAccountSuccess(data));
      } else if(data?.status === "Incorrect password") {
        yield put(ACTIONS.deleteCompanyAccountSuccess(data));
        notify('error', 'You have entered incorrect password, please try again!')
      }
    }
  } catch (error) {
    yield put(ACTIONS.deleteCompanyAccountFail(error));
  }
}

export default function* companySaga() {
  yield takeLatest(CONSTANTS.FETCH_COMPANIES_REQUEST, fetchCompanies);
  yield takeLatest(CONSTANTS.FETCH_COMPANY_DETAIL_REQUEST, fetchCompanyDetail);
  yield takeLatest(CONSTANTS.REGISTER_SILA_COMPANY, registerSilaCompany);
  yield takeLatest(CONSTANTS.UPDATE_SILA_COMPANY, updateSilaCompany);
  yield takeLatest(CONSTANTS.GET_SILA_COMPANY, getCorporateSilaCompany);
  yield takeLatest(CONSTANTS.GET_COMPANY_WALLET, getCompanyWallet);
  yield takeLatest(CONSTANTS.CREATE_COMPANY_REQUEST, createCompany);
  yield takeLatest(CONSTANTS.UPDATE_COMPANY_REQUEST, updateCompany);
  yield takeLatest(
    CONSTANTS.FETCH_COMPANY_PROFILE_REQUEST,
    fetchCompanyProfile
  );
  yield takeEvery(
    CONSTANTS.UPDATE_COMPANY_PROFILE_REQUEST,
    updateCompanyProfile
  );
  yield takeEvery(
    CONSTANTS.ACCEPT_COMPANY_PERMISSION_BY_OWNER_REQUEST,
    acceptCompanyPermissionByOwner
  );
  yield takeEvery(
    CONSTANTS.DECLINE_COMPANY_PERMISSION_BY_OWNER_REQUEST,
    declineCompanyPermissionByOwner
  );
  yield takeEvery(CONSTANTS.FETCH_COMPANY_TYPE_REQUEST, fetchCompanyType);
  yield takeEvery(CONSTANTS.FETCH_BUSINESS_TYPE_REQUEST, fetchBusinessType);
  yield takeEvery(CONSTANTS.GET_COMPANY_SILA_VERIFICATION, getCompanySilaKYB);
  yield takeEvery(CONSTANTS.POST_COMPANY_REQUEST_KYB, postCompanyRequestKYB);
  yield takeLatest(
    CONSTANTS.UPLOAD_KYB_DOCUMENT_REQUEST,
    uploadKYBDocumentRequest
  );
  yield takeEvery(
    CONSTANTS.GET_PLAID_LINK_COMPANY_TOKEN_REQUEST,
    getPlaidLinkCompanyToken
  );
  yield takeEvery(
    CONSTANTS.GET_PLAID_COMPANY_ACCOUNT_REQUEST,
    getPlaidCompanyAccount
  );
  yield takeEvery(
    CONSTANTS.REMOVE_PLAID_COMPANY_ACCOUNT,
    removePlaidCompanyAccount
  );
  yield takeEvery(
    CONSTANTS.PAID_INVOICES_BY_BANK_ACCOUNT,
    paidInvoicesByBankAccount
  );
  yield takeEvery(
    CONSTANTS.REQUEST_SIGN_INTO_COMPANY_REQUEST,
    requestSingIntoCompany
  );
  yield takeEvery(
    CONSTANTS.FETCHING_COMPANY_WALLET_BAL_REQUEST,
    fetchCompanyWalletBal
  );
  yield takeEvery(
    CONSTANTS.DELETE_COMPANY_ACCOUNT_REQUEST,
    deleteCompanyAccount
  );
}
