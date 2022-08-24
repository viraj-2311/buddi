import React from 'react';
import { Col } from 'antd';
import { useHistory } from 'react-router';

import WebsiteIcon from '@iso/components/icons/Website';
import PhoneIcon from '@iso/components/icons/Phone';
import MailIcon from '@iso/components/icons/Mail';
import BirthDayIcon from '@iso/components/icons/Birthday';
import { formatDateString, formatPhoneNumber } from '@iso/lib/helpers/utility';
import EditIcon from '@iso/components/icons/Edit';
import Button from '@iso/components/uielements/button';

import UserContactInfoModal, { SectionRow } from './UserContactInfo.style';

export default ({ visible, handleCancel, user, onEdit, editable }) => {
  const editIconColor = '#f48d3a';
  const { website, phone, email, birthday, fullName, title, ownerEmail } = user;
  const iconFileColor = '#f48d3a';
  const Edit = () => <EditIcon width={18} height={18} fill={editIconColor} />;

  const history = useHistory();
  return (
    <UserContactInfoModal
      title={fullName || email || title}
      visible={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <SectionRow>
        <Col flex="auto" className="title-info">
          <div className="content">
            <div className="title">
              <h3>Contact Info</h3>
            </div>
            <div className="sourceList">
              {website && (
                <div className="sourceItem">
                  <WebsiteIcon width={20} height={16} fill={iconFileColor} />
                  <div className="sourceItemInfo websiteInfo">
                    <h4>Website</h4>
                    <span>
                      <a>{website}</a>
                    </span>
                  </div>
                </div>
              )}
              {phone && (
                <div className="sourceItem">
                  <PhoneIcon width={18} height={18} fill={iconFileColor} />
                  <div className="sourceItemInfo phoneDetail">
                    <h4>Phone</h4>
                    <span>
                      <h6>{formatPhoneNumber(phone)}</h6>
                    </span>
                  </div>
                </div>
              )}

              {(email || ownerEmail) && (
                <div className="sourceItem">
                  <MailIcon width={20} height={16} fill={iconFileColor} />
                  <div className="sourceItemInfo">
                    <h4>Email</h4>
                    <p>
                      <a href={`mailto:${email || ownerEmail}`}>{email || ownerEmail}</a>
                    </p>
                  </div>
                </div>
              )}
              {birthday && (
                <div className="sourceItem">
                  <BirthDayIcon width={18} height={22} fill={iconFileColor} />
                  <div className="sourceItemInfo">
                    <h4>Birthday</h4>
                    <p>{formatDateString(birthday, 'MMMM D')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Col>
        {editable && (
          <Col>
            <Button
              type="link"
              onClick={onEdit}
            >
              <Edit />
            </Button>
          </Col>
        )}
      </SectionRow>
    </UserContactInfoModal>
  );
};
