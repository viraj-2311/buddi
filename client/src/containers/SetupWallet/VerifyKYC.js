import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@iso/components/uielements/button';
import CheckIcon from '@iso/components/icons/Check';
import VerifyKYC from './VerifyKYC.style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row, Col } from 'antd';
import basicStyle from '@iso/assets/styles/constants';
import IconInfo from '@iso/assets/images/ic_info.svg';
import { WalletStatus } from '@iso/enums/wallet_status';
const { rowStyle, gutter } = basicStyle;

export default forwardRef(({ goToLinkAccount, goToDashboard }, ref) => {
  const dispatch = useDispatch();
  const { silaKYC } = useSelector((state) => state.User);
  const [statusVerify, setStatusVerify] = useState(WalletStatus.Pending);
  const [usernameSila, setUsernameSila] = useState('');
  useEffect(() => {
    if (silaKYC && silaKYC.silaKYC && silaKYC.silaKYC.id && !silaKYC.loading) {
      let username =
        silaKYC.silaKYC.silaUser.firstName + silaKYC.silaKYC.silaUser.lastName;
      setStatusVerify(silaKYC.silaKYC.verificationStatus);
      setUsernameSila(username);
    }
  }, [silaKYC]);

  return (
    <VerifyKYC>
      <div>
        <p className='verification-title'>ID Verification</p>
        <span className='description'>
          We must verify that all users of the Buddi platform are who they say
          they are, present a low fraud risk, and are not on any watchlists. We
          do this by submitting end-user information for review by our identity
          verification partner. The user will not be able to transact until the
          user is verified.
        </span>
      </div>
      <div className='overview-message'>
        <img src={IconInfo} alt='info' className='historyIcon' />
        <div className='info-desc'>
          <span>
            Verification may take a few minutes, you can go back to dashboard
            and check your status on the header section.
          </span>
        </div>
      </div>
      <div>
        <p className='verification-status'>ID Verification Status</p>
        <div className='pending-status'>
          <p className='username'>{usernameSila}</p>
          {statusVerify == WalletStatus.Pending ? (
            <span className='pending'>Pending</span>
          ) : statusVerify == WalletStatus.Success ? (
            <span className='success'>Success</span>
          ) : (
            <span className='failed'>Failed</span>
          )}
        </div>
      </div>
      <Row style={rowStyle} gutter={gutter} justify='center'>
        <Button
          htmlType='submit'
          type='white-style'
          shape='round'
          className='buttonWrapBack'
          onClick={goToDashboard}
        >
          Go to Dashboard
        </Button>
        <Button
          htmlType='submit'
          type='primary'
          shape='round'
          className={
            statusVerify == WalletStatus.Success
              ? 'buttonWrap'
              : 'buttonWrap disableButton'
          }
          disabled={statusVerify != WalletStatus.Success}
          onClick={() => {
            if (statusVerify == WalletStatus.Success) {
              goToLinkAccount();
            }
          }}
        >
          Next
        </Button>
      </Row>
    </VerifyKYC>
  );
});
