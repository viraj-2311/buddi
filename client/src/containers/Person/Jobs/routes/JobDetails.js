import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Loader from '@iso/components/utility/loader';
import HoldMemoJobRoutes from './HoldMemo';
import DealMemoJobRoutes from './DealMemo';
import CompletedJobRoutes from './Completed';
import DeclinedJobRoutes from './Declined';
import { fetchContractorJobDetailRequest } from '@iso/redux/contractorJob/actions';

const ContractorJobDetails = () => {
  const dispatch = useDispatch();
  const { jobId } = useParams();
  const {
    job,
    detail: { error, loading },
  } = useSelector((state) => state.ContractorJob);
  const [loader, setLoader] = useState(true);
  const [action, setAction] = useState('');

  useEffect(() => {
    setAction('details');
    dispatch(fetchContractorJobDetailRequest(jobId));
  }, [jobId]);

  useEffect(() => {
    if (!loading && !error && action === 'details') {
      setLoader(false);
    }

    if (!loading && action === 'details') {
      setAction('');
    }
  }, [loading, error]);

  if (loader) {
    return <Loader />;
  }

  if (!job.accepted && !job.decline) {
    return <HoldMemoJobRoutes />;
  }

  if (job.accepted) {
    return <DealMemoJobRoutes />;
  }

  if (job.completed) {
    return <CompletedJobRoutes />;
  }

  if (job.decline) {
    return <DeclinedJobRoutes />;
  }

  return null;
};

export default ContractorJobDetails;
