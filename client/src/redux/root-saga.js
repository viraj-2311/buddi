import { all } from 'redux-saga/effects';
import authSaga from '@iso/redux/auth/saga';
import accountboardSaga from '@iso/redux/accountBoard/saga';
import accountWizardSaga from '@iso/redux/accountWizard/saga';
import producerJobSaga from '@iso/redux/producerJob/saga';
import jobLocationSaga from '@iso/redux/jobLocation/saga';
import jobCallsheetSaga from '@iso/redux/jobCallsheet/saga';
import contractorJobSaga from '@iso/redux/contractorJob/saga';
import userSaga from '@iso/redux/user/saga';
import companySaga from '@iso/redux/company/saga';
import locationSaga from '@iso/redux/location/saga';
import chatSaga from '@iso/redux/chat/saga';
import jobEventSaga from '@iso/redux/jobEvent/saga';
import jobEventNoteSaga from '@iso/redux/jobEventNote/saga';
import jobShootNoteSaga from '@iso/redux/jobShootNote/saga';
import contractorScheduleSaga from '@iso/redux/contractorSchedule/saga';
import jobBidSaga from '@iso/redux/jobBid/saga';
import jobScriptSaga from '@iso/redux/jobScript/saga';
import jobDocumentSaga from '@iso/redux/jobDocument/saga';
import jobAgencySaga from '@iso/redux/jobAgency/saga';
import jobClientSaga from '@iso/redux/jobClient/saga';
import jobCastSaga from '@iso/redux/jobCast/saga';
import jobInvoiceSaga from '@iso/redux/jobInvoice/saga';
import jobPreProductionSaga from '@iso/redux/jobPreProduction/saga';
import personalNetworkSaga from '@iso/redux/personalNetwork/saga';
import companyNetworkSaga from '@iso/redux/companyNetwork/saga';
import contractorInvoiceSaga from '@iso/redux/contractorInvoice/saga';
import companyDocumentSaga from '@iso/redux/companyDocument/saga';
import walletSaga from '@iso/redux/wallet/saga';
import userIntroSaga from '@iso/redux/intro/saga';

export default function* rootSaga(getState) {
  yield all([
    authSaga(),
    accountboardSaga(),
    accountWizardSaga(),
    producerJobSaga(),
    contractorJobSaga(),
    userSaga(),
    companySaga(),
    chatSaga(),
    locationSaga(),
    jobLocationSaga(),
    jobCallsheetSaga(),
    jobEventSaga(),
    jobEventNoteSaga(),
    jobShootNoteSaga(),
    contractorScheduleSaga(),
    jobBidSaga(),
    jobScriptSaga(),
    jobDocumentSaga(),
    jobAgencySaga(),
    jobClientSaga(),
    jobCastSaga(),
    jobInvoiceSaga(),
    jobPreProductionSaga(),
    personalNetworkSaga(),
    companyNetworkSaga(),
    contractorInvoiceSaga(),
    companyDocumentSaga(),
    walletSaga(),
    userIntroSaga(),
  ]);
}
