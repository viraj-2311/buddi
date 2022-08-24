import React from 'react';
import RoleMembersItemWrapper from './RoleMembersItem.style';
import MembersIcon from '@iso/assets/images/group-members-icon.svg';
import IconPlus from '@iso/assets/images/ic_plus.svg';
import Button from '@iso/components/uielements/button';
import TableMembers from './TableMembers';

const RoleMembersItem = ({
  members,
  addBusinessMember,
  deleteBusinessMember,
  editBusinessMember,
}) => {
  return (
    <RoleMembersItemWrapper>
      {members.length > 0 ? (
        <TableMembers
          members={members}
          onAddMember={addBusinessMember}
          onEditMember={editBusinessMember}
          onDeleteMember={deleteBusinessMember}
        />
      ) : (
        <div className='business-member'>
          <Button type='link' onClick={() => addBusinessMember(true)}>
            <div className='account-icon'>
              <img src={MembersIcon} alt='Bank' height={56} />
              <div className='plus-icon'>
                <img src={IconPlus} alt='Plus' height={5} />
              </div>
            </div>
          </Button>
          <div className='desc-member'>
            <span>
              Add the required business members to get started with the process,
              and add any additional business members as necessary.
            </span>
          </div>
        </div>
      )}
    </RoleMembersItemWrapper>
  );
};

export default RoleMembersItem;
