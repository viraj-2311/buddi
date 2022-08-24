import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CompanyNetworkTableWrapper } from './List.style';
import Table from '@iso/components/uielements/table';
import Button from '@iso/components/uielements/button';
import EmptyAvatar from '@iso/assets/images/empty-profile.png';
import {
  acceptCompanyNetworkInvitationRequest,
  rejectCompanyNetworkInvitationRequest,
} from '@iso/redux/companyNetwork/actions';
import { formatDateString } from '@iso/lib/helpers/utility';
import { displayDateFormat } from '@iso/config/datetime.config';

const { Column } = Table;

const CompanyNetworkPendingTable = ({ invitations, withAction }) => {
  const dispatch = useDispatch();
  const { acceptInvitation, rejectInvitation } = useSelector(
    (state) => state.CompanyNetwork
  );

  const handleInvitationAccept = (invitation) => {
    dispatch(acceptCompanyNetworkInvitationRequest(invitation.id));
  };

  const handleInvitationReject = (invitation) => {
    dispatch(rejectCompanyNetworkInvitationRequest(invitation.id));
  };

  return (
    <CompanyNetworkTableWrapper>
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
    </CompanyNetworkTableWrapper>
  );
};

CompanyNetworkPendingTable.defaultProps = {
  invitations: [],
};

export default CompanyNetworkPendingTable;
