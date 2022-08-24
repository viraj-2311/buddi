import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import ContractorJobBoard from './JobBoard';
import ContractorJobDetails from './routes/JobDetails';
import ContractorCallsheetRoutes from './routes/Callsheet';
import DeclinedJobs from './routes/Declined/Declined';
import CompletedJobs from './routes/Completed/Completed';
import ArchiveJobs from './routes/Archive';

const JobsRoutes = () => {
  let { url } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${url}/`} component={ContractorJobBoard} />
      <Route exact path={`${url}/declined`} component={DeclinedJobs} />
      <Route exact path={`${url}/completed`} component={CompletedJobs} />
      <Route exact path={`${url}/archived`} component={ArchiveJobs} />
      <Route path={`${url}/:jobId`} component={ContractorJobDetails} />
      <Route path={`${url}/callsheets`} component={ContractorCallsheetRoutes} />
    </Switch>
  );
};

export default JobsRoutes;
