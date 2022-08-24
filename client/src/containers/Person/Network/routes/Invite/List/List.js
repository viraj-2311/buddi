import React, {useEffect, useMemo} from 'react';
import {useDispatch} from 'react-redux';
import PersonalNetworkInviteListWrapper from './List.style';
import Tabs, { TabPane } from '@iso/components/uielements/tabs';
import PersonalNetworkPendingTable from './PendingTable';
import PersonalNetworkAcceptedTable from './AcceptedTable';
import PersonalNetworkRejectedTable from './RejectedTable';
import InvitationTypes from '@iso/enums/invitation_types';
import Loader from '@iso/components/utility/loader';

const PersonalNetworkInviteList = ({invitations, type, loading}) => {
  const dispatch = useDispatch();

  const pending = useMemo(() => {
    return invitations.filter(invitation => !invitation.accepted && !invitation.rejected);
  }, [invitations]);

  const accepted = useMemo(() => {
    return invitations.filter(invitation => invitation.accepted);
  }, [invitations]);

  const rejected = useMemo(() => {
    return invitations.filter(invitation => invitation.rejected);
  }, [invitations]);

  if (loading) {
    return <Loader />
  }

  return (
    <PersonalNetworkInviteListWrapper>
      <Tabs className="networkInviteStatusTab">
        <TabPane tab="Pending" key="personal-network-invite-pending">
          <PersonalNetworkPendingTable
            invitations={pending}
            withAction={type === InvitationTypes.RECEIVED}
          />
        </TabPane>
        <TabPane tab="Accepted" key="personal-network-invite-accepted">
          <PersonalNetworkAcceptedTable invitations={accepted} />
        </TabPane>
        <TabPane tab="Rejected" key="personal-network-invite-rejected">
          <PersonalNetworkRejectedTable
            invitations={rejected}
            withAction={type === InvitationTypes.RECEIVED}
          />
        </TabPane>
      </Tabs>
    </PersonalNetworkInviteListWrapper>
  );
};

export default PersonalNetworkInviteList;