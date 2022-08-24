import React, { lazy, useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout } from 'antd';
import siteConfig from '@iso/config/site.config';
import PrimarySidebar from '../../Sidebar/Primary';
import SecondarySidebar from '../../Sidebar/Secondary';
import Topbar from '../../Topbar/Topbar';
import { producerCompanyViewOptions, personalViewOptions } from './options';
import TopDropdown from './dropdown';
import DashboardRoutes from '../DashboardRoutes';
import {
  TooltipDataPersonal,
  TooltipDataCompanyProducer,
} from '@iso/containers/IntroToolTip/TooltipData';
import Footer from '../../Footer/Footer';
import TopbarOverlayMenu from '../../Topbar/TopbarOverlayMenu';
import appActions from '@iso/redux/app/actions';

const { Content } = Layout;

const routes = [
  // {
  //   path: '/dashboard',
  //   component: lazy(() => import('@iso/containers/Company/Dashboard')),
  //   exact: true,
  // },
  {
    path: '/invitation',
    component: lazy(() => import('@iso/containers/Company/Invitation')),
  },
  {
    path: '/companies/:companyId',
    component: lazy(() => import('@iso/containers/Company')),
  },
  {
    path: '/',
    component: lazy(() => import('@iso/containers/Person')),
  },
  {
    path: '/wallet',
    component: lazy(() => import('@iso/containers/SetupWallet')),
  },
];

const Producer = ({ height, styles, ...rest }) => {
  const dispatch = useDispatch();
  const { toggleMobileOverlayMenu } = appActions;

  const { user: authUser } = useSelector((state) => state.Auth);
  const {
    companyId,
    jobs: accountJobs,
    callsheets: accountCallsheets,
  } = useSelector((state) => state.AccountBoard);
  const { unpaidRequestedInvoice } = useSelector(
    (state) => state.ContractorInvoice
  );
  const [sidebarMenus, setSidebarMenus] = useState([]);
  const { receivedInvitations } = useSelector((state) => state.PersonalNetwork);
  const { mobileOverlayMenuVisible, view } = useSelector((state) => state.App);

  const { receivedInvitations: receivedCompanyInvitations } = useSelector(
    (state) => state.CompanyNetwork
  );
  const { companyStepIntro, userStepIntro } = useSelector(
    (state) => state.UserIntro
  );

  const pendingPersonalNetworkInvitations = useMemo(() => {
    return receivedInvitations.filter(
      (invitation) => !invitation.accepted && !invitation.rejected
    );
  }, [receivedInvitations]);

  const pendingCompanyInvitations = useMemo(() => {
    return receivedCompanyInvitations.filter(
      (invitation) => !invitation.accepted && !invitation.rejected
    );
  }, [receivedCompanyInvitations]);

  const personalViewMenus = useMemo(() => {
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

  useEffect(() => {
    if (companyId === 'null' || companyId === null) {
      setSidebarMenus(personalViewMenus);
    } else {
      setSidebarMenus(
        producerCompanyViewOptions(companyId, pendingCompanyInvitations)
      );
    }
  }, [personalViewMenus, companyId, pendingCompanyInvitations]);
  return (
    <div {...rest}>
      <Layout style={styles.layout}>
        <div className='isoSidebarWrapper'>
          <PrimarySidebar person={authUser} companies={authUser.companies} />
          <SecondarySidebar menus={sidebarMenus} companyId={companyId} />
          {view === 'MobileView' && (
            <TopbarOverlayMenu
              items={sidebarMenus}
              visible={mobileOverlayMenuVisible}
              onClose={() => dispatch(toggleMobileOverlayMenu())}
            ></TopbarOverlayMenu>
          )}
        </div>

        <Layout
          className='isoContentMainLayout'
          id='isoContentMainLayout'
          style={{
            height: height,
          }}
        >
          <Topbar
            userDropdown={TopDropdown(authUser)}
            hasPersonalWallet={companyId === 'null' || companyId === null}
          />
          <Content className='isomorphicContent' style={styles.content}>
            <DashboardRoutes routes={routes} />
          </Content>
          <Footer titleFooter={siteConfig.footerText} />
        </Layout>
      </Layout>

      {((userStepIntro.currentStepIntro >= 0 &&
        userStepIntro.currentStepIntro < TooltipDataPersonal.length) ||
        (companyStepIntro.currentCompanyStepIntro >= 0 &&
          companyStepIntro.currentCompanyStepIntro <
            TooltipDataCompanyProducer.length)) && (
        <div className='overlay-cover'></div>
      )}
    </div>
  );
};

export default Producer;
