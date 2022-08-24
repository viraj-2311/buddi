import { combineReducers } from 'redux';
import App from '@iso/redux/app/reducer';
import Auth from '@iso/redux/auth/reducer';
import AccountBoard from '@iso/redux/accountBoard/reducer';
import AccountWizard from '@iso/redux/accountWizard/reducer';
import ProducerJob from '@iso/redux/producerJob/reducer';
import ContractorJob from '@iso/redux/contractorJob/reducer';
import ContractorSchedule from '@iso/redux/contractorSchedule/reducer';
import User from '@iso/redux/user/reducer';
import Notification from '@iso/redux/notification/reducer';
import Company from '@iso/redux/company/reducer';
import Location from '@iso/redux/location/reducer';
import Modal from '@iso/redux/modal/reducer';
import LanguageSwitcher from '@iso/redux/languageSwitcher/reducer';
import Chat from '@iso/redux/chat/reducer';
import JobLocation from '@iso/redux/jobLocation/reducer';
import JobCallsheet from '@iso/redux/jobCallsheet/reducer';
import JobSchedule from '@iso/redux/jobSchedule/reducer';
import JobEvent from '@iso/redux/jobEvent/reducer';
import JobEventNote from '@iso/redux/jobEventNote/reducer';
import JobShootNote from '@iso/redux/jobShootNote/reducer';
import JobBid from '@iso/redux/jobBid/reducer';
import JobScript from '@iso/redux/jobScript/reducer';
import JobDocument from '@iso/redux/jobDocument/reducer';
import JobAgency from '@iso/redux/jobAgency/reducer';
import JobClient from '@iso/redux/jobClient/reducer';
import JobCast from '@iso/redux/jobCast/reducer';
import JobInvoice from '@iso/redux/jobInvoice/reducer';
import JobPreProduction from '@iso/redux/jobPreProduction/reducer';
import PersonalNetwork from '@iso/redux/personalNetwork/reducer';
import CompanyNetwork from '@iso/redux/companyNetwork/reducer';
import ContractorInvoice from '@iso/redux/contractorInvoice/reducer';
import CompanyDocument from '@iso/redux/companyDocument/reducer';
import Wallet from '@iso/redux/wallet/reducer';
import UserIntro from '@iso/redux/intro/reducer';
import storage from 'redux-persist/lib/storage';
import { persistor } from './store';

const appReducer = combineReducers({
  Auth,
  AccountBoard,
  AccountWizard,
  ProducerJob,
  ContractorJob,
  ContractorSchedule,
  App,
  User,
  Company,
  Notification,
  Modal,
  LanguageSwitcher,
  Chat,
  Location,
  JobLocation,
  JobCallsheet,
  JobSchedule,
  JobEvent,
  JobEventNote,
  JobShootNote,
  JobBid,
  JobScript,
  JobDocument,
  JobAgency,
  JobClient,
  JobCast,
  JobInvoice,
  JobPreProduction,
  PersonalNetwork,
  CompanyNetwork,
  ContractorInvoice,
  CompanyDocument,
  Wallet,
  UserIntro,
});

// set all the state to initial state
const rootReducer = (state, action) => {
  if (action.type === 'SIGNOUT') {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
