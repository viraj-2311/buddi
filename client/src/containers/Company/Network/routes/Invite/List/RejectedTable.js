import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CompanyNetworkTableWrapper } from './List.style';
import Table from '@iso/components/uielements/table';
import Button from '@iso/components/uielements/button';
import EmptyAvatar from '@iso/assets/images/empty-profile.png';
import { formatDateString } from '@iso/lib/helpers/utility';
import { displayDateFormat } from '@iso/config/datetime.config';
import { acceptCompanyNetworkInvitationRequest } from '@iso/redux/companyNetwork/actions';

const { Column } = Table;

const CompanyNetworkRejectedTable = ({ invitations, withAction }) => {
  const dispatch = useDispatch();
  const { acceptInvitation } = useSelector((state) => state.CompanyNetwork);

  const handleInvitationAccept = (invitation) => {
    dispatch(acceptCompanyNetworkInvitationRequest(invitation.id));
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
                  >
                    Accept
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

CompanyNetworkRejectedTable.defaultProps = {
  invitations: [],
};

export default CompanyNetworkRejectedTable;
