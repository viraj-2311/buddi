import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Wallet from './Wallet';
import History from '@iso/containers/History';

const WalletRoutes = () => {
  let { url } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${url}/`} component={Wallet} />
      <Route path={`${url}/history`} component={History} />
    </Switch>
  );
};

export default WalletRoutes;
