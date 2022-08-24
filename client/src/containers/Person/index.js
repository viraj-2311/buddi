import React, { lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

export const routes = [
  {
    path: 'jobs',
    component: lazy(() => import('@iso/containers/Person/Jobs')),
  },
  {
    path: 'schedule',
    component: lazy(() => import('@iso/containers/Person/Schedule')),
  },
  {
    path: 'network',
    component: lazy(() => import('@iso/containers/Person/Network')),
  },
  {
    path: 'finance',
    component: lazy(() => import('@iso/containers/Person/Finance')),
  },
  {
    path: 'profile',
    component: lazy(() => import('@iso/containers/Person/Profile')),
  },
  {
    path: 'settings',
    component: lazy(() =>
      import('@iso/containers/Person/Profile/PersonalProfileSetting')
    ),
  },
  {
    path: 'help',
    component: lazy(() => import('@iso/containers/Help')),
  },
  {
    path: 'myprofile',
    component: lazy(() => import('@iso/containers/Person/Profile/MyProfile')),
  },
  {
    path: 'notifications',
    component: lazy(() => import('@iso/containers/Notification')),
  },
  {
    path: 'messages',
    component: lazy(() => import('@iso/containers/Messages')),
  },
  {
    path: 'wallet',
    component: lazy(() => import('@iso/containers/SetupWallet')),
  },
];

const PersonRoutes = () => {
  return (
    <Switch>
      {routes.map((route, idx) => (
        <Route exact={route.exact} key={idx} path={`/${route.path}`}>
          <route.component />
        </Route>
      ))}
      <Redirect exact from='/' to='/jobs' />
    </Switch>
  );
};

export default PersonRoutes;
