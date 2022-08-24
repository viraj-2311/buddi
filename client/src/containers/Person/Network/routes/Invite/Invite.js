import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PersonalNetworkInviteWrapper from './Invite.style';
import Tabs, { TabPane } from '@iso/components/uielements/tabs';
import PersonalNetworkInviteForm from './Form/Form';
import PersonalNetworkInviteList from './List';
import InvitationTypes from '@iso/enums/invitation_types';
import Badge from '@iso/components/uielements/badge';
import {
  fetchPersonalNetworkSentInvitationRequest,
  fetchPersonalNetworkReceivedInvitationRequest,
} from '@iso/redux/personalNetwork/actions';

const PersonalNetworkInvite = () => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.Auth);
  const { networkInvitations } = useSelector((state) => state.AccountBoard);
  const { sentInvitations, receivedInvitations } = useSelector(
    (state) => state.PersonalNetwork
  );
  const { fetchSentInvitation, fetchReceivedInvitation } = useSelector(
    (state) => state.PersonalNetwork
  );

  const onActiveTabChange = (tabKey) => {
    if (tabKey === 'personal-network-sent') {
      dispatch(fetchPersonalNetworkSentInvitationRequest(authUser.id));
    } else if (tabKey === 'personal-network-received') {
      dispatch(fetchPersonalNetworkReceivedInvitationRequest(authUser.id));
    }
  };

  return (
    <PersonalNetworkInviteWrapper>
      <Tabs centered className="networkSectionTab" onChange={onActiveTabChange}>
        <TabPane key="personal-network-invite" tab="Invite">
          <PersonalNetworkInviteForm />
        </TabPane>
        <TabPane key="personal-network-sent" tab="Sent">
          <PersonalNetworkInviteList
            invitations={sentInvitations}
            type={InvitationTypes.SENT}
            loading={fetchSentInvitation.loading}
          />
        </TabPane>
        <TabPane
          key="personal-network-received"
          tab={
            <>
              <span style={{ marginRight: '5px', verticalAlign: 'middle' }}>
                Received
              </span>
              <Badge count={networkInvitations.length} />
            </>
          }
        >
          <PersonalNetworkInviteList
            invitations={receivedInvitations}
            type={InvitationTypes.RECEIVED}
            loading={fetchReceivedInvitation.loading}
          />
        </TabPane>
      </Tabs>
    </PersonalNetworkInviteWrapper>
  );
};

export default PersonalNetworkInvite;
