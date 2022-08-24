import React from 'react';
import CreateCompanyConfirmWrapper from './CreateCompanyConfirm.style';
import Button from '@iso/components/uielements/button';
import Logo from '@iso/assets/images/logo-black.webp';
import RightArrow from '@iso/assets/images/arrow.svg';
import FingerPoint from '@iso/assets/images/finger-point.svg';

const CreateCompanyConfirm = ({ onYes, onNo }) => {
  return (
    <CreateCompanyConfirmWrapper>
      <div className='confirmTopWrapper'>
        <div className='benjiLogoWrapper'>
          <img src={Logo} className='logo' />
        </div>
        <h2 className='confirmTitle'>Create your Bandleader</h2>
        <div className='confirmText'>
          <p>Need to Hire and Manage Crew for your Jobs?</p>
          <p>
            Click on <span className='hintWord'>Create Company Button</span> to
            create an account for your Production Company
          </p>
        </div>
        <div className='actions'>
          <Button
            type='primary'
            className='createCompanyBtn'
            onClick={(e) => onYes()}
          >
            Create Band
          </Button>
          <Button type='link' onClick={(e) => onNo()}>
            Skip this step
          </Button>
        </div>
      </div>
      <div className='divider' />
      <div className='confirmBottomWrapper'>
        <h2 className='noteTitle'>Note:</h2>

        <div className='noteText'>
          In Future if you want to create your company go to{' '}
          <span className='hintWord'>Settings</span> and click on{' '}
          <span className='hintWord'>Create Band</span> Button.
        </div>

        <div className='noteFlowWrapper'>
          <div className='noteFlowText'>Settings</div>
          <div className='noteFlowIconWrapper'>
            <img src={RightArrow} />
          </div>
          <div className='noteFlowBtnWrapper'>
            <Button type='primary'>Create Company</Button>
            <img src={FingerPoint} className='btnHelperIcon' />
          </div>
        </div>
      </div>
    </CreateCompanyConfirmWrapper>
  );
};

export default CreateCompanyConfirm;
