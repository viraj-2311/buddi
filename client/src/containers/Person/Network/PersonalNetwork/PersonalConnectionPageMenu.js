import React, { useEffect, useState } from 'react';
import { matchPath, useLocation } from 'react-router';
import { Link, useRouteMatch } from 'react-router-dom';
import { Menu } from 'antd';
import PrivateConnectionPageHeaderWrapper from './PersonalConnectionPageMenu.style';

const PrivateConnectionPageMenu = ({ menus, color }) => {
  const { url } = useRouteMatch();
  const { pathname } = useLocation();
  const [activeMenu, setActiveMenu] = useState([]);

  useEffect(() => {
    const matched = menus.filter((menu) =>
      matchPath(pathname, { path: menu.pattern })
    );
    setActiveMenu(matched.map((menu) => `job-${menu.path}`));
  }, [pathname]);

  return (
    <PrivateConnectionPageHeaderWrapper
      className="isoPageHeader"
      activeColor={color}
    >
      <Menu className="networkConnectionMenu" mode="horizontal"
        selectedKeys={activeMenu}>
        {menus.map((menu) => (
          <Menu.Item key={`job-${menu.path}`}>
            <Link to={`${url}/${menu.path}`}>{menu.name}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </PrivateConnectionPageHeaderWrapper>
  );
};

export default PrivateConnectionPageMenu;
