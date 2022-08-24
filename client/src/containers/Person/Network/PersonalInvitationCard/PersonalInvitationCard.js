import React, { useState, useMemo, useEffect } from 'react';
import { Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@iso/components/uielements/button';
import EmptyAvatar from '@iso/assets/images/empty-profile.png';
import UserProfile from '@iso/containers/Network/UserProfile';
import notify from '@iso/lib/helpers/notify';
import { getMutualConnections } from '@iso/lib/helpers/utility';
import {
  fetchPersonalNetworkReceivedInvitationRequest,
  acceptPersonalNetworkInvitationNotify,
  rejectPersonalNetworkInvitationNotify,
} from '@iso/redux/personalNetwork/actions';
import { CardWrapper, CardBody } from './PersonalInvitationCard.style';

const PersonalInvitationCard = ({ invitation, accept, ignore }) => {
  const dispatch = useDispatch();
  const { userId, profilePhoto, userJobTitle, email, name, mutualFriends } =
    invitation;
  const [profileModal, setProfileModal] = useState(false);
  const { user: authUser } = useSelector((state) => state.Auth);
  const { acceptInvitationsArray, rejectInvitationsArray } = useSelector(
    (state) => state.PersonalNetwork
  );

  const isIgnoreBtnLoading = useMemo(() => {
    const currentInvitation = rejectInvitationsArray.find(
      (ai) => ai.invitationId === invitation.id
    );
    return !!(currentInvitation && currentInvitation.loading);
  }, [rejectInvitationsArray]);

  const isAcceptBtnLoading = useMemo(() => {
    const currentInvitation = acceptInvitationsArray.find(
      (ai) => ai.invitationId === invitation.id
    );
    return !!(currentInvitation && currentInvitation.loading);
  }, [acceptInvitationsArray]);

  const fetchPersonalNetworkInvitations = () => {
    if (authUser.id) {
      dispatch(
        fetchPersonalNetworkReceivedInvitationRequest(authUser.id, {
          status: 'Pending',
        })
      );
    }
  };

  useEffect(() => {
    const acceptedInvitation = acceptInvitationsArray.find(
      (ai) => ai.invitationId === invitation.id
    );
    if (
      acceptedInvitation &&
      !acceptedInvitation.loading &&
      !acceptedInvitation.notify
    ) {
      if (!acceptedInvitation.error) {
        notify('success', 'You have accepted this profile');
        dispatch(
          acceptPersonalNetworkInvitationNotify(
            acceptedInvitation.invitation,
            true
          )
        );
        fetchPersonalNetworkInvitations();
      } else {
        notify('error', acceptedInvitation.error);
        dispatch(
          acceptPersonalNetworkInvitationNotify(
            acceptedInvitation.invitation,
            false
          )
        );
      }
    }
  }, [acceptInvitationsArray]);

  useEffect(() => {
    const rejectedInvitation = rejectInvitationsArray.find(
      (ai) => ai.invitationId === invitation.id
    );

    if (
      rejectedInvitation &&
      !rejectedInvitation.loading &&
      !rejectedInvitation.error &&
      !rejectedInvitation.notify
    ) {
      notify('success', 'You have declined this profile');
      dispatch(
        rejectPersonalNetworkInvitationNotify(
          rejectedInvitation.invitation,
          true
        )
      );
      fetchPersonalNetworkInvitations();
    }

    if (
      rejectedInvitation &&
      !rejectedInvitation.loading &&
      rejectedInvitation.error &&
      !rejectedInvitation.notify
    ) {
      notify('error', rejectedInvitation.error);
      dispatch(
        rejectPersonalNetworkInvitationNotify(
          rejectedInvitation.invitation,
          false
        )
      );
    }
  }, [rejectInvitationsArray]);

  return (
    <CardWrapper>
      <Card bordered={false}>
        <CardBody>
          <div className='userAvatar' onClick={() => setProfileModal(true)}>
            <img src={profilePhoto || EmptyAvatar} alt='User' />
          </div>
          <div className='userInfo'>
            <div className='basicDetail'>
              <h4>{name || email}</h4>
              {userJobTitle && <h5>{userJobTitle}</h5>}
              {mutualFriends && mutualFriends.length > 0 && (
                <h6>Connections: {getMutualConnections(mutualFriends)}</h6>
              )}
            </div>
            <div>
              <Button
                type='default'
                shape='round'
                className='ignoreBtn'
                onClick={ignore}
                loading={isIgnoreBtnLoading}
                disabled={isAcceptBtnLoading}
              >
                Ignore
              </Button>
              <Button
                type='default'
                shape='round'
                className='acceptBtn'
                onClick={accept}
                loading={isAcceptBtnLoading}
                disabled={isIgnoreBtnLoading}
              >
                Accept
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
      {profileModal && (
        <UserProfile
          userId={userId}
          visible
          handleCancel={() => {
            setProfileModal(false);
          }}
        />
      )}
    </CardWrapper>
  );
};
export default PersonalInvitationCard;
