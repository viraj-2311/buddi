import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import CreateCompanyModal from '../Authentication/SignUp/CreateCompanyModal';
import { setAuthUser, syncAuthUserRequest } from '@iso/redux/auth/actions';
import { isContractor } from '@iso/lib/helpers/auth';
import { formatDateString } from '@iso/lib/helpers/utility';
import { dateFormat } from '@iso/config/datetime.config';

export default () => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.Auth);
  const [visibleCreateCompany, setVisibleCreateCompany] = useState(false);
  useState(false);

  useEffect(() => {
    if (isContractor(authUser) && !authUser.lastLogin) {
      // setVisibleCreateCompany(true);
    }
  }, [authUser]);

  const onCancelCreateCompany = () => {
    setVisibleCreateCompany(false);
  };

  const onSkipCreateCompany = () => {
    const now = formatDateString(new Date(), dateFormat);
    dispatch(setAuthUser({ lastLogin: now }));
    setVisibleCreateCompany(false);
  };

  const handleSuccessCompanyCreate = () => {
    dispatch(syncAuthUserRequest());
    setVisibleCreateCompany(false);
  };

  return (
    <LayoutContentWrapper style={{ height: '100vh' }}>
      <LayoutContent>
        <CreateCompanyModal
          visible={visibleCreateCompany}
          user={authUser}
          onCreate={handleSuccessCompanyCreate}
          onSkip={onSkipCreateCompany}
          onCancel={onCancelCreateCompany}
        />
        <h1>DASHBOARD HOME</h1>
        {/* <h1>CONTRACTOR DASHBOARD HOME</h1> */}
      </LayoutContent>
    </LayoutContentWrapper>
  );
};
