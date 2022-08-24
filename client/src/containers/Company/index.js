import React, { lazy, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { setCompany } from '@iso/redux/producerJob/actions';
import { setWorkspaceCompany } from '@iso/redux/accountBoard/actions';

export const routes = [
  {
    path: 'jobs',
    component: lazy(() => import('@iso/containers/Company/Jobs')),
  },
  {
    path: 'network',
    component: lazy(() => import('@iso/containers/Company/Network')),
  },
  // {
  //   path: 'finance',
  //   component: lazy(() => import('@iso/containers/Company/Finance')),
  // },
  {
    path: 'documents',
    component: lazy(() => import('@iso/containers/Company/Documents')),
  },
  {
    path: 'notifications',
    component: lazy(() => import('@iso/containers/Notification')),
  },
  {
    path: 'settings',
    component: lazy(() =>
      import('@iso/containers/Company/Profile/CompanyProfileSetting')
    ),
  },
  {
    path: 'help',
    component: lazy(() => import('@iso/containers/Help')),
  },
  {
    path: 'messages',
    component: lazy(() => import('@iso/containers/Messages')),
  },
  {
    path: 'wallet',
    component: lazy(() => import('@iso/containers/SetupWallet')),
  },
  {
    path: 'band-profile',
    component: lazy(() =>
      import('@iso/containers/Company/Profile/MyCompany')
    ),
  },
];

const CompanyRoutes = () => {
  const dispatch = useDispatch();
  const {
    url,
    params: { companyId },
  } = useRouteMatch();

  useEffect(() => {
    dispatch(setCompany(companyId));
    dispatch(setWorkspaceCompany(companyId));
  }, [companyId]);

  return (
    <Switch>
      {routes.map((route, idx) => (
        <Route exact={route.exact} key={idx} path={`${url}/${route.path}`}>
          <route.component />
        </Route>
      ))}
      <Redirect exact from='/companies/:companyId/' to='/companies/:  s' />
    </Switch>
  );
};

export default CompanyRoutes;
