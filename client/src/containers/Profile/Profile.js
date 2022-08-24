import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col } from 'antd';
import ProfileLayoutWrapper, {
  ProfileLayoutContentWrapper,
} from './Profile.style';

const ProfileLayout = ({ children }) => {
  return (
    <ProfileLayoutContentWrapper>
      <ProfileLayoutWrapper>
        <Row justify="start">
          <Col span={24}>{children}</Col>
        </Row>
      </ProfileLayoutWrapper>
    </ProfileLayoutContentWrapper>
  );
};

export default ProfileLayout;
