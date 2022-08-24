import React, { useMemo } from 'react';
import BuddiIcon from '@iso/assets/images/benji-icon-01.png';
import { Col, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Scrollbar from '@iso/components/utility/customScrollBar';
import Loader from '@iso/components/utility/loader';
import {
  acceptPersonalNetworkInvitationRequest,
  rejectPersonalNetworkInvitationRequest,
} from '@iso/redux/personalNetwork/actions';
import PersonalInvitationCard from '../PersonalInvitationCard';
import {
  PersonalNetworkInvitationsWrapper,
  NoInvitationDiv,
  InvitationListDiv,
  InvitationsWrapper,
} from './PersonalNetworkInvitations.style';

const NoInvitationComponent = () => {
  return (
    <NoInvitationDiv>
      <Row gutter='10'>
        <Col md={12} xs={24}>
          <h2>No new invitations</h2>
          <p>You don’t have any pending invitations.</p>
        </Col>
        <Col md={12} xs={24} className='logo-view'>
          <img src={BuddiIcon} alt='BuddiIcon' />
        </Col>
      </Row>
    </NoInvitationDiv>
  );
};

const PersonalNetworkInvitations = () => {
  const dispatch = useDispatch();

  const { receivedInvitations, fetchReceivedInvitation } = useSelector(
    (state) => state.PersonalNetwork
  );

  const pendingInvitations = useMemo(() => {
    return receivedInvitations.filter(
      (invitation) => !invitation.accepted && !invitation.rejected
    );
  }, [receivedInvitations]);

  const handleAcceptInvitation = (invitation) => {
    const { id, source } = invitation;
    dispatch(acceptPersonalNetworkInvitationRequest(id, source));
  };

  const handleIgnoreInvitation = (invitation) => {
    const { id, source } = invitation;
    dispatch(rejectPersonalNetworkInvitationRequest(id, source));
  };

  const InvitationListComponent = (
    <InvitationListDiv>
      <div className='invitationHeader'>
        <div className='invitationListTitle'>
          <h2>Invitations</h2>
        </div>
      </div>
      {fetchReceivedInvitation.loading ? (
        <Loader />
      ) : pendingInvitations.length ? (
        <Scrollbar
          autoHeight
          autoHeightMax='calc(100vh - 400px)'
          className='invitationListContent'
        >
          {pendingInvitations.map((invitation) => (
            <InvitationsWrapper key={invitation.id}>
              <PersonalInvitationCard
                invitation={invitation}
                accept={() => handleAcceptInvitation(invitation)}
                ignore={() => handleIgnoreInvitation(invitation)}
              />
            </InvitationsWrapper>
          ))}
        </Scrollbar>
      ) : (
        <NoInvitationComponent />
      )}
    </InvitationListDiv>
  );

  return (
    <PersonalNetworkInvitationsWrapper>
      {InvitationListComponent}
    </PersonalNetworkInvitationsWrapper>
  );
};

export default PersonalNetworkInvitations;
