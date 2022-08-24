import React from 'react';
import {useSelector} from 'react-redux';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch
} from 'react-router-dom';
import ContractorCallsheetDetails from './Details';

const ContractorCallsheetRoutes = () => {
  const { url } = useRouteMatch();

  return (
    <Switch>
      <Route
        path={`${url}/:callsheetId`}
        component={ContractorCallsheetDetails}
      />
      <Redirect to={`${url}/`} />
    </Switch>
  );
};

export default ContractorCallsheetRoutes;
