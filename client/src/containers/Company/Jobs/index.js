import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import CompanyJobBoard from './JobBoard';
import ArchiveJobs from './routes/Archive';
import CompanyJobDetails from './routes/JobDetails';

const JobsRoutes = () => {
  let { url } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${url}/`} component={CompanyJobBoard} />
      <Route path={`${url}/archived`} component={ArchiveJobs} />
      <Route path={`${url}/:jobId`} component={CompanyJobDetails} />
    </Switch>
  );
};

export default JobsRoutes;
