import React, { useState } from 'react';
import { Card } from 'antd';
import { getMutualConnections } from '@iso/lib/helpers/utility';
import { DeleteFilled, EllipsisOutlined } from '@ant-design/icons';
import Button from '@iso/components/uielements/button';
import EmptyAvatar from '@iso/assets/images/empty-profile.png';
import DropDownComponent from '../Dropdown';
import MenuComponent from '../Menu';
import UserProfile from '../UserProfile';
import { CardWrapper, CardBody } from './ConnectionCard.style';

const ConnectionCard = ({ connection, removeConnection }) => {
  const {
    userId,
    friendId,
    profilePhoto,
    jobTitle,
    userJobTitle,
    email,
    name,
    mutualFriends,
  } = connection;
  const [profileModal, setProfileModal] = useState(false);

  const ConnectionMenuItems = (
    <MenuComponent className='custom-menu'>
      <MenuComponent.Item
        className='menuItem'
        onClick={() => removeConnection(connection)}
      >
        <DeleteFilled />
        Remove Connection
      </MenuComponent.Item>
    </MenuComponent>
  );

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
              {(userJobTitle || jobTitle) && (
                <h5>{userJobTitle || jobTitle}</h5>
              )}
              {mutualFriends && mutualFriends.length > 0 && (
                <h6>Connections: {getMutualConnections(mutualFriends)}</h6>
              )}
            </div>
            <div className='view-button'>
              <Button
                type='default'
                shape='round'
                className='viewBtn'
                onClick={() => setProfileModal(true)}
              >
                View
              </Button>
            </div>
            <DropDownComponent
              overlay={ConnectionMenuItems}
              overlayClassName='jobMenu'
              placement='bottomRight'
              trigger='click'
            >
              <Button type='link' className='option-menu'>
                <EllipsisOutlined className='ellipseIcon' />
              </Button>
            </DropDownComponent>
          </div>
        </CardBody>
      </Card>
      {profileModal && (userId || friendId) && (
        <UserProfile
          userId={userId || friendId}
          visible
          handleCancel={() => {
            setProfileModal(false);
          }}
        />
      )}
    </CardWrapper>
  );
};
export default ConnectionCard;
