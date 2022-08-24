import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Loader from '@iso/components/utility/loader';

export default function AppRouter({ routes }) {
  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        {routes.map((route, idx) => (
          <Route exact={route.exact} key={idx} path={`${route.path}`}>
            <route.component />
          </Route>
        ))}
      </Switch>
    </Suspense>
  );
}
