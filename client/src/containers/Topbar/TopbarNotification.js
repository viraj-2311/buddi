import React from 'react';
import { Popover } from 'antd';
import NotificationIcon from '@iso/assets/images/icon/notification-icon.svg';
import { useSelector } from 'react-redux';
import IntlMessages from '@iso/components/utility/intlMessages';
import TopbarDropdownWrapper from './TopbarDropdown.styles';

const demoNotifications = [
  {
    id: 1,
    name: 'David Lee',
    notification:
      'Accepted Mercedes "Wonderland" script Supervisor position for 23 Aug 20210 5:000 pm',
  }
];

export default function TopbarNotification() {
  const [visible, setVisiblity] = React.useState(false);
  const customizedTheme = {
    buttonColor: '#ffffff',
    textColor: '#323332',
  };

  function handleVisibleChange() {
    setVisiblity(visible => !visible);
  }

  const content = (
    <TopbarDropdownWrapper className="topbarNotification">
      <div className="isoDropdownHeader">
        <h3>
          <IntlMessages id="sidebar.notifications" />
        </h3>
      </div>
      <div className="isoDropdownBody">
        {demoNotifications.map(notification => (
          <a className="isoDropdownListItem" key={notification.id} href="# ">
            <h5>{notification.name}</h5>
            <p>{notification.notification}</p>
          </a>
        ))}
      </div>
      <a className="isoViewAllBtn" href="/notifications">
        <IntlMessages id="topbar.viewAll" />
      </a>
    </TopbarDropdownWrapper>
  );
  return (
    <Popover
      content={content}
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
      placement="bottomLeft"
    >
      <div className="isoIconWrapper">
        <img alt="icon-notification" src={NotificationIcon} />
      </div>
    </Popover>
  );
}
