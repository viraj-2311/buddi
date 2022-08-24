import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import Loader from '@iso/components/utility/loader';
import JobStatus from '@iso/enums/job_status';
import JobUpdateTypes from '@iso/enums/job_update_types';
import HoldingJobRoutes from './Holding';
import ActiveJobRoutes from './Active';
import WrappedJobRoutes from './Wrapped';
import ReinstateJobRoutes from './Reinstate';
import { fetchJobDetailsRequest } from '@iso/redux/producerJob/actions';
import JobBoardContext from '../JobBoard/JobBoardContext';
import {
  updateJobDetailsRequest,
  deleteJobRequest,
  archiveJobRequest,
} from '@iso/redux/producerJob/actions';
import JobCreateOrUpdate from '../JobBoard/Job/JobCreateOrUpdate/JobCreateOrUpdate';
import ConfirmModal from '@iso/components/Modals/Confirm';
import notify from '@iso/lib/helpers/notify';
import { showServerError } from '@iso/lib/helpers/utility';

const CompanyJobDetails = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { jobId } = useParams();
  const {
    job,
    detail: { error, loading },
  } = useSelector((state) => state.ProducerJob);
  const [loader, setLoader] = useState(true);
  const [action, setAction] = useState('');
  const [jobModal, setJobModal] = useState({ visible: false, job: null });
  const [jobConfirm, setJobConfirm] = useState({ visible: false, job: null });

  const { archiveJob } = useSelector((state) => state.ProducerJob);

  useEffect(() => {
    if (job && job.id === archiveJob.id) {
      if (!archiveJob.loading && (archiveJob.error === null || archiveJob.error === "") && action === 'archive') {
        notify('success', 'Gig archived successfully');
        history.push('../../jobs');
      }

      if ((archiveJob.error !== null || archiveJob.error !== "") && action === 'archive') {
        notify('error', showServerError(archiveJob.error));
      }

      if (!archiveJob.loading && action === 'archive') {
        setAction('');
      }
    }
  }, [archiveJob]);

  const onJobEdit = () => {
    setJobModal({ visible: true, job: job });
  };

  const onJobDelete = () => {
    setJobConfirm({ visible: true, job: job });
  };

  const onJobDeleteCancel = () => {
    setJobConfirm({ visible: false, job: null });
  };

  const handleJobDelete = () => {
    setAction('delete');
    dispatch(deleteJobRequest(jobConfirm.job.id));
  };

  const handleJobModal = (type, data) => {
    if (type === 'close') {
      setJobModal({ visible: false, job: null });
    }
  };

  const handleJobActivate = () => {
    setAction('activate');
    dispatch(
      updateJobDetailsRequest(
        job.id,
        { originalStatus: job.status, status: JobStatus.ACTIVE },
        JobUpdateTypes.ACTIVATE
      )
    );
  };

  const handleJobArchive = () => {
    setAction('archive');
    dispatch(archiveJobRequest(job.id));
  };

  useEffect(() => {
    setAction('details');
    dispatch(fetchJobDetailsRequest({ id: jobId }));
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

  let jobRoutes = null;

  if (job && job?.status === JobStatus.HOLDING) {
    jobRoutes = <HoldingJobRoutes />;
  }

  if (job && job?.status === JobStatus.ACTIVE) {
    jobRoutes = <ActiveJobRoutes />;
  }

  if (job && job?.status === JobStatus.WRAPPED) {
    jobRoutes = <WrappedJobRoutes />;
  }

  if (job && job?.isArchived) {
    jobRoutes = <ReinstateJobRoutes />;
  }

  return (
    jobRoutes && (
      <JobBoardContext.Provider
        value={{
          onEdit: onJobEdit,
          onDelete: onJobDelete,
          onActivate: handleJobActivate,
          onArchive: handleJobArchive,
        }}
      >
        <JobCreateOrUpdate
          visible={jobModal.visible}
          job={jobModal.job}
          type={jobModal.type}
          setModalData={handleJobModal}
        />

        <ConfirmModal
          visible={jobConfirm.visible}
          title='Are you sure you want to Delete this Job?'
          description='You will automatically release all holding crew and this job will be permanently deleted. This action cannot be undone.'
          confirmLoading={action === 'delete'}
          onYes={handleJobDelete}
          onNo={onJobDeleteCancel}
        />

        {jobRoutes}
      </JobBoardContext.Provider>
    )
  );
  return null;
};

export default CompanyJobDetails;
