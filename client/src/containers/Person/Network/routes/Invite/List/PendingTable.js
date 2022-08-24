import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PersonalNetworkTableWrapper } from './List.style';
import Table from '@iso/components/uielements/table';
import Button from '@iso/components/uielements/button';
import EmptyAvatar from '@iso/assets/images/empty-profile.png';
import {
  acceptPersonalNetworkInvitationRequest,
  rejectPersonalNetworkInvitationRequest,
} from '@iso/redux/personalNetwork/actions';
import { fetchAccountNetworkInvitationsRequest } from '@iso/redux/accountBoard/actions';
import { formatDateString } from '@iso/lib/helpers/utility';
import { displayDateFormat } from '@iso/config/datetime.config';

const { Column } = Table;

const PersonalNetworkPendingTable = ({ invitations, withAction }) => {
  const dispatch = useDispatch();
  const { acceptInvitation, rejectInvitation } = useSelector(
    (state) => state.PersonalNetwork
  );
  const { user: authUser } = useSelector((state) => state.Auth);
  const [action, setAction] = useState('');

  useEffect(() => {
    if (
      !acceptInvitation.loading &&
      !acceptInvitation.error &&
      action === 'accept'
    ) {
      dispatch(
        fetchAccountNetworkInvitationsRequest(authUser.id, {
          status: 'Pending',
        })
      );
    }

    if (!acceptInvitation.loading && action === 'accept') {
      setAction('');
    }
  }, [acceptInvitation]);

  useEffect(() => {
    if (
      !rejectInvitation.loading &&
      !rejectInvitation.error &&
      action === 'reject'
    ) {
      dispatch(
        fetchAccountNetworkInvitationsRequest(authUser.id, {
          status: 'Pending',
        })
      );
    }

    if (!rejectInvitation.loading && action === 'reject') {
      setAction('');
    }
  }, [rejectInvitation]);

  const handleInvitationAccept = (invitation) => {
    setAction('accept');
    dispatch(acceptPersonalNetworkInvitationRequest(invitation.id));
  };

  const handleInvitationReject = (invitation) => {
    setAction('reject');
    dispatch(rejectPersonalNetworkInvitationRequest(invitation.id));
  };

  return (
    <PersonalNetworkTableWrapper>
      <Table dataSource={invitations} pagination={false}>
        <Column
          key='no'
          title='S.No'
          width={30}
          render={(text, record, index) => index + 1}
        />
        <Column
          key='name'
          title='Name'
          render={(text, record) => {
            return (
              <div className='userAvatarAndName'>
                <img
                  src={record.profilePhoto ? record.profilePhoto : EmptyAvatar}
                  className='userAvatar'
                />
                <span>{record.name}</span>
              </div>
            );
          }}
        />
        <Column key='email' title='Email Id' dataIndex='email' />
        <Column
          key='createdDate'
          title='Sent on'
          dataIndex='createdDate'
          render={(text) => {
            return formatDateString(text, displayDateFormat);
          }}
        />
        {withAction && (
          <Column
            key='action'
            title=''
            render={(text, record) => {
              return (
                <div className='actions'>
                  <Button
                    type='primary'
                    size='small'
                    onClick={() => handleInvitationAccept(record)}
                    loading={acceptInvitation.loading}
                    disabled={rejectInvitation.loading}
                  >
                    Accept
                  </Button>
                  <Button
                    type='danger'
                    size='small'
                    onClick={() => handleInvitationReject(record)}
                    loading={rejectInvitation.loading}
                    disabled={acceptInvitation.loading}
                  >
                    Reject
                  </Button>
                </div>
              );
            }}
          />
        )}
      </Table>
    </PersonalNetworkTableWrapper>
  );
};

PersonalNetworkPendingTable.defaultProps = {
  invitations: [],
};

export default PersonalNetworkPendingTable;
