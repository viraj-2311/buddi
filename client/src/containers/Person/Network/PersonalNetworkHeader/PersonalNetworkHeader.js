import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PersonalNetworkHeaderWrapper from './PersonalNetworkHeader.style';
import Button from '@iso/components/uielements/button';
import UserConnectionIcon from '@iso/components/icons/UserConnection';

const PersonalNetworkHeader = ({ showPopupConnectUser }) => {
  const { receivedInvitations } = useSelector((state) => state.PersonalNetwork);

  const pendingInvitations = useMemo(() => {
    return receivedInvitations.filter(
      (invitation) => !invitation.accepted && !invitation.rejected
    );
  }, [receivedInvitations]);

  return (
    <PersonalNetworkHeaderWrapper>
      <div className='header-left'>
        <h1>Personal Network</h1>
        {pendingInvitations && pendingInvitations.length > 0 && (
          <span>{pendingInvitations.length}</span>
        )}
      </div>

      <div className='header-right'>
        <Button
          type='primary'
          icon={<UserConnectionIcon />}
          onClick={() => showPopupConnectUser(true)}
        >
          Connect to Buddi
        </Button>
      </div>
    </PersonalNetworkHeaderWrapper>
  );
};

export default PersonalNetworkHeader;
