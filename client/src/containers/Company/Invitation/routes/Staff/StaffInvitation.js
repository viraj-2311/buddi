import React from 'react';
import { Row, Col } from 'antd';
import { LayoutContentWrapper } from '../../../../../components/utility/layoutWrapper.style';
import InvitationWrapper from '../../Invitation.style';
import StaffInvitationForm from '../../StaffForm/StaffForm';
import Logo from '@iso/assets/images/logo-black.webp';

const StaffInvitation = () => {
  return (
    <LayoutContentWrapper>
      <InvitationWrapper>
        <Row justify='start'>
          <Col md={16} xs={24}>
            <div className='logo'>
              <img src={Logo} height={72} />
            </div>
            <div className='title'>Band Staff Invitation Form</div>
            <p className='subTitle'>
              Invite employees of your band into your private workspace
            </p>
            <div className='formWrapper'>
              <StaffInvitationForm />
            </div>
          </Col>
        </Row>
      </InvitationWrapper>
    </LayoutContentWrapper>
  );
};

export default StaffInvitation;
