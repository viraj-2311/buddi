import React, { useState } from 'react';
import SingleCompanyNetworkUserWrapper from './SingleNetworkUser.style';
import EmptyAvatar from '@iso/assets/images/empty-profile.png';
import Modal from '@iso/components/Feedback/Modal';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import Button from '@iso/components/uielements/button';
import { timeDifference } from '@iso/lib/helpers/utility';
import CompanyNetworkUserView from './NetworkUserView';

const SingleCompanyNetworkUser = ({ user, onFavorite, onDelete }) => {
  const [userView, setUserView] = useState({ visible: false, user: null });

  const handleUserView = (user) => {
    setUserView({ visible: true, user: user });
  };

  const onUserViewCancel = () => {
    setUserView({ visible: false, user: null });
  };

  return (
    <SingleCompanyNetworkUserWrapper>
      {userView.user && (
        <Modal
          visible={userView.visible}
          width={1050}
          footer={null}
          onCancel={onUserViewCancel}
          maskClosable={false}
        >
          <CompanyNetworkUserView userId={userView.user.friendId} />
        </Modal>
      )}

      <div className='userInfoWrapper'>
        <div className='userAvatar'>
          <img src={user.profilePhoto ? user.profilePhoto : EmptyAvatar} />
        </div>
        <div className='userContent'>
          <h4 className='userName'>
            {user.name}
            <span className='starredIndicator' onClick={() => onFavorite(user)}>
              {user.favorite ? (
                <StarFilled className='starred' />
              ) : (
                <StarOutlined />
              )}
            </span>
          </h4>
          <div className='userRole'>
            {user.jobTitle} at {user.companyTitle}
          </div>
          <div className='userLastTime'>
            Connected: {timeDifference(user.createdDate)}
          </div>
        </div>
      </div>
      <div className='actions'>
        <Button onClick={() => handleUserView(user)}>View</Button>
        <Button type='primary'>Message</Button>
        <Button onClick={() => onDelete(user)} type='danger'>
          Delete
        </Button>
      </div>
    </SingleCompanyNetworkUserWrapper>
  );
};

export default SingleCompanyNetworkUser;
