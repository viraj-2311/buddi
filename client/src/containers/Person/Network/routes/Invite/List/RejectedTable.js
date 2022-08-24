import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PersonalNetworkTableWrapper } from './List.style';
import Table from '@iso/components/uielements/table';
import Button from '@iso/components/uielements/button';
import { formatDateString } from '@iso/lib/helpers/utility';
import { displayDateFormat } from '@iso/config/datetime.config';
import { acceptPersonalNetworkInvitationRequest } from '@iso/redux/personalNetwork/actions';
import EmptyAvatar from '@iso/assets/images/empty-profile.png';

const { Column } = Table;

const PersonalNetworkRejectedTable = ({ invitations, withAction }) => {
  const dispatch = useDispatch();
  const { acceptInvitation } = useSelector((state) => state.PersonalNetwork);

  const handleInvitationAccept = (invitation) => {
    dispatch(acceptPersonalNetworkInvitationRequest(invitation.id));
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
                  >
                    Accept
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

PersonalNetworkRejectedTable.defaultProps = {
  invitations: [],
};

export default PersonalNetworkRejectedTable;
