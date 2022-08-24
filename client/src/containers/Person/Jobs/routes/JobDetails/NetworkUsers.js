import React from 'react';
import Button from '@iso/components/uielements/button';
import ContractorNetworkUsersWrapper from './NetworkUsers.style';
import EmptyAvatar from '@iso/assets/images/empty-profile.png';

const ContractorNetworkUsers = ({ users }) => {
  return (
    <ContractorNetworkUsersWrapper>
      {users.map((user, index) => (
        <div className='userDetails' key={`network-${index}`}>
          <div className='userAvatar'>
            <img src={user.avatar || EmptyAvatar} alt='User' />
          </div>
          <div className='userInfos'>
            <div className='userName'>{user.fullName}</div>
            <div className='userPosition'>{user.position}</div>
          </div>
          <div className='userAction'>
            <Button className='pending' type='default' shape='round'>
              Pending
            </Button>
          </div>
        </div>
      ))}
    </ContractorNetworkUsersWrapper>
  );
};

export default ContractorNetworkUsers;
