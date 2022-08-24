import Logo from '@iso/assets/images/logo.webp';
import Menu from '@iso/components/uielements/menu';
import IntlMessages from '@iso/components/utility/intlMessages';
import { Drawer } from 'antd';
import React from 'react';
import { Link, useRouteMatch, matchPath, useLocation } from 'react-router-dom';
import { ToolbarOverlayMenuHeaderStyle } from './TopbarOverlayMenu.style';

const stripTrailingSlash = (str) => {
  if (str.substr(-1) === '/') {
    return str.substr(0, str.length - 1);
  }
  return str;
};

const TopbarOverlayMenu = ({ visible, onClose, items, renderContent }) => {
  let match = useRouteMatch();

  const url = stripTrailingSlash(match.url);
  const { pathname } = useLocation();
  const [activeMenu, setActiveMenu] = React.useState([]);

  React.useEffect(() => {
    const matched = items.filter((menu) =>
      matchPath(pathname, { path: menu.pattern })
    );
    setActiveMenu(matched.map((menu) => menu.key));
  }, [pathname, items]);
  const renderMenuItem = (option) => {
    const { key, label, leftIcon, disabled, suffix, prefix, pattern, ...rest } =
      option;
    return (
      <Menu.Item key={key} disabled={disabled} {...rest} onClick={onClose}>
        <Link to={`${url}/${key}`}>
          <div>
            {prefix && <span className='menu-prefix'>{prefix}</span>}
            <span className='menu-icon-svg'>{leftIcon}</span>
            <span className='nav-text'>
              <IntlMessages id={label} />
            </span>
            {suffix && <span className='menu-suffix'>{suffix}</span>}
          </div>
        </Link>
      </Menu.Item>
    );
  };
  const renderMenu = (items) => (
    <Menu selectedKeys={activeMenu}>
      {items.map((item) => renderMenuItem(item))}
    </Menu>
  );

  const Header = (
    <ToolbarOverlayMenuHeaderStyle>
      <img src={Logo} height='35px' />
    </ToolbarOverlayMenuHeaderStyle>
  );
  const mainItems = items.filter((item) => !item.isBottom);
  const footerItems = items.filter((item) => item.isBottom);
  return (
    <Drawer
      className='topbar-overlay-menu'
      title={Header}
      placement={'left'}
      closable={true}
      onClose={() => onClose()}
      visible={visible}
      key={'left'}
    >
      <div> {renderMenu(mainItems)}</div>
      <div> {renderMenu(footerItems)}</div>
    </Drawer>
  );
};
export default TopbarOverlayMenu;
