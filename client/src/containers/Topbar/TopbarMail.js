import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import IntlMessages from '@iso/components/utility/intlMessages';
import MailIcon from '@iso/assets/images/icon/mail-icon.svg';
import Scrollbar from '@iso/components/utility/customScrollBar';
import Popover from '@iso/components/uielements/popover';
import TopbarDropdownWrapper from './TopbarDropdown.styles';
import { themeConfig } from "@iso/config/theme/theme.config";

const demoMails = [
  {
    id: 1,
    name: 'David Doe',
    time: '3 minutes ago',
    desc:
      'A National Book Award Finalist An Edgar Award Finalist A California Book Award Gold Medal Winner',
  },
  {
    id: 2,
    name: 'Navis Doe',
    time: '4 minutes ago',
    desc:
      'A National Book Award Finalist An Edgar Award Finalist A California Book Award Gold Medal Winner',
  },
  {
    id: 3,
    name: 'Emanual Doe',
    time: '5 minutes ago',
    desc:
      'A National Book Award Finalist An Edgar Award Finalist A California Book Award Gold Medal Winner',
  },
  {
    id: 4,
    name: 'Dowain Doe',
    time: '6 minutes ago',
    desc:
      'A National Book Award Finalist An Edgar Award Finalist A California Book Award Gold Medal Winner',
  },
];

export default function TopbarMail() {
  let { url } = useRouteMatch();

  const customizedTheme = themeConfig.topbar;
  const [visible, setVisibility] = React.useState(false);
  function hide() {
    setVisibility(false);
  }
  function handleVisibleChange() {
    setVisibility(visible => !visible);
  }

  const content = (
    <TopbarDropdownWrapper className="topbarMail">
      <div className="isoDropdownHeader">
        <h3>
          <IntlMessages id="topbar.email" />
        </h3>
      </div>
      <div className="isoDropdownBody">
        <Scrollbar style={{ height: 300 }}>
          {demoMails.map(mail => (
            <Link to={`${url}/mailbox`} onClick={hide} key={mail.id}>
              <div className="isoDropdownListItem">
                <div className="isoListHead">
                  <h5>{mail.name}</h5>
                  <span className="isoDate">{mail.time}</span>
                </div>
                <p>{mail.desc}</p>
              </div>
            </Link>
          ))}
        </Scrollbar>
      </div>
      <a className="isoViewAllBtn" href="/messages">
        <div className="isoViewAllBtn">
          <IntlMessages id="topbar.viewAll" />
        </div>
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
        <img alt="icon-mail" src={MailIcon} />
      </div>
    </Popover>
  );
}
