import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import CompanyNetworkInviteWrapper from './Invite.style';
import Tabs, { TabPane } from '@iso/components/uielements/tabs';
import CompanyNetworkInviteForm from './Form/Form';
import CompanyNetworkInviteList from './List';
import InvitationTypes from '@iso/enums/invitation_types';
import Badge from '@iso/components/uielements/badge';
import {
  fetchCompanyNetworkSentInvitationRequest, fetchCompanyNetworkReceivedInvitationRequest
} from '@iso/redux/companyNetwork/actions';

const CompanyNetworkInvite = () => {
  const dispatch = useDispatch();
  const { companyId } = useSelector(state => state.ProducerJob);
  const { networkInvitations } = useSelector(state => state.AccountBoard);
  const {sentInvitations, receivedInvitations} = useSelector(state => state.CompanyNetwork);
  const { fetchSentInvitation, fetchReceivedInvitation } = useSelector(state => state.CompanyNetwork);

  const onActiveTabChange = (tabKey) => {
    if (tabKey === 'company-network-sent') {
      dispatch(fetchCompanyNetworkSentInvitationRequest(companyId));
    } else if (tabKey === 'company-network-received') {
      dispatch(fetchCompanyNetworkReceivedInvitationRequest(companyId));
    }
  };

  return (
    <CompanyNetworkInviteWrapper>
      <Tabs
        centered
        className="networkSectionTab"
        onChange={onActiveTabChange}
      >
        <TabPane key="company-network-invite" tab="Invite">
          <CompanyNetworkInviteForm />
        </TabPane>
        <TabPane key="company-network-sent" tab="Sent">
          <CompanyNetworkInviteList invitations={sentInvitations} type={InvitationTypes.SENT} loading={fetchSentInvitation.loading} />
        </TabPane>
        <TabPane
          key="company-network-received"
          tab={
            <>
              <span style={{marginRight: '5px', verticalAlign: 'middle'}}>Received</span>
              <Badge count={networkInvitations.length} />
            </>
          }
        >
          <CompanyNetworkInviteList invitations={receivedInvitations} type={InvitationTypes.RECEIVED} loading={fetchReceivedInvitation.loading} />
        </TabPane>
      </Tabs>
    </CompanyNetworkInviteWrapper>
  )
};

export default CompanyNetworkInvite;
