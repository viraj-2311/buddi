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
import VerifyKYB from './VerifyKYB.style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row, Col } from 'antd';
import basicStyle from '@iso/assets/styles/constants';
import IconInfo from '@iso/assets/images/ic_info.svg';
import { WalletStatus } from '@iso/enums/wallet_status';
const { rowStyle, gutter } = basicStyle;

export default forwardRef(({ goToLinkAccount, goToDashboard }, ref) => {
  const dispatch = useDispatch();
  const { companyWallet, silaKYB } = useSelector((state) => state.Company);
  const [statusVerify, setStatusVerify] = useState(WalletStatus.Pending);
  const [usernameSila, setUsernameSila] = useState('');

  useEffect(() => {
    if (silaKYB && silaKYB.silaKYB && silaKYB.silaKYB.id && !silaKYB.loading) {
      let username = silaKYB.silaKYB.silaCorporate.legalCompanyName;
      setStatusVerify(silaKYB.silaKYB.verificationStatus);
      setUsernameSila(username);
    }
  }, [silaKYB]);
  return (
    <VerifyKYB>
      <div>
        <p className='verification-title'>Business & ID Verification</p>
        <span className='description'>
          We must verify that all users are who they say they are, present a low
          fraud risk, and are not on any watchlists. The members of this
          business will be submitted for review. The business will not be able
          to transact until all users are verified. Additionally, the business
          will be submitted for Business Verification review to ensure that all
          information is correct.
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
        <p className='verification-status'>Business Verification</p>
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
          type='primary'
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
    </VerifyKYB>
  );
});
