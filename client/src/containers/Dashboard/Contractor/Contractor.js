import React, { lazy, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import siteConfig from '@iso/config/site.config';
import SecondarySidebar from '../../Sidebar/Secondary';
import { Layout } from 'antd';
import Topbar from '../../Topbar/Topbar';
import TopDropdown from './dropdown';
import DashboardRoutes from '../DashboardRoutes';
import { personalViewOptions } from './options';
import { TooltipDataPersonal } from '@iso/containers/IntroToolTip/TooltipData';
import TopbarOverlayMenu from '../../Topbar/TopbarOverlayMenu';
import appActions from '@iso/redux/app/actions';

const { Content, Footer } = Layout;

const routes = [
  // {
  //   path: '/dashboard',
  //   component: lazy(() => import('@iso/containers/Person/Dashboard')),
  //   exact: true,
  // },
  {
    path: '/',
    component: lazy(() => import('@iso/containers/Person')),
  },
];

const Contractor = ({ height, styles, ...rest }) => {
  const dispatch = useDispatch();

  const { mobileOverlayMenuVisible, view } = useSelector((state) => state.App);

  const { jobs: accountJobs, callsheets: accountCallsheets } = useSelector(
    (state) => state.AccountBoard
  );
  const { unpaidRequestedInvoice } = useSelector(
    (state) => state.ContractorInvoice
  );

  const { receivedInvitations } = useSelector((state) => state.PersonalNetwork);
  const { userStepIntro } = useSelector((state) => state.UserIntro);

  const { toggleMobileOverlayMenu } = appActions;

  const pendingPersonalNetworkInvitations = useMemo(() => {
    return receivedInvitations.filter(
      (invitation) => !invitation.accepted && !invitation.rejected
    );
  }, [receivedInvitations]);

  const menus = useMemo(() => {
    const pending = accountJobs['PENDING'] || [];
    const callsheets =
      accountCallsheets.filter((callsheet) => !callsheet.accepted) || [];

    return personalViewOptions(
      pending,
      callsheets,
      pendingPersonalNetworkInvitations,
      unpaidRequestedInvoice
    );
  }, [
    accountJobs,
    accountCallsheets,
    pendingPersonalNetworkInvitations,
    unpaidRequestedInvoice,
  ]);

  return (
    <div {...rest}>
      <Layout style={styles.layout}>
        <div className='isoSidebarWrapper'>
          <SecondarySidebar menus={menus} />
          {view === 'MobileView' && (
            <TopbarOverlayMenu
              items={menus}
              visible={mobileOverlayMenuVisible}
              onClose={() => dispatch(toggleMobileOverlayMenu())}
            ></TopbarOverlayMenu>
          )}{' '}
        </div>

        <Layout
          className='isoContentMainLayout'
          id='isoContentMainLayout'
          style={{
            height: height,
          }}
        >
          <Topbar userDropdown={TopDropdown()} hasPersonalWallet={true} />
          <Content className='isomorphicContent' style={styles.content}>
            <DashboardRoutes routes={routes} />
          </Content>
        </Layout>
      </Layout>
      {userStepIntro.currentStepIntro >= 0 &&
        userStepIntro.currentStepIntro < TooltipDataPersonal.length && (
          <div className='overlay-cover'></div>
        )}
    </div>
  );
};

export default Contractor;
