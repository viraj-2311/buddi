import React from 'react';
import { CompanyNetworkTableWrapper } from './List.style';
import Table from '@iso/components/uielements/table';
import EmptyAvatar from '@iso/assets/images/empty-profile.png';
import { formatDateString } from '@iso/lib/helpers/utility';
import { displayDateFormat } from '@iso/config/datetime.config';

const { Column } = Table;

const CompanyNetworkAcceptedTable = ({ invitations }) => {
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
      </Table>
    </CompanyNetworkTableWrapper>
  );
};

CompanyNetworkAcceptedTable.defaultProps = {
  invitations: [],
};

export default CompanyNetworkAcceptedTable;
