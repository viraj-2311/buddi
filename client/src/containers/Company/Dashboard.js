import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import Button from '@iso/components/uielements/button';
import {
  showStaffInvitation,
  closeStaffInvitation,
} from '@iso/redux/modal/actions';
import { isProducer } from '@iso/lib/helpers/auth';
import { setAuthUser } from '@iso/redux/auth/actions';
import { formatDateString } from '@iso/lib/helpers/utility';
import { dateFormat } from '@iso/config/datetime.config';

export default () => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.Auth);

  useEffect(() => {
    if (isProducer(authUser) && !authUser.lastLogin) {
      dispatch(
        showStaffInvitation({
          props: {
            cancelButton: (
              <Button
                type='link'
                className='skipBtn'
                onClick={handleSkipInvite}
              >
                Don't show me again
              </Button>
            ),
          },
        })
      );
    }
  }, [authUser]);

  const handleSkipInvite = () => {
    const now = formatDateString(new Date(), dateFormat);
    dispatch(setAuthUser({ lastLogin: now }));
    dispatch(closeStaffInvitation());
  };

  return (
    <LayoutContentWrapper style={{ height: '100vh' }}>
      <LayoutContent>
        <h1>PRODUCER DASHBOARD HOME</h1>
      </LayoutContent>
    </LayoutContentWrapper>
  );
};
