import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import BandLeaderAccountSuccess from '@iso/containers/AccountWizard/BandLeaderWizard/Success';
import TalentAccountSuccess from '@iso/containers/AccountWizard/TalentWizard/Success';
import AccountTypes from '@iso/enums/account_types';
import notify from '@iso/lib/helpers/notify';
import { syncAuthUserRequest } from '@iso/redux/auth/actions';
import { showServerError } from '@iso/lib/helpers/utility';

export default () => {
  const dispatch = useDispatch();
  const { syncUser } = useSelector((state) => state.Auth);
  const history = useHistory();
  const { accountType } = useParams();
  const [action, setAction] = useState('');
  const { complete } = useSelector((state) => state.AccountWizard);

  useEffect(() => {
    if (!syncUser.loading && !syncUser.error && action === 'sync') {
      history.push('/jobs');
    }

    if (syncUser.error && action === 'sync') {
      notify('error', showServerError(syncUser.error));
    }

    if (!syncUser.loading && action === 'sync') {
      setAction('');
    }
  }, [syncUser]);

  const handleSkipAndDashboard = () => {
    setAction('sync');
    dispatch(syncAuthUserRequest());
  };

  useEffect(() => {
    if (complete.data) {
      dispatch(syncAuthUserRequest());
    }
  }, [complete]);

  if (accountType === AccountTypes.BAND_LEADER.toLowerCase()) {
    return <BandLeaderAccountSuccess onSkip={handleSkipAndDashboard} />;
  }
  if (accountType === AccountTypes.TALENT.toLowerCase()) {
    return <TalentAccountSuccess onSkip={handleSkipAndDashboard} />;
  }
}
