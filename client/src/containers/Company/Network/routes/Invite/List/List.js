import React, {useEffect, useMemo} from 'react';
import {useDispatch} from 'react-redux';
import CompanyNetworkInviteListWrapper from './List.style';
import Tabs, { TabPane } from '@iso/components/uielements/tabs';
import CompanyNetworkPendingTable from './PendingTable';
import CompanyNetworkAcceptedTable from './AcceptedTable';
import CompanyNetworkRejectedTable from './RejectedTable';
import InvitationTypes from '@iso/enums/invitation_types';
import Loader from '@iso/components/utility/loader';

const CompanyNetworkInviteList = ({invitations, type, loading}) => {
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
    <CompanyNetworkInviteListWrapper>
      <Tabs className="networkInviteStatusTab">
        <TabPane tab="Pending" key="company-network-invite-pending">
          <CompanyNetworkPendingTable
            invitations={pending}
            withAction={type === InvitationTypes.RECEIVED}
          />
        </TabPane>
        <TabPane tab="Accepted" key="company-network-invite-accepted">
          <CompanyNetworkAcceptedTable invitations={accepted} />
        </TabPane>
        <TabPane tab="Rejected" key="company-network-invite-rejected">
          <CompanyNetworkRejectedTable
            invitations={rejected}
            withAction={type === InvitationTypes.RECEIVED}
          />
        </TabPane>
      </Tabs>
    </CompanyNetworkInviteListWrapper>
  );
};

export default CompanyNetworkInviteList;