import React from 'react';
import { Card } from 'antd';
import Button from '@iso/components/uielements/button';
import UserGroupIcon from '@iso/components/icons/UserGroup';
import EmptyAvatar from '@iso/assets/images/empty-profile.png';
import { CardWrapper, CardBody } from './NetworkConnectionCard.style';

const NetworkConnectionCard = ({ networkProfile }) => {
  return (
    <CardWrapper>
      <Card bordered={false}>
        <CardBody>
          <div className='userAvatar'>
            <img src={networkProfile.avatar || EmptyAvatar} alt='User' />
          </div>
          <div className='userInfo'>
            <div className='basicDetail'>
              <h4>{networkProfile.name}</h4>
              <h5>{networkProfile.role}</h5>
              <p>
                <UserGroupIcon width={20} height={16} fill={'#000'} />5 mutual
                networks
              </p>
            </div>
            <div>
              <Button type='default' shape='round' className='viewBtn'>
                View
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </CardWrapper>
  );
};
export default NetworkConnectionCard;
