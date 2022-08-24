import React from 'react';
import {useSelector} from 'react-redux';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch
} from 'react-router-dom';
import ContractorJobDetailsHeader from '../JobDetails/Header';
import CompletedJobDetails from './Details';

const CompletedJobRoutes = () => {
  const { url } = useRouteMatch();
  const { job } = useSelector(state => state.ContractorJob);

  return (
    <>
      <ContractorJobDetailsHeader job={job} />
      <Switch>
        <Route
          path={`${url}/`}
          component={CompletedJobDetails}
        />

        <Redirect to={`${url}/`} />
      </Switch>
    </>
  );
};

export default CompletedJobRoutes;
