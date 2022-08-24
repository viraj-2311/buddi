import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SetupWalletStyleWrapper from './SetupUserWallet.style';
import Logo from '@iso/assets/images/benji-wallet.png';
import LinkBankAccount from './LinkBankAccount';
import WalletUserRegister from './WalletUserRegister';
import VerifyKYC from './VerifyKYC';
import { useHistory } from 'react-router-dom';
import { WalletStatus } from '@iso/enums/wallet_status';
import { getUserSilaKYC } from '@iso/redux/user/actions';

const SetupWallet = forwardRef(
  ({ onClose, userDetail, statusWallet, allowDisplayPopup }, ref) => {
    const dispatch = useDispatch();
    let history = useHistory();
    const walletUserRegisterRef = useRef();
    const INITIAL_STEP = 0;
    const MAX_STEP = 2;
    const [steps, setSteps] = useState([
      { title: 'Register User' },
      {
        title: statusWallet ? 'ID Verification' : 'Request KYC',
      },
      { title: 'Link Account' },
    ]);

    const [step, setStep] = useState(
      statusWallet === 'passed' || statusWallet === 'pending' ? 1 : INITIAL_STEP
    );

    const hideRegisterSuccessPopup = () => {
      walletUserRegisterRef.current &&
        walletUserRegisterRef.current.hidePopupSuccess();
    };

    const goToNextStep = () => {
      setStep(step + 1);
    };

    const goToLinkAccount = () => {
      setStep(2);
    };

    const goToDashboard = () => {
      if (statusWallet == 'pending') {
        setTimeout(() => {
          dispatch(getUserSilaKYC());
        }, 1000);
      }
      onClose();
      history.push('/jobs');
    };

    const goToWallet = () => {
      onClose();
      history.push('/wallet');
    };

    useImperativeHandle(ref, () => ({
      reset() {
        if (statusWallet == 'passed' || statusWallet == 'pending') {
          setStep(1);
        } else {
          setStep(INITIAL_STEP);
        }
        hideRegisterSuccessPopup();
      },
    }));

    return (
      <SetupWalletStyleWrapper>
        <div className='setup-wallet-container'>
          <div className='setup-wallet-container__header'>
            <img src={Logo} height='56px' />
          </div>
          <div className='setup-wallet-container__body'>
            {step === INITIAL_STEP && (
              <WalletUserRegister
                userDetail={userDetail}
                statusWallet={statusWallet}
                allowDisplayPopup={allowDisplayPopup}
                goToNextStep={goToNextStep}
                ref={walletUserRegisterRef}
              />
            )}
            {step === 1 && (
              <VerifyKYC
                goToDashboard={goToDashboard}
                goToLinkAccount={goToLinkAccount}
              />
            )}
            {step === MAX_STEP && (
              <LinkBankAccount goToWallet={goToWallet} company={null} />
            )}
          </div>
          {step < MAX_STEP && (
            <div className='step-view'>
              <div className='connection-line' />
              {steps.map((item, index) => (
                <div className='item-step' key={'step-' + index}>
                  <div
                    className={`circle-step ${
                      index <= step || (statusWallet && index == 1)
                        ? 'completed-step'
                        : ''
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
      </SetupWalletStyleWrapper>
    );
  }
);

export default SetupWallet;
