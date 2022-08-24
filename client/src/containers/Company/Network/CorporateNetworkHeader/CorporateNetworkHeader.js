import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import CorporateNetworkHeaderWrapper from './CorporateNetworkHeader.style';
import Button from '@iso/components/uielements/button';
import UserConnectionIcon from '@iso/components/icons/UserConnection';

const CorporateNetworkHeader = ({ showPopupConnectUser }) => {
  const { receivedInvitations: receivedCompanyInvitations } = useSelector(
    (state) => state.CompanyNetwork
  );
  const pendingCompanyInvitations = useMemo(() => {
    return receivedCompanyInvitations.filter(
      (invitation) => !invitation.accepted && !invitation.rejected
    );
  }, [receivedCompanyInvitations]);

  return (
    <CorporateNetworkHeaderWrapper>
      <div className='header-left'>
        <h1>Corporate Network</h1>
        {pendingCompanyInvitations && pendingCompanyInvitations.length > 0 && (
          <span>{pendingCompanyInvitations.length}</span>
        )}
      </div>

      <div className='header-right'>
        <Button
          onClick={() => showPopupConnectUser(true)}
          type='primary'
          icon={<UserConnectionIcon />}
        >
          Invite to Buddi
        </Button>
      </div>
    </CorporateNetworkHeaderWrapper>
  );
};

export default CorporateNetworkHeader;
