import React from 'react';
import {useSelector} from 'react-redux';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch
} from 'react-router-dom';
import JobPageMenu from '../JobDetails/PageMenu';
import ActiveJobCrew from './Crew';
import JobHeader from './JobHeader';
import BookCrewModals from '@iso/containers/Modal/BookCrew';

const ACTIVE_JOB_MENUS = [
  {
    name: 'Crew',
    path: 'crew',
    pattern: '/companies/:companyId/jobs/:jobId/crew',
    component: ActiveJobCrew
  },
  // {
  //   name: 'Schedule / Callsheet',
  //   path: 'schedule',
  //   pattern: '/companies/:companyId/jobs/:jobId/schedule',
  //   component: null
  // },
  // {
  //   name: 'Location',
  //   path: 'location',
  //   pattern: '/companies/:companyId/jobs/:jobId/location',
  //   component: null
  // },
  // {
  //   name: 'Job Documents',
  //   path: 'documents',
  //   pattern: '/companies/:companyId/jobs/:jobId/documents',
  //   component: null
  // },
  // {
  //   name: 'Pre-Production Book',
  //   path: 'pre-production',
  //   pattern: '/companies/:companyId/jobs/:jobId/pre-production',
  //   component: null
  // }
];

const ActiveJobRoutes = () => {
  const { url } = useRouteMatch();
  const { job } = useSelector(state => state.ProducerJob);

  return (
    <>
      <JobHeader job={job} />
      {/*<JobPageMenu menus={ACTIVE_JOB_MENUS} color="#51369a" />*/}
      <BookCrewModals />
      <Switch>
        {ACTIVE_JOB_MENUS.map((menu, index) => (
          <Route
            path={`${url}/${menu.path}`}
            component={menu.component}
            key={`active-job-routes_${index}`}
          />
        ))}
        <Redirect to={`${url}/crew`} />
      </Switch>
    </>
  );
};

export default ActiveJobRoutes;
