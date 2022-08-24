import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { matchPath, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import clone from 'clone';
import { Col, Layout, Row } from 'antd';
import Scrollbars from '@iso/components/utility/customScrollBar';
import Menu from '@iso/components/uielements/menu';
import appActions from '@iso/redux/app/actions';
import Logo from '@iso/components/utility/logo';
import SecondarySidebarWrapper from './Secondary.styles';
import SidebarMenu from './Menu';
import { themeConfig } from '@iso/config/theme/theme.config';
import { TypeUser } from '@iso/containers/IntroToolTip/TooltipData';

const { Sider } = Layout;

const {
  toggleOpenDrawer,
  toggleCollapsed,
  displayMobileMenu,
  setAllowDoAction,
} = appActions;

export default function ({ menus, companyId }) {
  const dispatch = useDispatch();
  const { userStepIntro } = useSelector((state) => state.UserIntro);
  const { user } = useSelector((state) => state.User);
  const { view, showMobileMenu, collapsed, openDrawer, height } = useSelector(
    (state) => state.App
  );

  const customizedTheme = themeConfig.sidebar;
  const clickHambergerMenu = useCallback(() => {
    dispatch(toggleCollapsed());
  }, [dispatch]);

  const topMenus = useMemo(() => {
    return menus.filter((e) => !e.isBottom);
  }, [menus]);

  const bottomMenus = useMemo(() => {
    return menus.filter((e) => e.isBottom);
  }, [menus]);

  const clickItemMenu = (e) => {
    dispatch(setAllowDoAction(false));
  };

  const { pathname } = useLocation();
  const [activeMenu, setActiveMenu] = useState([]);

  useEffect(() => {
    const matched = menus.filter((menu) =>
      matchPath(pathname, { path: menu.pattern })
    );
    setActiveMenu(matched.map((menu) => menu.key));
  }, [pathname, menus]);

  // console.log(activeMenu);

  const isCollapsed =
    view === 'MobileView'
      ? true
      : userStepIntro.currentStepIntro >= 0
      ? false
      : clone(collapsed) && !clone(openDrawer);
  const mode =
    userStepIntro.currentStepIntro >= 0
      ? 'inline'
      : isCollapsed === true
      ? 'vertical'
      : 'inline';

  const onMouseEnter = (event) => {
    if (collapsed && !openDrawer) {
      dispatch(toggleOpenDrawer());
    }
    return;
  };
  const onMouseLeave = () => {
    if (collapsed && openDrawer) {
      dispatch(toggleOpenDrawer());
      if (showMobileMenu) {
        dispatch(displayMobileMenu());
        setTimeout(() => {
          dispatch(setAllowDoAction(true));
        }, 200);
      }
    }
    return;
  };

  const submenuStyle = {
    backgroundColor: customizedTheme.backgroundColor,
    color: customizedTheme.textColor,
  };
  const submenuColor = {
    color: customizedTheme.textColor,
  };

  return (
    <SecondarySidebarWrapper>
      <Sider
        trigger={null}
        collapsible={true}
        collapsed={view === 'MobileView' ? false : isCollapsed}
        width={isCollapsed ? 58 : 260}
        className={
          !showMobileMenu && view === 'MobileView'
            ? user && user.type == TypeUser.CREW
              ? 'isoSecondarySidebar'
              : 'hide-vertical-menu'
            : 'isoSecondarySidebar'
        }
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {view !== 'MobileView' ? (
          <Logo collapsed={isCollapsed} onToggle={clickHambergerMenu} />
        ) : (
          <div
            style={{ marginTop: user && user.type == TypeUser.CREW ? 10 : 65 }}
          ></div>
        )}

        <Scrollbars style={{ height: height - 88 }}>
          <div className='menuWrapper'>
            <Menu
              onClick={clickItemMenu}
              className='isoDashboardMenu'
              inlineIndent={view === 'MobileView' ? 10 : 20}
              mode={mode}
              // selectedKeys={current}
              selectedKeys={activeMenu}
            >
              {topMenus.map((singleOption) => (
                <SidebarMenu
                  key={singleOption.key}
                  submenuStyle={submenuStyle}
                  submenuColor={submenuColor}
                  singleOption={singleOption}
                  mode={mode}
                  view={view}
                  typeUser={user && user.type ? user.type : TypeUser.CREW}
                  companyId={companyId}
                />
              ))}
            </Menu>

            <Menu
              onClick={clickItemMenu}
              className='isoDashboardMenu'
              inlineIndent={view === 'MobileView' ? 10 : 20}
              mode={mode}
              // selectedKeys={current}
              selectedKeys={activeMenu}
            >
              {bottomMenus.map((singleOption) => (
                <SidebarMenu
                  key={singleOption.key}
                  submenuStyle={submenuStyle}
                  submenuColor={submenuColor}
                  singleOption={singleOption}
                  mode={mode}
                  view={view}
                  typeUser={user && user.type ? user.type : TypeUser.CREW}
                  companyId={companyId}
                />
              ))}
            </Menu>
          </div>
        </Scrollbars>
      </Sider>
    </SecondarySidebarWrapper>
  );
}
