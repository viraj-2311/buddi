import React from 'react';
import {useSelector} from 'react-redux';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch
} from 'react-router-dom';
import ContractorJobDetailsHeader from '../JobDetails/Header';
import DeclinedJobDetails from './Details';

const DeclinedJobRoutes = () => {
  const { url } = useRouteMatch();
  const { job } = useSelector(state => state.ContractorJob);

  return (
    <>
      <ContractorJobDetailsHeader job={job} />
      <Switch>
        <Route
          path={`${url}/`}
          component={DeclinedJobDetails}
        />

        <Redirect to={`${url}/`} />
      </Switch>
    </>
  );
};

export default DeclinedJobRoutes;
