import React, {useEffect, useMemo, useState} from 'react';
import moment from 'moment';
import {useHistory} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import { Row, Col, Divider } from 'antd';
import Modal from '@iso/components/Feedback/Modal';
import Button from '@iso/components/uielements/button';
import TrashIcon from '@iso/components/icons/Trash';
import Empty_Avatar from '@iso/assets/images/user2.png';
import { timeDifference } from '@iso/lib/helpers/utility';

const NotificationItem = ({ notification, selectedId, changeNotification}) => {

  const activeClass = selectedId === notification.id ? 'active' : '';
  return(
    <>
    <div onClick={() => changeNotification(notification.id)} id={`notification${notification.id}`} className={`${activeClass} notification-item-wrapper`}>
      <Row gutter={[20, 0]} justify="start">
        <Col>
          <div className="sender-photo-wrapper">
            {/* <img src={(notification.userAvatar ? notification.userAvatar : Empty_Avatar)} alt="Preview" className={(notification.userAvatar ? "notification-sender-photo": "empty-photo")}/> */}
            <img src={Empty_Avatar} alt="Preview" className="empty-photo"/>
          </div>
        </Col>
        <Col>
          <div>
            <p className="notification-sender-name">
              <span>{notification.sender}</span>
              <Button className="remove-btn" type="link" icon={<TrashIcon fill="#828282" />} />
            </p>
            <p className="notification-content">{notification.content}</p>
            <p className="notification-time">{timeDifference(notification.sent)} ago</p>
          </div>
        </Col>
      </Row>
    </div>
    <Divider />
    </>
  );
};

export default NotificationItem;
