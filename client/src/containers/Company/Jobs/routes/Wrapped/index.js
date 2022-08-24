import React from 'react';
import {useSelector} from 'react-redux';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch
} from 'react-router-dom';
import WrappedJobPayment from './Payment';
import JobHeader from './JobHeader';

const WrappedJobRoutes = () => {
  const { url } = useRouteMatch();
  const { job } = useSelector(state => state.ProducerJob);

  return (
    <>
      <JobHeader job={job} />
      <Switch>
        <Route
          path={`${url}/payment`}
          component={WrappedJobPayment}
        />
        <Redirect to={`${url}/payment`} />
      </Switch>
    </>
  );
};

export default WrappedJobRoutes;
