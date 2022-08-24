import React, { lazy, Suspense, useEffect } from 'react';
import {
  Route,
  Redirect,
  BrowserRouter as Router,
  Switch
} from 'react-router-dom';
import { useSelector } from 'react-redux';

import Loader from '@iso/components/utility/loader';
import AccountWizard from '@iso/containers/AccountWizard/AccountWizard';
import { AccountSuccess } from '@iso/containers/AccountWizard/components';

import ErrorBoundary from './ErrorBoundary';
import { PUBLIC_ROUTE } from './route.constants';

const Dashboard = lazy(() => import('@iso/containers/Dashboard/Dashboard'));

const publicRoutes = [
  {
    path: PUBLIC_ROUTE.SIGN_IN,
    component: lazy(() =>
      import('@iso/containers/Authentication/SignIn')
    ),
    exact: true
  },
  {
    path: PUBLIC_ROUTE.SIGN_UP,
    component: lazy(() =>
      import('@iso/containers/Authentication/SignUp')
    ),
    exact: true
  },
  {
    path: PUBLIC_ROUTE.SIGN_UP_WELCOME,
    component: lazy(() =>
      import('@iso/containers/Authentication/SignUp/Welcome')
    ),
    exact: true
  },
  {
    path: PUBLIC_ROUTE.TERM_AND_SERVICE,
    component: lazy(() =>
      import('@iso/containers/Authentication/TermAndService')
    ),
    exact: true
  },
  {
    path: PUBLIC_ROUTE.FORGOT_PASSWORD,
    component: lazy(() =>
      import('@iso/containers/Authentication/ForgotPassword')
    ),
    exact: true
  },
  {
    path: PUBLIC_ROUTE.RESET_PASSWORD,
    component: lazy(() =>
      import('@iso/containers/Authentication/ResetPassword')
    ),
    exact: true
  },
  {
    path: PUBLIC_ROUTE.RESET_PASSWORD_WELCOME,
    component: lazy(() =>
      import('@iso/containers/Authentication/ResetPassword/Welcome')
    ),
    exact: true
  },
  {
    path: PUBLIC_ROUTE.EMAIL_VERIFY,
    component: lazy(() =>
      import('@iso/containers/Authentication/SignUp/EmailVerification')
    )
  },
  {
    path: PUBLIC_ROUTE.ACCEPT_COMPANY_REQUEST,
    component: lazy(() =>
      import(
        '@iso/containers/Authentication/AcceptCompanyPermission'
      )
    )
  },
  {
    path: PUBLIC_ROUTE.DECLINE_COMPANY_REQUEST,
    component: lazy(() =>
      import(
        '@iso/containers/Authentication/DeclineCompanyPermission'
      )
    )
  },
  {
    path: PUBLIC_ROUTE.VIEW_MEMO,
    component: lazy(() =>
      import('@iso/containers/Authentication/ViewMemo')
    )
  },
  {
    path: PUBLIC_ROUTE.PAGE_403,
    component: lazy(() => import('@iso/components/ErrorPage/403/403'))
  },
  {
    path: PUBLIC_ROUTE.PAGE_404,
    component: lazy(() => import('@iso/components/ErrorPage/404/404'))
  },
  {
    path: PUBLIC_ROUTE.PAGE_500,
    component: lazy(() => import('@iso/components/ErrorPage/500/500'))
  },
  {
    path: PUBLIC_ROUTE.MAINTENANCE,
    component: lazy(() =>
      import('@iso/components/ErrorPage/Maintenance/Maintenance')
    )
  },
  {
    path: PUBLIC_ROUTE.CLOSE_ACCOUNT,
    component: lazy(() =>
      import('@iso/containers/Authentication/AccountClosed')
    ),
    exact: true
  }
];

function PrivateRoute({ children, ...rest }) {
  const isLoggedIn = useSelector((state) => state.Auth.token.access);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
const Routes = () => {
  const isLoggedIn = useSelector((state) => state.Auth.token.access);

  const { user: authUser } = useSelector((state) => state.Auth);

  const params = new URLSearchParams(window.location.search);
  const email = params.get('email');

  useEffect(() => {
    if (email) {
      if (isLoggedIn && authUser && authUser.id) {
        if (email !== authUser.email) {
          window.location.href = '/403';
          return;
        }
      }

      params.delete('email');
      window.location.search = params;
    }
  }, []);

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>
        <Router>
          <Switch>
            {publicRoutes.map((route, index) => (
              <Route key={index} path={route.path} exact={route.exact}>
                <route.component />
              </Route>
            ))}

            <PrivateRoute path='/account-wizard' exact>
              <AccountWizard />
            </PrivateRoute>

            <PrivateRoute path='/account/:accountType/success' exact>
              <AccountSuccess />
            </PrivateRoute>
            <PrivateRoute path='/'>
              <Dashboard />
            </PrivateRoute>
          </Switch>
        </Router>
      </Suspense>
    </ErrorBoundary>
  );
};

export default Routes;
