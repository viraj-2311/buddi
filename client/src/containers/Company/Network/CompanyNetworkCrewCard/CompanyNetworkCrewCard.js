import React from 'react';
import { Card } from 'antd';
import Button from '@iso/components/uielements/button';
import { CardWrapper, CardBody } from './CompanyNetworkCrewCard.style';
import UserGroupIcon from '@iso/components/icons/UserGroup';

const CompanyNetworkCrewCard = ({ networkProfile }) => {
  return (
    <CardWrapper>
      <Card bordered={false}>
        <CardBody>
          <div className="userAvatar">
            <img src={networkProfile.avatar} alt="User" />
          </div>
          <div className="userInfo">
            <div className="basicDetail">
              <h4>{networkProfile.name}</h4>
              <h5>{networkProfile.role}</h5>
              <p>
                <UserGroupIcon width={20} height={16} fill={'#000'} />5 mutual
                networks
              </p>
            </div>
            <div>
              <Button type="default" shape="round" className="connectBtn">
                Connect
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </CardWrapper>
  );
};
export default CompanyNetworkCrewCard;
