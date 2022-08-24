import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import LayoutWrapper from '@iso/components/utility/layoutWrapper.js';
import JobItem from '@iso/containers/Person/Jobs/components/JobItem';
import EmptyComponent from '@iso/components/EmptyComponent';
import Box from '@iso/components/utility/box';
import Loader from '@iso/components/utility/loader';
import { fetchContractorJobsRequest } from '@iso/redux/contractorJob/actions';

const ActiveJobs = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { jobs, list: fetchMemoListRequest } = useSelector(
    (state) => state.ContractorJob
  );
  const { user: authUser } = useSelector((state) => state.Auth);

  useEffect(() => {
    dispatch(
      fetchContractorJobsRequest({
        contractorId: authUser.id,
        filter: { status: 'ACCEPTED' },
      })
    );
  }, [authUser]);

  const handleOpenJob = (job) => {
    history.push(`./accepted/${job.id}`);
  };

  const renderAcceptJob = (job) => {
    return (
      <Box key={`job-memo-${job.id}`}>
        <JobItem job={job} onOpen={handleOpenJob} />
      </Box>
    );
  };

  if (fetchMemoListRequest.loading) {
    return <Loader />;
  }

  return (
    <LayoutWrapper>
      <>
        {jobs.length == 0 ? (
          <EmptyComponent text="You have no active jobs" />
        ) : (
          jobs.map((job) => renderAcceptJob(job))
        )}
      </>
    </LayoutWrapper>
  );
};

export default ActiveJobs;
