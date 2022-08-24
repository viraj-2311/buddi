import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCompanySilaKYB } from '@iso/redux/company/actions';
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom';
import SetupCompanyWalletStyleWrapper from './SetupCompanyWallet.style';
import Button from '@iso/components/uielements/button';
import Logo from '@iso/assets/images/benji-wallet.png';
import BackArrow from '@iso/components/icons/BackArrow';
import NextArrow from '@iso/components/icons/NextArrow';
import WalletCompanyBussinessType from './WalletCompanyBussinessType';
import WalletCompanyRegister from './WalletCompanyRegister';
import RegisterSuccess from './RegisterSuccess';
import LinkBankAccount from './LinkBankAccount';
import VerifyKYB from './VerifyKYB';
import { WalletStatus } from '@iso/enums/wallet_status';
import { Steps } from 'antd';
const { Step } = Steps;

const SetupCompanyWallet = forwardRef(
  ({ onClose, allowDisplayPopup, statusWallet }, ref) => {
    let history = useHistory();
    const dispatch = useDispatch();
    const walletCompanyRegisterRef = useRef();
    const walletBusinessTypeRef = useRef();
    const { company, businessTypeList, companyTypeList } = useSelector(
      (state) => state.Company
    );
    const INITIAL_STEP = 0;
    const MAX_STEP = 3;
    const [step, setStep] = useState(INITIAL_STEP);
    const [firstStepInfo, updateFirstStepInfo] = useState();
    const [steps, setSteps] = useState([
      { title: 'Register Business' },
      { title: 'Business Members' },
      { title: 'Business & ID Verification' },
    ]);
    const canBack = () => step > INITIAL_STEP;

    const canNext = () => step < MAX_STEP;

    useEffect(() => {
      if (
        statusWallet == WalletStatus.Pending ||
        statusWallet == WalletStatus.Success
      ) {
        setStep(2);
      }
    }, []);

    const getBusinessType = () => {
      walletBusinessTypeRef.current &&
        walletBusinessTypeRef.current.getInfoBusinessType();
    };

    const getDataRegister = () => {
      walletCompanyRegisterRef.current &&
        walletCompanyRegisterRef.current.getInfoRegister();
    };

    const goToNextStep = (companyUpdate) => {
      updateFirstStepInfo(companyUpdate);
      setStep(step + 1);
    };

    const goToSecondStep = (wallet) => {
      setStep(step + 1);
    };

    const goToLinkAccount = () => {
      setStep(3);
    };

    const goToDashboard = () => {
      if (statusWallet == 'pending') {
        setTimeout(() => {
          dispatch(getCompanySilaKYB(company.id));
        }, 1000);
      }
      onClose();
      history.push(`/companies/${company.id}/jobs`);
    };

    const goToWallet = () => {
      onClose();
      history.push(`/companies/${company.id}/wallet`);
    };

    useImperativeHandle(ref, () => ({
      reset() {
        if (statusWallet === 'passed' || statusWallet === 'pending') {
          setStep(2);
        } else {
          setStep(INITIAL_STEP);
        }
      },
    }));

    return (
      <SetupCompanyWalletStyleWrapper>
        <div className={'setup-wallet-container'}>
          <div className='setup-wallet-container__header'>
            <img src={Logo} height='56px' />
          </div>
          <div className='setup-wallet-container__body'>
            {step === INITIAL_STEP && (
              <WalletCompanyBussinessType
                company={company}
                businessTypeList={businessTypeList}
                companyTypeList={companyTypeList}
                goToNextStep={goToNextStep}
                allowDisplayPopup={allowDisplayPopup}
                ref={walletBusinessTypeRef}
              />
            )}
            {step === 1 && (
              <WalletCompanyRegister
                firstStepInfo={firstStepInfo}
                company={company}
                goToSecondStep={goToSecondStep}
                ref={walletCompanyRegisterRef}
                allowDisplayPopup={allowDisplayPopup}
              />
            )}
            {step === 2 && (
              <VerifyKYB
                goToDashboard={goToDashboard}
                goToLinkAccount={goToLinkAccount}
              />
            )}
            {step === MAX_STEP && (
              <LinkBankAccount goToWallet={goToWallet} companyId={company.id} />
            )}
          </div>
          {step < MAX_STEP && (
            <div className='step-view'>
              <div className='connection-line' />
              {steps.map((item, index) => (
                <div className='item-step'>
                  <div
                    className={`circle-step ${
                      index <= step ? 'completed-step' : ''
                    }`}
                  >
                    <span>{index + 1}</span>
                  </div>
                  <div className='step-title'>{item.title}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SetupCompanyWalletStyleWrapper>
    );
  }
);

export default SetupCompanyWallet;
