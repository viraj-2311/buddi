import React from 'react';
import {
  BusinessMembersTableWrapper,
  StatusSpan,
} from './BusinessMembers.style';
import TableNew from '@iso/components/uielements/tableCustom';
import Button from '@iso/components/uielements/button';
import EditIcon from '@iso/components/icons/Edit';
import DeleteIcon from '@iso/components/icons/Trash';
import { PlusOutlined } from '@ant-design/icons';

const { Column } = TableNew;

const BusinessMemberTable = ({ members, onAddMember, onDeleteMember }) => {
  const Span = ({ children }) => <span className='table-data'>{children}</span>;
  const iconColor = '#2f2e50';
  const Edit = () => <EditIcon width={18} height={18} fill={iconColor} />;
  const Delete = () => <DeleteIcon width={18} height={18} fill={iconColor} />;

  return (
    <BusinessMembersTableWrapper>
      <TableNew dataSource={members} pagination={false}>
        <Column
          key='role'
          title='Role'
          render={(text, record) => {
            return <Span>{record.role}</Span>;
          }}
          responsive={['sm']}
        />
        <Column
          key='name'
          title='Name'
          render={(text, record) => {
            return <Span>{record.name}</Span>;
          }}
        />
        <Column
          key='handle'
          title='Handle'
          render={(text, record) => {
            return <Span>{record.handle}</Span>;
          }}
          responsive={['md']}
        />

        <Column
          key='status'
          title='Status'
          render={(text, record) => {
            return (
              <StatusSpan
                color={record.status === 'Linked' ? '#19923c' : '#ffc06a'}
              >
                {record.status}
              </StatusSpan>
            );
          }}
        />

        <Column
          key='action'
          title=''
          render={(text, record) => {
            return (
              <div className='actions'>
                {(record.status === 'Linked' ||
                  record.status === 'Pending') && (
                  <>
                    <Button type='link' onClick={() => onAddMember(true)}>
                      <Edit />
                    </Button>
                    <Button type='link' onClick={onDeleteMember}>
                      <Delete />
                    </Button>
                  </>
                )}
                {record.status === 'Optional' && (
                  <Button type='link' className='addBtn'>
                    <PlusOutlined /> Add
                  </Button>
                )}
              </div>
            );
          }}
        />
      </TableNew>
      <div className='table-action'>
        <Button
          type='link'
          className='addBtn'
          onClick={() => onAddMember(false)}
          style={{ whiteSpace: 'normal', lineHeight: '17px' }}
        >
          <PlusOutlined /> Add Additional Wallet Access
        </Button>
      </div>
    </BusinessMembersTableWrapper>
  );
};

BusinessMemberTable.defaultProps = {
  members: [],
};

export default BusinessMemberTable;
