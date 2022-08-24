import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import ReinstateJobModal from '@iso/components/Modals/ReinstateJob';
import GenericJobCrew from './Generic';
import WrappedJobCrew from './Wrapped';
import JobHeader from './Generic/JobHeader';

const initialJobReinstate = {
  description: '',
  job: null,
  title: '',
  visible: false,
};
const ReinstateJobRoutes = () => {
  const { url } = useRouteMatch();
  const history = useHistory();
  const { job, companyId } = useSelector((state) => state.ProducerJob);
  const [jobReinstate, setJobReinstate] = useState(initialJobReinstate);
  const onReinstateClick = () => {
    setJobReinstate({
      description: 'Create a new gig with all the Talents on this gig.',
      job: job,
      title: 'Reinstate Gig',
      visible: true,
    });
  }

  const REINSTATE_JOBS_MENUS = [
    {
      name: 'Crew',
      path: 'crew',
      pattern: '/companies/:companyId/jobs/:jobId/crew',
      Component: job?.status == "WRAPPED"?WrappedJobCrew:GenericJobCrew,
      props:{onReinstate:onReinstateClick}
    },
  ];
  return (
    <>
      <JobHeader job={job} onReinstate={onReinstateClick} />
      {/*<JobPageMenu menus={REINSTATE_JOBS_MENUS} color="#ffc06a" />*/}
      <Switch>
        {REINSTATE_JOBS_MENUS.map((menu, index) => {          
          return(
          <Route
            path={`${url}/${menu.path}`}
            render={(props)=><menu.Component {...menu.props} {...props}/>}
            key={`reinstate_jobs_routes_${index}`}
          />
        )})}
        <Redirect to={`${url}/crew`} />
      </Switch>
      <ReinstateJobModal
        visible={jobReinstate.visible}
        container={true}
        wrapClassName={'hCentered ml-0'}
        title={jobReinstate.title}
        description={jobReinstate.description}
        confirmLoading={false}
        onFinish={() => {
          history.push(`/companies/${companyId}/jobs`);
        }}
        job={job}
        onCancel={() => setJobReinstate(initialJobReinstate)}
      />
    </>
  );
};

export default ReinstateJobRoutes;
