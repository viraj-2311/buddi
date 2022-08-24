import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '@iso/components/utility/loader';
import BuddiIcon from '@iso/assets/images/benji-icon-01.png';
import { Col, Row } from 'antd';
import {
  acceptCompanyNetworkInvitationRequest,
  rejectCompanyNetworkInvitationRequest,
} from '@iso/redux/companyNetwork/actions';
import CorporateInvitationCard from '../CorporateInvitationCard/CorporateInvitationCard';
import Scrollbar from '@iso/components/utility/customScrollBar';
import {
  CorporateNetworkInvitationsWrapper,
  NoInvitationDiv,
  InvitationListDiv,
  InvitationsWrapper,
} from './CorporateNetworkInvitations.style';

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

const CorporateNetworkInvitations = () => {
  const dispatch = useDispatch();

  const { receivedInvitations, fetchReceivedInvitation } = useSelector(
    (state) => state.CompanyNetwork
  );

  const pendingInvitations = useMemo(() => {
    return receivedInvitations.filter(
      (invitation) => !invitation.accepted && !invitation.rejected
    );
  }, [receivedInvitations]);

  const handleAcceptInvitation = (invitation) => {
    dispatch(acceptCompanyNetworkInvitationRequest(invitation.id));
  };

  const handleIgnoreInvitation = (invitation) => {
    dispatch(rejectCompanyNetworkInvitationRequest(invitation.id));
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
              <CorporateInvitationCard
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
    <CorporateNetworkInvitationsWrapper>
      {InvitationListComponent}
    </CorporateNetworkInvitationsWrapper>
  );
};

export default CorporateNetworkInvitations;
