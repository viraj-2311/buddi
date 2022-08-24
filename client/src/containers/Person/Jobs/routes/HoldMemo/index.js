import React from 'react';
import {useSelector} from 'react-redux';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch
} from 'react-router-dom';
import ContractorJobDetailsHeader from '../JobDetails/Header';
import HoldMemoJobDetails from './Details';

const HoldMemoJobRoutes = () => {
  const { url } = useRouteMatch();
  const { job } = useSelector(state => state.ContractorJob);

  return (
    <>
      <ContractorJobDetailsHeader job={job} />
      <Switch>
        <Route
          path={`${url}/`}
          component={HoldMemoJobDetails}
        />

        <Redirect to={`${url}/`} />
      </Switch>
    </>
  );
};

export default HoldMemoJobRoutes;
