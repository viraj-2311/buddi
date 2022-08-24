import React, { useState } from 'react';
import { Card, Checkbox, Dropdown, Menu } from 'antd';
import { DeleteFilled, EllipsisOutlined } from '@ant-design/icons';

import Button from '@iso/components/uielements/button';
import DropDownComponent from '@iso/containers/Network/Dropdown';
import MenuComponent from '@iso/containers/Network/Menu';
import UserProfile from '@iso/containers/Network/UserProfile';
import UserPic1 from '@iso/assets/images/user1.png';

import { CardWrapper, CardBody } from './ContactCard.style';

const ContactCard = ({
  contact,
  removeConnection,
  sendInvitation,
  toggleCheck,
}) => {
  
  const {
    id,
    checked,
    avatar,
    fullName,
    email,
    isBenjiAccount,
    isInvitePending,
    benjiAccountId,
    isPersonalContact,
  } = contact;

  const [profileModal, setProfileModal] = useState(false);

  const ConnectionMenuItems = (
    <MenuComponent className="custom-menu">
      <MenuComponent.Item
        className="menuItem"
        onClick={() => removeConnection(contact)}
      >
        <DeleteFilled />
        Remove Connection
      </MenuComponent.Item>
    </MenuComponent>
  );

  return (
    <CardWrapper>
      <Card
        bodyStyle={{ padding: 0 }}
        headStyle={{ borderBottom: 'none', fontSize: 14, color: '#788195' }}
        bordered={false}
      >
        <CardBody>
          <Checkbox
            onClick={(e) => {
              e.stopPropagation();
            }}
            onChange={() => toggleCheck(id)}
            checked={checked}
          ></Checkbox>
          <div className="userAvatar">
            <img src={avatar ? avatar : UserPic1} alt="User" />
          </div>
          <div className="userInfo">
            <div className="basicDetail">
              <h4>{fullName || email}</h4>
            </div>
            <div className="actions">
              {!isBenjiAccount ? (
                <Button
                  type="default"
                  shape="round"
                  className="connectBtn"
                  disabled={isInvitePending}
                  onClick={() => sendInvitation(contact)}
                >
                  {isInvitePending ? 'Pending' : 'Invite'}
                </Button>
              ) : !isPersonalContact ? (
                <Button
                  type="default"
                  shape="round"
                  className={'viewBtn'}
                  disabled={isInvitePending}
                  onClick={() => sendInvitation(contact)}
                >
                  {isInvitePending ? 'Pending' : 'Connect'}
                </Button>
              ) : (
                <Button
                  type="default"
                  shape="round"
                  className={'viewBtn'}
                  onClick={() => setProfileModal(true)}
                >
                  View
                </Button>
              )}
            </div>
            <DropDownComponent
              overlay={ConnectionMenuItems}
              overlayClassName="jobMenu"
              placement="bottomRight"
              trigger="click"
            >
              <Button type="link">
                <EllipsisOutlined className="ellipseIcon" />
              </Button>
            </DropDownComponent>
          </div>
        </CardBody>
      </Card>
      {profileModal && (
        <UserProfile
          userId={benjiAccountId}
          visible
          handleCancel={() => {
            setProfileModal(false);
          }}
        />
      )}
    </CardWrapper>
  );
};
export default ContactCard;
