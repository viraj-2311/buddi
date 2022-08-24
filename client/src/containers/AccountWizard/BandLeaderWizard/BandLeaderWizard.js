import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { BandProfile, BandLogoUpload, PersonalProfile, PersonalPhotoUpload } from '@iso/containers/AccountWizard/components';
import AccountTypes from '@iso/enums/account_types';
import CompanyOwner from '../CompanyOwner';



import {
  nextWizardStep,
  completeWizardRequest,
} from '@iso/redux/accountWizard/actions';

const BandLeaderAccountWizard = ({ step }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { user: authUser } = useSelector((state) => state.Auth);

  const handleStepSuccess = () => {
    if (step === 5) {
      dispatch(completeWizardRequest(authUser.id, AccountTypes.COMPANY));
      history.push('/account/bandleader/success');
    } else {
      dispatch(nextWizardStep());
    }
  };

  const handleStepSkip = () => {
    if (step === 5) {
      dispatch(completeWizardRequest(authUser.id, AccountTypes.COMPANY));
      history.push('/account/bandleader/success');
    } else {
      dispatch(nextWizardStep());
    }
  };

  if (step === 1) {
    return <CompanyOwner onSuccess={handleStepSuccess} />;
  }
  if (step === 2) {
    return (
      <BandProfile
        title='Setup a Band Profile'
        subTitle='Fill Out Form'
        onSuccess={handleStepSuccess}
      />
    );
  }

  if (step === 3) {
    return (
      <BandLogoUpload
        title='Complete Your Band Profile'
        subTitle='Upload Band Logo'
        onSuccess={handleStepSuccess}
      />
    );
  }

  if (step === 4) {
    return (
      <PersonalProfile
        title='Setup Your Personal Profile'
        subTitle='Fill Out Form'
        titleDescription='This is different from your band profile so people can connect with you personally'
        onSuccess={handleStepSuccess}
        onSkip={handleStepSkip}
        isBandLeader
      />
    );
  }

  if (step === 5) {
    return (
      <PersonalPhotoUpload
        title='Upload Your Profile Picture'
        subTitle='Upload Profile Photo'
        onSuccess={handleStepSuccess}
        onSkip={handleStepSkip}
      />
    );
  }
};

export default BandLeaderAccountWizard;
